"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { usePreferences } from "../../preference-runtime";
type Invite = {
  id: string;
  state: string;
  version: string;
  expires_at: string;
  creator_id: string;
  creator_name: string | null;
  recipient_id: string | null;
  recipient_name: string | null;
  space_id: string | null;
};
const labels: Record<string, string> = {
  pending: "Chờ người nhận",
  awaiting_confirmation: "Chờ người mời xác nhận",
  consumed: "Đã ghép đôi",
  revoked: "Đã thu hồi",
  rejected: "Đã từ chối",
  expired: "Đã hết hạn",
};
class RequestLimitError extends Error {}
function checkRequestLimit(response: Response) {
  if (response.status !== 429) return;
  const seconds = Number(response.headers.get("Retry-After"));
  throw new RequestLimitError(
    Number.isSafeInteger(seconds) && seconds > 0 && seconds <= 86400
      ? `Bạn thao tác quá nhanh. Hãy chờ ${seconds} giây rồi thử lại.`
      : "Bạn thao tác quá nhanh. Hãy chờ một lúc rồi thử lại.",
  );
}
async function post(action: string, data: object) {
  const response = await fetch(`/api/pairing/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  checkRequestLimit(response);
  if (!response.ok)
    throw new Error(
      "Không thể thực hiện. Hãy làm mới trạng thái; lời mời có thể hết hạn, bị thu hồi hoặc tài khoản chưa đủ điều kiện.",
    );
  return response.json();
}
export default function PairingPanel() {
  const { formatDateTime } = usePreferences();
  const capability = useRef<{ id: string; token: string } | null>(null);
  const commands = useRef(new Map<string, string>());
  const [actor, setActor] = useState("");
  const [items, setItems] = useState<Invite[]>([]);
  const [preview, setPreview] = useState<Invite | null>(null);
  const [created, setCreated] = useState<{ id: string; link: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const refresh = useCallback(async () => {
    const session = await fetch("/api/auth/session", { cache: "no-store" });
    if (session.status === 401) {
      setActor("");
      setItems([]);
      setPreview(null);
      setCreated(null);
      return;
    }
    if (!session.ok) throw new Error("Chưa thể tải phiên đăng nhập.");
    setActor((await session.json()).accountId);
    const response = await fetch("/api/pairing/list", { cache: "no-store" });
    if (!response.ok) {
      setItems([]);
      setPreview(null);
      checkRequestLimit(response);
      throw new Error("Chưa thể tải lời mời.");
    }
    const data = await response.json();
    setItems(data.invitations);
    if (capability.current) {
      try {
        setPreview(await post("inspect", capability.current));
      } catch (error) {
        setPreview(null);
        if (error instanceof RequestLimitError) throw error;
        throw new Error(
          "Link mời không còn hợp lệ hoặc bạn không có quyền xem. Hãy xin link mới từ người mời.",
        );
      }
    }
  }, []);
  useEffect(() => {
    const hash = new URLSearchParams(location.hash.slice(1));
    if (hash.get("id") && hash.get("token"))
      capability.current = { id: hash.get("id")!, token: hash.get("token")! };
    history.replaceState(null, "", location.pathname);
    let disposed = false;
    Promise.resolve()
      .then(refresh)
      .catch((error) => {
        if (!disposed) {
          setFailed(true);
          setMessage(error.message);
        }
      })
      .finally(() => {
        if (!disposed) setLoading(false);
      });
    return () => {
      disposed = true;
    };
  }, [refresh]);
  async function run(action: string, item?: Invite) {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    setMessage("");
    try {
      if (action === "refresh") {
        await refresh();
        return;
      }
      if (action === "create") {
        const result = await post("create", { confirmed: true });
        const hash = new URLSearchParams({
          id: result.id,
          token: result.token,
        });
        setCreated({
          id: result.id,
          link: `${location.origin}/account/pairing#${hash}`,
        });
      } else if (item) {
        const key = `${item.id}:${item.version}:${action}`;
        if (!commands.current.has(key))
          commands.current.set(key, crypto.randomUUID());
        await post(action, {
          id: item.id,
          commandId: commands.current.get(key),
          confirmed: true,
          ...(action === "confirm"
            ? { recipientId: item.recipient_id, version: Number(item.version) }
            : {}),
          ...(["accept", "reject"].includes(action)
            ? { token: capability.current?.token }
            : {}),
        });
        if (action === "reject") {
          capability.current = null;
          setPreview(null);
        }
      }
      await refresh();
      setMessage("Đã lưu thay đổi. Kiểm tra trạng thái lời mời bên dưới.");
    } catch (error) {
      setFailed(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Mất kết nối. Hãy làm mới trạng thái trước khi thử lại.",
      );
    } finally {
      setBusy(false);
    }
  }
  function submit(
    event: FormEvent<HTMLFormElement>,
    action: string,
    item?: Invite,
  ) {
    event.preventDefault();
    void run(action, item);
  }
  const visible =
    preview && !items.some((i) => i.id === preview.id)
      ? [preview, ...items]
      : items;
  const share =
    created && items.some((i) => i.id === created.id && i.state === "pending")
      ? created.link
      : null;
  return (
    <section
      className="account-card mfa-settings pairing-panel"
      aria-busy={busy || loading}
    >
      <h1>Ghép đôi</h1>
      <p>
        Hai tài khoản độc lập. Chỉ ghép đôi sau khi cả hai kiểm tra đúng danh
        tính và đồng ý. Nội dung Private không tự được chia sẻ.
      </p>
      {message && (
        <p role={failed ? "alert" : "status"} className="form-message">
          {message}
        </p>
      )}
      {loading ? (
        <p>Đang tải…</p>
      ) : !actor ? (
        <p>
          <Link href="/account">Đăng nhập để tiếp tục</Link>. Sau khi đăng nhập,
          mở lại link mời ban đầu.
        </p>
      ) : (
        <>
          <button disabled={busy} onClick={() => void run("refresh")}>
            Làm mới trạng thái
          </button>
          <form onSubmit={(event) => submit(event, "create")}>
            <fieldset disabled={busy}>
              <label>
                <input type="checkbox" required /> Tôi muốn tạo lời mời ghép
                đôi, hiệu lực 48 giờ.
              </label>
              <button>Tạo lời mời</button>
            </fieldset>
          </form>
          {share && (
            <div>
              <label>
                Link mời
                <input
                  readOnly
                  value={share}
                  onFocus={(event) => event.currentTarget.select()}
                />
              </label>
              <p>
                Chỉ gửi cho người bạn muốn ghép đôi. Link chỉ hiện ở lần tạo
                này; nếu mất link, thu hồi lời mời rồi tạo mới.
              </p>
            </div>
          )}
          <p>
            Hiển thị tối đa 100 lời mời gần nhất. Bấm làm mới để nhận trạng thái
            từ người kia.
          </p>
          {visible.map((item) => (
            <article
              key={item.id}
              className="pairing-invitation"
              data-testid="pairing-invitation"
            >
              <h2>{labels[item.state] ?? "Không khả dụng"}</h2>
              <p>
                Người mời:{" "}
                <strong>{item.creator_name ?? "Không khả dụng"}</strong>
                <br />
                <small>{item.creator_id}</small>
              </p>
              {item.recipient_id && (
                <p>
                  Người nhận:{" "}
                  <strong>{item.recipient_name ?? "Không khả dụng"}</strong>
                  <br />
                  <small>{item.recipient_id}</small>
                </p>
              )}
              <p>Hết hạn: {formatDateTime(item.expires_at)}</p>
              {item.space_id && (
                <p>
                  Space: <small>{item.space_id}</small>
                </p>
              )}
              {item.creator_id === actor &&
                ["pending", "awaiting_confirmation"].includes(item.state) && (
                  <>
                    {item.state === "awaiting_confirmation" && (
                      <form
                        onSubmit={(event) => submit(event, "confirm", item)}
                      >
                        <fieldset disabled={busy}>
                          <label>
                            <input type="checkbox" required /> Tôi đã kiểm tra
                            đúng người nhận ở trên và đồng ý ghép đôi.
                          </label>
                          <button>Xác nhận ghép đôi</button>
                        </fieldset>
                      </form>
                    )}
                    <form onSubmit={(event) => submit(event, "revoke", item)}>
                      <fieldset disabled={busy}>
                        <label>
                          <input type="checkbox" required /> Tôi muốn thu hồi
                          lời mời này.
                        </label>
                        <button>Thu hồi lời mời</button>
                      </fieldset>
                    </form>
                  </>
                )}
              {item.creator_id !== actor &&
                item.state === "pending" &&
                preview?.id === item.id && (
                  <>
                    <form onSubmit={(event) => submit(event, "accept", item)}>
                      <fieldset disabled={busy}>
                        <label>
                          <input type="checkbox" required /> Tôi đã kiểm tra
                          đúng người mời ở trên và đồng ý.
                        </label>
                        <button>Chấp nhận lời mời</button>
                      </fieldset>
                    </form>
                    <form onSubmit={(event) => submit(event, "reject", item)}>
                      <fieldset disabled={busy}>
                        <label>
                          <input type="checkbox" required /> Tôi muốn từ chối
                          lời mời này.
                        </label>
                        <button>Từ chối lời mời</button>
                      </fieldset>
                    </form>
                  </>
                )}
            </article>
          ))}
        </>
      )}
    </section>
  );
}
