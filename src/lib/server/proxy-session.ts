import 'server-only';
import type { NextRequest } from 'next/server';
import { isApiError } from './api-error';
import { getClientIp } from './client-ip';
import { refreshTokens } from './refresh';
import {
  buildSessionCookies,
  expiredSessionCookies,
  readAccessToken,
  readRefreshToken,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  type SessionCookie,
} from './session-cookies';

export interface SessionSync {
  authenticated: boolean;
  /** Cookies to set on the response (renewed or cleared session). */
  cookies: SessionCookie[];
}

/**
 * Runs in proxy.ts before every page and Server Action: when the access token
 * is missing or about to expire, it is renewed with the refresh token. This is
 * the only place that refreshes, so a page never races another refresh.
 * The renewed cookies are also written to the request, so the render that
 * follows already uses the new token.
 */
export async function syncSession(request: NextRequest): Promise<SessionSync> {
  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  const refreshValue = request.cookies.get(REFRESH_COOKIE)?.value;

  if (await readAccessToken(sessionValue)) {
    return { authenticated: true, cookies: [] };
  }

  const refreshToken = await readRefreshToken(refreshValue);
  if (!refreshToken) {
    return clear(request, Boolean(sessionValue || refreshValue));
  }

  try {
    const tokens = await refreshTokens(
      refreshToken,
      getClientIp(request.headers),
    );
    const cookies = await buildSessionCookies(tokens);
    for (const cookie of cookies) {
      request.cookies.set(cookie.name, cookie.value);
    }
    return { authenticated: true, cookies };
  } catch (error) {
    if (isApiError(error, 400) || isApiError(error, 401)) {
      return clear(request, true);
    }
    // The API is unreachable: keep the session and let the page report it.
    return { authenticated: true, cookies: [] };
  }
}

function clear(request: NextRequest, hadCookies: boolean): SessionSync {
  request.cookies.delete(SESSION_COOKIE);
  request.cookies.delete(REFRESH_COOKIE);
  return {
    authenticated: false,
    cookies: hadCookies ? expiredSessionCookies() : [],
  };
}
