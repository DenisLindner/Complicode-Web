import 'server-only';
import { cookies } from 'next/headers';
import {
  buildSessionCookies,
  expiredSessionCookies,
  readAccessToken,
  readRefreshToken,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  type TokenResponse,
} from './session-cookies';

/** Session helpers for Server Components, Server Actions and Route Handlers. */

export async function getAccessToken() {
  return readAccessToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function getRefreshToken() {
  return readRefreshToken((await cookies()).get(REFRESH_COOKIE)?.value);
}

/** Only works where cookies can be written (Server Actions, Route Handlers). */
export async function saveSession(tokens: TokenResponse) {
  const store = await cookies();
  for (const cookie of await buildSessionCookies(tokens)) {
    store.set(cookie);
  }
}

/** Only works where cookies can be written (Server Actions, Route Handlers). */
export async function clearSession() {
  const store = await cookies();
  for (const cookie of expiredSessionCookies()) {
    store.set(cookie);
  }
}
