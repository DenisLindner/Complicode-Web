'use server';

import { redirect } from 'next/navigation';
import { safeRedirectPath } from '@/lib/redirect';
import {
  apiFailure,
  validationFailure,
  type ActionResult,
} from '@/lib/server/action-result';
import { api } from '@/lib/server/api';
import {
  clearSession,
  getRefreshToken,
  saveSession,
} from '@/lib/server/session';
import type { TokenResponse } from '@/lib/server/session-cookies';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@/lib/validation/auth';

export async function login(
  input: LoginInput,
  next?: string,
): Promise<ActionResult<keyof LoginInput>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    await saveSession(
      await api<TokenResponse>('/auth/login', {
        method: 'POST',
        body: parsed.data,
        auth: 'none',
      }),
    );
  } catch (error) {
    return apiFailure(error, { 401: 'Email ou senha incorretos.' });
  }

  redirect(safeRedirectPath(next));
}

export async function register(
  input: RegisterInput,
): Promise<ActionResult<keyof RegisterInput>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    await saveSession(
      await api<TokenResponse>('/auth/register', {
        method: 'POST',
        body: parsed.data,
        auth: 'none',
      }),
    );
  } catch (error) {
    return apiFailure(error, {
      409: 'Este email já está cadastrado. Que tal entrar?',
    });
  }

  redirect('/app');
}

export async function logout() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    // Ends the Keycloak session; the cookies are cleared either way.
    await api('/auth/logout', {
      method: 'POST',
      body: { refreshToken },
      auth: 'none',
    }).catch((error: unknown) => console.error(error));
  }

  await clearSession();
  redirect('/');
}
