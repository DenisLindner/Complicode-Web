import { expect, test, register } from './helpers';

const noHorizontalScroll = async (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );

for (const path of ['/', '/explorar', '/entrar', '/cadastro']) {
  test(`${path} fits the phone screen`, async ({ page }) => {
    await page.goto(path);
    expect(await noHorizontalScroll(page)).toBe(true);
  });
}

test('the app uses a bottom tab bar on phones', async ({ page }) => {
  await register(page);
  await page.goto('/app');

  const tabs = page.getByRole('navigation', { name: 'Principal' }).last();
  await expect(tabs).toBeVisible();
  await tabs.getByRole('link', { name: 'Gerar' }).click();
  await expect(page).toHaveURL(/\/app\/gerar$/);
  expect(await noHorizontalScroll(page)).toBe(true);
});
