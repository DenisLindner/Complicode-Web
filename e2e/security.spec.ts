import { expect, test, register } from './helpers';

test('pages send the security headers and a nonce based CSP', async ({
  request,
}) => {
  const response = await request.get('/');
  const headers = response.headers();

  expect(headers['x-powered-by']).toBeUndefined();
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['strict-transport-security']).toContain('max-age=');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');

  const csp = headers['content-security-policy'];
  const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
  expect(nonce).toBeTruthy();
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");

  // Every script carries this request's nonce.
  const html = await response.text();
  const scripts = html.match(/<script\b[^>]*>/g) ?? [];
  expect(scripts.length).toBeGreaterThan(0);
  for (const script of scripts) {
    expect(script).toContain(`nonce="${nonce}"`);
  }
});

test('the nonce changes on every request', async ({ request }) => {
  const nonce = async () =>
    (await request.get('/')).headers()['content-security-policy'];
  expect(await nonce()).not.toBe(await nonce());
});

test('the API address never reaches the browser', async ({ page }) => {
  await register(page);
  const html = await page.content();
  expect(html).not.toContain('localhost:3000');

  const scripts = await page.evaluate(() =>
    [...document.scripts].map((script) => script.src).filter(Boolean),
  );
  for (const src of scripts) {
    const body = await (await fetch(src)).text();
    expect(body).not.toContain('localhost:3000/api');
    expect(body).not.toContain('INTERNAL_API_KEY');
  }
});

test('BFF routes refuse cross-site requests', async ({ page, context }) => {
  await register(page);
  const cookie = (await context.cookies())
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  const crossSite = await fetch('http://localhost:3001/bff/verificacao', {
    headers: {
      cookie,
      'sec-fetch-site': 'cross-site',
      origin: 'https://evil.example',
    },
  });
  expect(crossSite.status).toBe(403);

  const sameOrigin = await fetch('http://localhost:3001/bff/verificacao', {
    headers: { cookie, 'sec-fetch-site': 'same-origin' },
  });
  expect(sameOrigin.status).toBe(200);
  expect(Object.keys(await sameOrigin.json()).sort()).toEqual([
    'credits',
    'emailVerified',
    'phoneVerified',
  ]);
});

test('a tampered session is rejected and cleared', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addCookies(
    ['__Host-cc_session', '__Host-cc_refresh'].map((name) => ({
      name,
      value: 'tampered.a.b.c.d',
      domain: 'localhost',
      path: '/',
      secure: true,
      httpOnly: true,
    })),
  );
  const page = await context.newPage();

  await page.goto('/app');
  await expect(page).toHaveURL(/\/entrar\?next=%2Fapp$/);
  expect(await context.cookies()).toEqual([]);
  await context.close();
});

test('an expired access token is renewed once for parallel requests', async ({
  page,
  context,
}) => {
  await register(page);
  const refresh = (await context.cookies()).find(
    ({ name }) => name === '__Host-cc_refresh',
  )!;

  // Only the refresh cookie, as after 30 minutes; Keycloak rejects reuse,
  // so every parallel request must share one renewal.
  const responses = await Promise.all(
    Array.from({ length: 5 }, () =>
      fetch('http://localhost:3001/app', {
        headers: { cookie: `${refresh.name}=${refresh.value}` },
        redirect: 'manual',
      }),
    ),
  );
  for (const response of responses) {
    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie().join()).toContain(
      '__Host-cc_session',
    );
  }
});
