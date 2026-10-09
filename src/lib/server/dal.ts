import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { api } from './api';
import { isApiError } from './api-error';

/** What the API returns; never sent to the browser as is. */
interface ApiUser {
  id: string;
  keycloakId: string;
  name: string;
  email: string;
  phone: string | null;
  telegramId: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  credits: number;
}

/** The fields the interface needs, safe to pass to Client Components. */
export interface CurrentUser {
  name: string;
  firstName: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  /** Both email and phone verified (the signup bonus was granted). */
  verified: boolean;
  credits: number;
}

export function toCurrentUser(user: ApiUser): CurrentUser {
  return {
    name: user.name,
    firstName: user.name.split(' ')[0],
    email: user.email,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    verified: user.emailVerified && user.phoneVerified,
    credits: user.credits,
  };
}

/** The logged in user, once per request. Null without a valid session. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    return toCurrentUser(await api<ApiUser>('/users/me'));
  } catch (error) {
    if (isApiError(error, 401)) {
      return null;
    }
    throw error;
  }
});

/**
 * The logged in user, or a redirect to the login. A session cookie the API
 * no longer accepts (revoked in Keycloak) is cleared on the way.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sessao-expirada');
  }
  return user;
}
