import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  projects: [
    { name: "http", testMatch: "auth-http.spec.ts" },
    {
      name: "desktop",
      testMatch: [
        "auth-ui.spec.ts",
        "mfa-ui.spec.ts",
        "recovery-ui.spec.ts",
        "pairing-ui.spec.ts",
      ],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: [
        "auth-ui.spec.ts",
        "mfa-ui.spec.ts",
        "recovery-ui.spec.ts",
        "pairing-ui.spec.ts",
      ],
      use: { ...devices["Pixel 7"] },
    },
  ],
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  use: { baseURL: "http://127.0.0.1:3102", trace: "off" },
  webServer: {
    command: "npm run start -- --port 3102",
    url: "http://127.0.0.1:3102/api/health",
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      RECOVERY_COOKIE_KEY: randomBytes(32).toString("base64url"),
      APP_ORIGIN: "http://127.0.0.1:3102",
      SUPABASE_AUTH_URL: "http://127.0.0.1:55433",
      DATABASE_URL: `postgresql://ourspace_runtime:${readFileSync(".local/runtime-db-password", "utf8").trim()}@127.0.0.1:55432/ourspace`,
    },
  },
});
