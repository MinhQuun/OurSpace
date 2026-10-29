import { MediaService } from "../modules/m02/media/service.server";
import { PermissionService } from "../modules/m10/permissions/service.server";
import { ProfileService } from "../modules/m10/profile/service.server";
import { SpaceService } from "../modules/m10/spaces/service.server";
import "server-only";
import { PairingService } from "../modules/m10/pairing/service.server";
import { createDatabase } from "./database.server";
import { AuthProvider } from "../modules/m10/auth/provider.server";
import { SessionService } from "../modules/m10/auth/session.server";
import { MfaService } from "../modules/m10/auth/mfa.server";

import { RecoveryService } from "../modules/m10/auth/recovery.server";
import { NotificationService } from "../modules/m10/notifications/service.server";
import { TrashService } from "../modules/m10/trash/service.server";
import { ExportService } from "../modules/m10/export/service.server";
import { BackupService } from "../modules/m10/backup/service.server";

let instance:
  | {
      origin: string;
      secure: boolean;
      provider: AuthProvider;
      sessions: SessionService;
      mfa: MfaService;
      recovery: RecoveryService;
      pairing: PairingService;
      spaces: SpaceService;
      permissions: PermissionService;
      profile: ProfileService;
      notifications: NotificationService;
      trash: TrashService;
      export: ExportService;
      backup: BackupService;
      media: MediaService;
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
    mfa: new MfaService(db, provider),
    recovery: new RecoveryService(db, provider),
    pairing: new PairingService(db),
    spaces: new SpaceService(db, provider),
    permissions: new PermissionService(db),
    profile: new ProfileService(db),
    notifications: new NotificationService(db),
    trash: new TrashService(db),
    export: new ExportService(db),
    backup: new BackupService(db),
    media: new MediaService(db),
  };
  return instance;
}
