import "server-only";
import { createDatabase } from "./database.server";
import { AuthProvider } from "../modules/m10/auth/provider.server";
import { SessionService } from "../modules/m10/auth/session.server";

let instance:
  | {
      origin: string;
      secure: boolean;
      provider: AuthProvider;
      sessions: SessionService;
    }
  | undefined;
export function authRuntime() {
  if (instance) return instance;
  const origin = new URL(process.env.APP_ORIGIN ?? "");
  if (
    origin.origin !== process.env.APP_ORIGIN ||
    origin.username ||
    origin.password ||
    (origin.protocol !== "https:" &&
      !(
        origin.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(origin.hostname)
      ))
  ) {
    throw new Error("Auth configuration unavailable");
  }
  const provider = new AuthProvider(
    process.env.SUPABASE_AUTH_URL ?? "",
    process.env.SUPABASE_PUBLISHABLE_KEY,
  );
  const db = createDatabase(process.env.DATABASE_URL ?? "");
  instance = {
    origin: origin.origin,
    secure: origin.protocol === "https:",
    provider,
    sessions: new SessionService(db, provider),
  };
  return instance;
}
