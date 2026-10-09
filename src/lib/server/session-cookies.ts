import 'server-only';
import { seal, unseal } from './seal';

/** Token pair returned by the API on login, register and refresh. */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  /** Seconds. */
  expiresIn: number;
  /** Seconds. */
  refreshExpiresIn: number;
}

// __Host- cookies must be Secure, have Path=/ and no Domain, so another
// subdomain cannot set or overwrite them.
export const SESSION_COOKIE = '__Host-cc_session';
export const REFRESH_COOKIE = '__Host-cc_refresh';

/** Refresh this long before the access token expires. */
const REFRESH_MARGIN_MS = 60_000;

interface SessionPayload {
  accessToken: string;
  expiresAt: number;
}

interface RefreshPayload {
  refreshToken: string;
}

export interface SessionCookie {
  name: string;
  value: string;
  httpOnly: true;
  secure: true;
  sameSite: 'lax';
  path: '/';
  maxAge: number;
}

// Lax (not Strict) keeps the user logged in when coming back from the
// checkout or from a link; the session is never used by GET side effects.
const baseOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const;

/** Both cookies of a token pair, encrypted. */
export async function buildSessionCookies(
  tokens: TokenResponse,
): Promise<SessionCookie[]> {
  const now = Date.now();
  const accessExpiresAt = now + tokens.expiresIn * 1000;
  const refreshExpiresAt = now + tokens.refreshExpiresIn * 1000;

  return [
    {
      ...baseOptions,
      name: SESSION_COOKIE,
      value: await seal(
        { accessToken: tokens.accessToken, expiresAt: accessExpiresAt },
        SESSION_COOKIE,
        new Date(accessExpiresAt),
      ),
      maxAge: tokens.expiresIn,
    },
    {
      ...baseOptions,
      name: REFRESH_COOKIE,
      value: await seal(
        { refreshToken: tokens.refreshToken },
        REFRESH_COOKIE,
        new Date(refreshExpiresAt),
      ),
      maxAge: tokens.refreshExpiresIn,
    },
  ];
}

/** Cookies that remove the session. __Host- cookies must keep their attributes. */
export function expiredSessionCookies(): SessionCookie[] {
  return [SESSION_COOKIE, REFRESH_COOKIE].map((name) => ({
    ...baseOptions,
    name,
    value: '',
    maxAge: 0,
  }));
}

/** The access token, while it is valid for longer than the refresh margin. */
export async function readAccessToken(value: string | undefined) {
  const session = await unseal<SessionPayload>(value, SESSION_COOKIE);
  if (!session || session.expiresAt - Date.now() < REFRESH_MARGIN_MS) {
    return null;
  }
  return session.accessToken;
}

export async function readRefreshToken(value: string | undefined) {
  const refresh = await unseal<RefreshPayload>(value, REFRESH_COOKIE);
  return refresh?.refreshToken ?? null;
}
