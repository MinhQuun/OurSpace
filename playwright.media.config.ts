import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { localStorageToken } from "./e2e/support/local-storage";
export default defineConfig({
 testDir:"./e2e",projects:[{name:"http",testMatch:"media-http.spec.ts"},{name:"desktop",testMatch:"media-ui.spec.ts",use:{...devices["Desktop Chrome"]}},{name:"mobile",testMatch:"media-ui.spec.ts",use:{...devices["Pixel 7"]}}],workers:1,forbidOnly:Boolean(process.env.CI),retries:0,
 use:{baseURL:"http://127.0.0.1:3103",trace:"off"},
 webServer:{command:"npm run start -- --port 3103",url:"http://127.0.0.1:3103/api/health",reuseExistingServer:false,timeout:60000,
 env:{APP_ORIGIN:"http://127.0.0.1:3103",RECOVERY_COOKIE_KEY:randomBytes(32).toString("base64url"),
 SUPABASE_AUTH_URL:"http://127.0.0.1:55433",SUPABASE_STORAGE_URL:"http://127.0.0.1:55435",
 SUPABASE_STORAGE_SERVER_TOKEN:localStorageToken(),MEDIA_MAX_UPLOAD_BYTES:"100000",MEDIA_MAX_IMAGE_PIXELS:"10000",MEDIA_DECODE_TIMEOUT_SECONDS:"5",MEDIA_PREVIEW_MAX_EDGE:"8",
 DATABASE_URL:`postgresql://ourspace_runtime:${readFileSync(".local/runtime-db-password","utf8").trim()}@127.0.0.1:55432/ourspace`}}
});
