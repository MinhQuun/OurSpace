import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['integration/auth-provider.test.ts'], fileParallelism: false },
});
