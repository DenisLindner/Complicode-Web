import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    env: {
      APP_URL: 'http://localhost:3001',
      API_URL: 'http://api.test/api/',
      INTERNAL_API_KEY: 'test-internal-key-with-at-least-32-chars',
      SESSION_SECRET: 'test-session-secret-with-at-least-32-chars',
      TRUSTED_PROXY_HOPS: '1',
    },
    alias: {
      // `server-only` throws outside of React Server Components.
      'server-only': fileURLToPath(
        new URL('./test/server-only.ts', import.meta.url),
      ),
    },
  },
});
