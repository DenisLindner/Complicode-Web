'use server';

import { getLocale, getTranslations } from 'next-intl/server';
import { redirect as redirectTo } from 'next/navigation';
import { localizedPath } from '@/i18n/paths';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { safeRedirectPath } from '@/lib/redirect';
import {
  apiFailure,
  validationFailure,
  type ActionResult,
} from '@/lib/server/action-result';
import { api } from '@/lib/server/api';
import { isApiError } from '@/lib/server/api-error';
import { saveUserLocale } from '@/lib/server/locale';
import {
  clearSession,
  getRefreshToken,
  saveSession,
} from '@/lib/server/session';
import type { TokenResponse } from '@/lib/server/session-cookies';
import {
  createAuthSchemas,
  type LoginInput,
  type RegisterInput,
} from '@/lib/validation/auth';

export async function login(
  input: LoginInput,
  next?: string,
): Promise<ActionResult<keyof LoginInput>> {
  const [t, validation, locale] = await Promise.all([
    getTranslations('actions.auth'),
    getTranslations('validation'),
    getLocale() as Promise<Locale>,
  ]);

  const parsed = createAuthSchemas(validation).loginSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const tokens = await api<TokenResponse>('/auth/login', {
      method: 'POST',
      body: parsed.data,
      auth: 'none',
    });
    await saveSession(tokens);
    // The emails and bot messages follow the language of the website.
    await saveUserLocale(locale, tokens.accessToken);
  } catch (error) {
    return await apiFailure(error, { 401: t('wrongCredentials') });
  }

  // `next` already carries the language prefix of the page that asked for it.
  redirectTo(safeRedirectPath(next, localizedPath('/app', locale)));
}

export async function register(
  input: RegisterInput,
): Promise<ActionResult<keyof RegisterInput>> {
  const [t, validation, locale] = await Promise.all([
    getTranslations('actions.auth'),
    getTranslations('validation'),
    getLocale() as Promise<Locale>,
  ]);

  const parsed = createAuthSchemas(validation).registerSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    await saveSession(
      await api<TokenResponse>('/auth/register', {
        method: 'POST',
        body: { ...parsed.data, locale },
        auth: 'none',
      }),
    );
  } catch (error) {
    if (isApiError(error, 409)) {
      return { ok: false, code: 'EMAIL_TAKEN', error: t('emailTaken') };
    }
    return await apiFailure(error);
  }

  redirectTo(getPathname({ href: '/welcome', locale }));
}

export async function logout() {
  const [refreshToken, locale] = await Promise.all([
    getRefreshToken(),
    getLocale() as Promise<Locale>,
  ]);
  if (refreshToken) {
    // Ends the Keycloak session; the cookies are cleared either way.
    await api('/auth/logout', {
      method: 'POST',
      body: { refreshToken },
      auth: 'none',
    }).catch((error: unknown) => console.error(error));
  }

  await clearSession();
  redirectTo(getPathname({ href: '/', locale }));
}
