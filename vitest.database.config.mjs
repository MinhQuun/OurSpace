import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Use the package's real server entry point for server-only imports.
  resolve: { alias: {
    'server-only': fileURLToPath(new URL('./node_modules/server-only/empty.js', import.meta.url)),
  } },
  test: {
    include: ['integration/database.test.ts'], fileParallelism: false,
  },
});
