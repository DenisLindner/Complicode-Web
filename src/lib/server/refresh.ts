import 'server-only';
import { createHash } from 'node:crypto';
import { apiRequest } from './api-request';
import type { TokenResponse } from './session-cookies';

/** How long a refresh result is reused for requests with the same token. */
const REUSE_MS = 15_000;

const recent = new Map<string, Promise<TokenResponse>>();

/**
 * Exchanges the refresh token for a new pair. Keycloak rotates refresh tokens
 * and rejects reuse, so parallel requests that still carry the same old token
 * share one call and its result instead of logging the user out.
 *
 * The cache lives in memory: with several instances, use sticky sessions.
 */
export function refreshTokens(refreshToken: string, clientIp?: string) {
  const key = createHash('sha256').update(refreshToken).digest('hex');
  const cached = recent.get(key);
  if (cached) {
    return cached;
  }

  const request = apiRequest<TokenResponse>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    clientIp,
  });
  recent.set(key, request);
  setTimeout(() => recent.delete(key), REUSE_MS).unref();
  request.catch(() => recent.delete(key));

  return request;
}
