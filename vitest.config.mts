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
    alias: {
      // `server-only` throws outside of React Server Components.
      'server-only': fileURLToPath(
        new URL('./test/server-only.ts', import.meta.url),
      ),
    },
  },
});
