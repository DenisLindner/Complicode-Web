import {
  emailSubject,
  expect,
  PASSWORD,
  test,
  uniqueEmail,
  visitorHeaders,
} from './helpers';

test('English is the base language, with no URL prefix', async ({
  browser,
}) => {
  const context = await browser.newContext({
    locale: 'en-US',
    extraHTTPHeaders: visitorHeaders(),
  });
  const page = await context.newPage();

  await page.goto('/');
  await expect(page).toHaveURL(/localhost:3001\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Enough with to-do lists.',
  );

  await page.getByRole('banner').getByRole('link', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await context.close();
});

test('the browser language picks the language of the first visit', async ({
  browser,
}) => {
  for (const [locale, prefix, heading] of [
    ['pt-BR', '/pt', 'Chega de to-do list.'],
    ['es-AR', '/es', 'Basta de to-do lists.'],
  ] as const) {
    const context = await browser.newContext({
      locale,
      extraHTTPHeaders: visitorHeaders(),
    });
    const page = await context.newPage();

    await page.goto('/');
    await expect(page).toHaveURL(new RegExp(`${prefix}$`));
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      heading,
    );
    await context.close();
  }
});

test('the language switcher keeps the page and is remembered', async ({
  browser,
}) => {
  const context = await browser.newContext({
    locale: 'en-US',
    extraHTTPHeaders: visitorHeaders(),
  });
  const page = await context.newPage();

  await page.goto('/signup');
  await page.getByRole('button', { name: 'Language' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();

  // Same page, translated address and content.
  await expect(page).toHaveURL(/\/es\/registro$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(
    page.getByRole('heading', { name: 'Crea tu cuenta' }),
  ).toBeVisible();

  // The choice is remembered: an unprefixed address follows it.
  await page.goto('/login');
  await expect(page).toHaveURL(/\/es\/ingresar$/);
  await context.close();
});

test('validation and server errors follow the language of the page', async ({
  browser,
}) => {
  const context = await browser.newContext({
    locale: 'en-US',
    extraHTTPHeaders: visitorHeaders(),
  });
  const page = await context.newPage();

  await page.goto('/signup');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText('Use at least 3 characters')).toBeVisible();
  await expect(page.getByText('Enter your email')).toBeVisible();

  await page.goto('/es/ingresar');
  await page.getByLabel('Correo').fill(uniqueEmail('ghost'));
  await page.getByLabel('Contraseña', { exact: true }).fill('Errada123');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.locator('[data-slot=alert]')).toHaveText(
    'Correo o contraseña incorrectos.',
    { timeout: 15_000 },
  );
  await context.close();
});

test('protected pages send visitors to the login of their language', async ({
  request,
}) => {
  const check = async (path: string, expected: RegExp) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(expected);
  };

  await check('/app', /\/login\?next=%2Fapp$/);
  await check('/pt/app/desafios', /\/pt\/entrar\?next=%2Fpt%2Fapp%2Fdesafios$/);
  await check('/es/app', /\/es\/ingresar\?next=%2Fes%2Fapp$/);
});

test('the language chosen at signup reaches the API: the email follows it', async ({
  browser,
}) => {
  const email = uniqueEmail('lang');
  const context = await browser.newContext({
    locale: 'en-US',
    extraHTTPHeaders: visitorHeaders(),
  });
  const page = await context.newPage();

  await page.goto('/es/registro');
  await page.getByLabel('Nombre').fill('Prueba E2E');
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page).toHaveURL(/\/es\/bienvenida$/, { timeout: 20_000 });

  // The onboarding sends the code on its own, in the language of the account.
  await page.getByRole('link', { name: 'Comenzar verificación' }).click();
  expect(await emailSubject(email)).toMatch(
    /es tu código de verificación de Complicode$/,
  );
  await context.close();
});

test('switching the language updates the language of the emails', async ({
  browser,
}) => {
  const email = uniqueEmail('switch');
  const context = await browser.newContext({
    locale: 'pt-BR',
    extraHTTPHeaders: visitorHeaders(),
  });
  const page = await context.newPage();

  await page.goto('/pt/cadastro');
  await page.getByLabel('Nome').fill('Teste E2E');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/pt\/boas-vindas$/, { timeout: 20_000 });

  // Switch to English before the first code is requested.
  await page.getByRole('button', { name: 'Idioma' }).click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/welcome$/);

  await page.getByRole('link', { name: 'Start verification' }).click();
  expect(await emailSubject(email)).toMatch(
    /is your Complicode verification code$/,
  );
  await context.close();
});

test('sitemap and robots list every language', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const path of ['/pt/entrar', '/es/ingresar', '/login', '/pt/explorar']) {
    expect(sitemap).toContain(path);
  }

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /pt/app');
  expect(robots).toContain('Disallow: /es/bienvenida');
});

test('after signing in, logging out and back in, the user stays in their language', async ({
  browser,
}) => {
  for (const [home, signup, login, labels] of [
    [
      /localhost:3001\/es\/app$/,
      '/es/registro',
      '/es/ingresar',
      {
        name: 'Nombre',
        email: 'Correo',
        password: 'Contraseña',
        create: 'Crear cuenta',
        menu: 'Menú de la cuenta',
        logout: 'Salir',
        submit: 'Ingresar',
        welcome: /\/es\/bienvenida$/,
        loggedOut: /localhost:3001\/es$/,
        greeting: 'Hola',
      },
    ],
    [
      /localhost:3001\/app$/,
      '/signup',
      '/login',
      {
        name: 'Name',
        email: 'Email',
        password: 'Password',
        create: 'Create account',
        menu: 'Account menu',
        logout: 'Sign out',
        submit: 'Sign in',
        welcome: /\/welcome$/,
        loggedOut: /localhost:3001\/$/,
        greeting: 'Hi',
      },
    ],
  ] as const) {
    const context = await browser.newContext({
      locale: 'en-US',
      extraHTTPHeaders: visitorHeaders(),
    });
    const page = await context.newPage();
    const email = uniqueEmail('stay');

    await page.goto(signup);
    await page.getByLabel(labels.name).fill('Flow Test');
    await page.getByLabel(labels.email).fill(email);
    await page.getByLabel(labels.password, { exact: true }).fill(PASSWORD);
    await page.getByRole('button', { name: labels.create }).click();
    await expect(page).toHaveURL(labels.welcome, { timeout: 20_000 });

    await page.getByRole('button', { name: labels.menu }).click();
    await page.getByRole('menuitem', { name: labels.logout }).click();
    await expect(page).toHaveURL(labels.loggedOut);

    await page.goto(login);
    await page.getByLabel(labels.email).fill(email);
    await page.getByLabel(labels.password, { exact: true }).fill(PASSWORD);
    await page
      .getByRole('button', { name: labels.submit, exact: true })
      .click();
    await expect(page).toHaveURL(home, { timeout: 20_000 });
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      labels.greeting,
    );
    await context.close();
  }
});
