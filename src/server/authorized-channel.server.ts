import "server-only";
import type { Server, IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import { WebSocket, WebSocketServer } from "ws";

type Client = {
  socket: WebSocket;
  session: string;
  resource: string;
  queue: Promise<void>;
  pending: number;
};
/** Read-channel transport POC. Domain authorization must include live session,
 * source ACL and domain restrictions; no cached join permission or client writes.
 */
export class AuthorizedChannel {
  private readonly ws = new WebSocketServer({
    noServer: true,
    maxPayload: 1024,
    perMessageDeflate: false,
  });
  private readonly clients = new Set<Client>();
  private readonly timer: ReturnType<typeof setInterval>;
  private checking = false;
  private stopped = false;
  constructor(
    private readonly server: Server,
    private readonly origin: string,
    private readonly authorize: (
      session: string,
      resource: string,
    ) => Promise<boolean>,
  ) {
    if (new URL(origin).origin !== origin)
      throw new Error("Invalid channel origin");
    server.on("upgrade", this.upgrade);
    this.timer = setInterval(() => {
      void this.revalidate();
    }, 15_000);
    this.timer.unref();
  }
  private upgrade = (
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ) => {
    socket.on("error", () => {});
    const timeout = setTimeout(() => socket.destroy(), 5000);
    const reject = () => {
      socket.end(
        "HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 0\r\n\r\n",
      );
    };
    void (async () => {
      try {
        const path = /^\/channels\/([0-9a-f-]{36})$/i.exec(request.url ?? "");
        const cookies = (request.headers.cookie ?? "")
          .split(";")
          .map((v) => v.trim())
          .filter((v) => v.startsWith("ourspace_session="));
        const token =
          cookies.length === 1
            ? /^ourspace_session=[0-9a-f-]{36}:([A-Za-z0-9_-]{43})$/.exec(
                cookies[0],
              )
            : null;
        if (
          this.stopped ||
          !path ||
          !token ||
          request.headers.origin !== this.origin ||
          this.clients.size >= 100 ||
          (await this.authorize(token[1], path[1])) !== true ||
          this.stopped ||
          this.clients.size >= 100 ||
          socket.destroyed
        ) {
          reject();
          return;
        }
        this.ws.handleUpgrade(request, socket, head, (connection) => {
          const client: Client = {
            socket: connection,
            session: token[1],
            resource: path[1],
            queue: Promise.resolve(),
            pending: 0,
          };
          this.clients.add(client);
          connection.on("error", () => connection.terminate());
          connection.on("close", () => this.clients.delete(client));
          // This channel does not implement CRDT writes or echo arbitrary frames.
          connection.on("message", () =>
            connection.close(1008, "Unsupported message"),
          );
        });
      } catch {
        reject();
      } finally {
        clearTimeout(timeout);
      }
    })();
  };
  private enqueue(client: Client, payload?: Buffer) {
    if (++client.pending > 16) {
      client.socket.terminate();
      client.pending--;
      return Promise.resolve();
    }
    client.queue = client.queue
      .then(async () => {
        if (client.socket.readyState !== WebSocket.OPEN) return;
        if ((await this.authorize(client.session, client.resource)) !== true) {
          client.socket.close(4403, "Access unavailable");
          return;
        }
        if (payload) {
          if (client.socket.bufferedAmount > 65536) {
            client.socket.terminate();
            return;
          }
          await new Promise<void>((resolve, reject) =>
            client.socket.send(payload, (error) =>
              error ? reject(error) : resolve(),
            ),
          );
        }
      })
      .catch(() => {
        client.socket.close(1011, "Channel unavailable");
      })
      .finally(() => {
        client.pending--;
      });
    return client.queue;
  }
  /** Trusted server event, correctly scoped to its source. Never call with raw client payloads. */
  async publish(resource: string, payload: Uint8Array) {
    if (payload.byteLength > 65536)
      throw new Error("Channel payload too large");
    const copy = Buffer.from(payload);
    await Promise.all(
      [...this.clients]
        .filter((c) => c.resource === resource)
        .map((c) => this.enqueue(c, copy)),
    );
  }
  /** Called on lifecycle invalidation; periodic recheck also closes idle revoked sessions. */
  async revalidate() {
    if (this.checking || this.stopped) return;
    this.checking = true;
    try {
      await Promise.all([...this.clients].map((c) => this.enqueue(c)));
    } finally {
      this.checking = false;
    }
  }
  async close() {
    this.stopped = true;
    clearInterval(this.timer);
    this.server.off("upgrade", this.upgrade);
    for (const client of this.clients) client.socket.terminate();
    await new Promise<void>((resolve) => this.ws.close(() => resolve()));
  }
}
