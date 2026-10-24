import { defineConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';

export default defineConfig({
  testDir: './e2e', testMatch: 'auth-http.spec.ts', workers: 1,
  forbidOnly: Boolean(process.env.CI), retries: 0,
  use: { baseURL: 'http://127.0.0.1:3102', trace: 'off' },
  webServer: {
    command: 'npm run start -- --port 3102', url: 'http://127.0.0.1:3102/api/health',
    reuseExistingServer: false, timeout: 60000,
    env: { APP_ORIGIN: 'http://127.0.0.1:3102', SUPABASE_AUTH_URL: 'http://127.0.0.1:55433',
      DATABASE_URL: `postgresql://ourspace_runtime:${readFileSync('.local/runtime-db-password', 'utf8').trim()}@127.0.0.1:55432/ourspace` },
  },
});
