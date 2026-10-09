import { test as base, expect, type Page } from '@playwright/test';

export { expect };

const randomIp = () =>
  `198.18.${Math.floor(Math.random() * 256)}.${1 + Math.floor(Math.random() * 254)}`;

/**
 * Each test looks like a different visitor to the API rate limit (10 auth
 * calls per minute per IP). Locally there is no proxy in front of Next.js,
 * so it takes the client IP from X-Forwarded-For.
 */
export const test = base.extend({
  // oxlint-disable-next-line no-empty-pattern -- Playwright fixtures need the object pattern
  extraHTTPHeaders: async ({}, use) => {
    await use({ 'X-Forwarded-For': randomIp() });
  },
});

export const visitorHeaders = () => ({ 'X-Forwarded-For': randomIp() });

export const PASSWORD = 'Senha123';
const MAILPIT_URL = process.env.MAILPIT_URL ?? 'http://localhost:8025';

export function uniqueEmail(prefix = 'e2e') {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
}

/** Creates an account through the form; ends on the onboarding. */
export async function register(page: Page, email = uniqueEmail()) {
  await page.goto('/cadastro');
  await page.getByLabel('Nome').fill('Teste E2E');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/boas-vindas$/, { timeout: 20_000 });
  return email;
}

export async function login(page: Page, email: string, next?: string) {
  await page.goto(
    next ? `/entrar?next=${encodeURIComponent(next)}` : '/entrar',
  );
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

/** The 6-digit code from the verification email caught by Mailpit. */
export async function emailCode(email: string) {
  await expect
    .poll(
      async () => {
        const response = await fetch(
          `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(email)}`,
        );
        const data = (await response.json()) as {
          messages: { Subject: string }[];
        };
        return data.messages[0]?.Subject.match(/\d{6}/)?.[0] ?? '';
      },
      { timeout: 15_000 },
    )
    .toMatch(/^\d{6}$/);

  const response = await fetch(
    `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(email)}`,
  );
  const data = (await response.json()) as { messages: { Subject: string }[] };
  return data.messages[0].Subject.match(/\d{6}/)![0];
}
