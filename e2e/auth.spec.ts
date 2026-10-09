import {
  expect,
  login,
  register,
  test,
  uniqueEmail,
  visitorHeaders,
} from './helpers';

test('protected pages send visitors to the login', async ({ page }) => {
  await page.goto('/app/desafios');
  await expect(page).toHaveURL(/\/entrar\?next=%2Fapp%2Fdesafios$/);
});

test('signup validates on the client before calling the API', async ({
  page,
}) => {
  await page.goto('/cadastro');
  await page.getByRole('button', { name: 'Criar conta' }).click();

  await expect(page.getByText('Use pelo menos 3 caracteres')).toBeVisible();
  await expect(page.getByText('Informe seu email')).toBeVisible();
  await expect(
    page.getByText('A senha não atende aos requisitos'),
  ).toBeVisible();
});

test('signup, logout and login', async ({ page, context }) => {
  const email = await register(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Que bom ter você aqui',
  );

  // Tokens never reach the browser: httpOnly, encrypted cookies only.
  const cookies = await context.cookies();
  expect(cookies.map(({ name }) => name).sort()).toEqual([
    '__Host-cc_refresh',
    '__Host-cc_session',
  ]);
  for (const cookie of cookies) {
    expect(cookie).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });
    expect(cookie.value.split('.')).toHaveLength(5); // JWE, not a raw JWT
  }
  expect(await page.evaluate(() => document.cookie)).toBe('');
  expect(await page.content()).not.toContain('eyJ');

  await page.getByRole('button', { name: 'Menu da conta' }).click();
  await page.getByRole('menuitem', { name: 'Sair' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await context.cookies()).toEqual([]);

  await login(page, email);
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Olá');
});

test('wrong password shows a friendly error', async ({ page }) => {
  await page.goto('/entrar');
  await page.getByLabel('Email').fill(uniqueEmail('ghost'));
  await page.getByLabel('Senha', { exact: true }).fill('Errada123');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.locator('[data-slot=alert]')).toHaveText(
    'Email ou senha incorretos.',
    { timeout: 15_000 },
  );
});

test('login ignores external ?next redirects', async ({ browser }) => {
  const setup = await browser.newPage({ extraHTTPHeaders: visitorHeaders() });
  const email = await register(setup);
  await setup.close();

  const page = await browser.newPage({ extraHTTPHeaders: visitorHeaders() });
  await login(page, email, '//evil.example/phish');
  await expect(page).toHaveURL(/localhost:3001\/app$/);
  await page.close();
});

test('logged in users skip the login page', async ({ page }) => {
  await register(page);
  await page.goto('/entrar');
  await expect(page).toHaveURL(/\/app$/);
});
