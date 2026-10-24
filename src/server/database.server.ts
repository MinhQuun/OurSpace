import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

export class DatabaseUnavailableError extends Error {
  constructor() {
    super("Database operation unavailable");
    this.name = "DatabaseUnavailableError";
  }
}

/** Trusted server configuration only; no browser or request-supplied URLs. */
export function createDatabase(connectionString: string) {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new DatabaseUnavailableError();
  }
  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    url.username !== "ourspace_runtime" ||
    !url.password
  ) {
    throw new DatabaseUnavailableError();
  }
  const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  // URL SSL options can override pg's verification options. Reject them entirely.
  if (url.search || url.hash) throw new DatabaseUnavailableError();
  const pool = new Pool({
    connectionString,
    ssl: loopback ? false : { rejectUnauthorized: true },
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    statement_timeout: 10000,
    idle_in_transaction_session_timeout: 10000,
  });
  pool.on("error", () => {
    // Never include connection details, SQL parameters or provider error text.
    console.error("Database idle connection failed");
  });

  async function transaction<T>(
    work: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    let client: PoolClient | undefined;
    let discard = false;
    try {
      client = await pool.connect();
      const identity =
        await client.query(`SELECT current_user = 'ourspace_runtime'
        AND NOT rolsuper AND NOT rolcreatedb AND NOT rolcreaterole AND NOT rolbypassrls
        AND NOT EXISTS (SELECT 1 FROM pg_auth_members WHERE member = r.oid) AS safe
        FROM pg_roles r WHERE rolname = current_user`);
      if (identity.rows[0]?.safe !== true) throw new DatabaseUnavailableError();
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch {
      if (client) {
        try {
          await client.query("ROLLBACK");
        } catch {
          discard = true;
        }
      }
      throw new DatabaseUnavailableError();
    } finally {
      client?.release(discard);
    }
  }

  return {
    transaction,
    query: <T extends QueryResultRow>(text: string, values: unknown[] = []) =>
      transaction((client) => client.query<T>(text, values)),
    close: () => pool.end(),
  };
}
