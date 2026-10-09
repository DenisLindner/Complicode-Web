import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the real stack: the Complicode API (with its
 * Postgres, Keycloak and Mailpit from docker compose) must be running.
 * The web app is built and started here unless it is already up.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3001',
    trace: 'retain-on-failure',
    locale: 'pt-BR',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
