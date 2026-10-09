'use server';

import QRCode from 'qrcode';
import { z } from 'zod';
import { apiFailure, type ActionResult } from '@/lib/server/action-result';
import { api } from '@/lib/server/api';
import { isApiError } from '@/lib/server/api-error';

/** API messages (400) translated for the user. */
const EMAIL_ERRORS: Record<string, string> = {
  'Verification code expired or not found':
    'Este código expirou. Peça um novo código.',
  'Too many attempts, request a new code':
    'Muitas tentativas erradas. Peça um novo código.',
  'Invalid verification code': 'Código incorreto. Confira e tente de novo.',
  'Verification code already used': 'Este código já foi usado.',
};

function translate(error: unknown, table: Record<string, string>) {
  if (isApiError(error, 400)) {
    const message = error.messages.map((text) => table[text]).find(Boolean);
    if (message) {
      return { ok: false, error: message } satisfies ActionResult;
    }
  }
  return null;
}

export async function sendEmailCode(): Promise<
  ActionResult & { cooldown?: boolean }
> {
  try {
    await api('/verification/email/send', { method: 'POST' });
    return { ok: true };
  } catch (error) {
    if (isApiError(error, 400)) {
      // Already verified: the page moves on to the next step.
      return { ok: true };
    }
    if (isApiError(error, 429)) {
      // A code was sent less than a minute ago and is still valid.
      return {
        ok: false,
        cooldown: true,
        error:
          'Já enviamos um código há pouco. Aguarde um minuto para pedir outro.',
      };
    }
    return apiFailure(error);
  }
}

const codeSchema = z.string().regex(/^\d{6}$/, 'O código tem 6 dígitos.');

export async function confirmEmailCode(
  code: string,
): Promise<ActionResult & { bonusGranted?: boolean }> {
  const parsed = codeSchema.safeParse(code);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  try {
    const result = await api<{ bonusGranted: boolean }>(
      '/verification/email/confirm',
      { method: 'POST', body: { code: parsed.data } },
    );
    return { ok: true, bonusGranted: result.bonusGranted };
  } catch (error) {
    return translate(error, EMAIL_ERRORS) ?? apiFailure(error);
  }
}

export interface PhoneVerificationStart extends ActionResult {
  /** A link was generated less than a minute ago; try again later. */
  cooldown?: boolean;
  deepLink?: string;
  /** PNG data URL of the deep link, to scan with the phone. */
  qrCode?: string;
  expiresAt?: string;
}

export async function startPhoneVerification(): Promise<PhoneVerificationStart> {
  try {
    const { deepLink, expiresAt } = await api<{
      deepLink: string;
      expiresAt: string;
    }>('/verification/phone/start', { method: 'POST' });

    // Only Telegram links are shown or turned into a QR code.
    if (!deepLink.startsWith('https://t.me/')) {
      throw new Error('Unexpected deep link');
    }

    const qrCode = await QRCode.toDataURL(deepLink, {
      margin: 1,
      width: 240,
      color: { dark: '#211d19', light: '#ffffff' },
    });
    return { ok: true, deepLink, qrCode, expiresAt };
  } catch (error) {
    if (isApiError(error, 400)) {
      return { ok: true };
    }
    if (isApiError(error, 429)) {
      return { ok: false, cooldown: true };
    }
    return apiFailure(error);
  }
}
