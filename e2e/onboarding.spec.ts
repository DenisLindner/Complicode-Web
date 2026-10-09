import { expect, test, emailCode, register } from './helpers';

test('onboarding verifies the email and opens the Telegram step', async ({
  page,
}) => {
  const email = await register(page);

  await page.getByRole('link', { name: 'Começar verificação' }).click();
  await expect(page.getByText('Enviamos um código')).toBeVisible();
  const code = await emailCode(email);

  // A wrong code first.
  await page.locator('[data-input-otp]').click();
  await page.keyboard.type(code === '000000' ? '111111' : '000000');
  await expect(page.locator('[data-slot=alert]')).toHaveText(
    'Código incorreto. Confira e tente de novo.',
  );

  // The right one submits on its own.
  await page.locator('[data-input-otp]').click();
  await page.keyboard.type(code);
  await expect(page).toHaveURL(/etapa=telefone/, { timeout: 15_000 });

  const telegram = page.getByRole('link', { name: 'Abrir no Telegram' });
  await expect(telegram).toHaveAttribute(
    'href',
    /^https:\/\/t\.me\/\w+\?start=[\w-]+$/,
  );
  await expect(telegram).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByAltText(/QR code/)).toBeVisible();
});

test('steps cannot be skipped through the URL', async ({ page }) => {
  await register(page);
  await page.goto('/boas-vindas?etapa=pronto');
  await expect(
    page.getByRole('heading', { name: 'Confirme seu email' }),
  ).toBeVisible();
});

test('the app shows a banner until the account is verified', async ({
  page,
}) => {
  await register(page);
  await page.goto('/app');
  await expect(page.getByText('Continuar verificação')).toBeVisible();
});
