import 'server-only';
import { isIP } from 'node:net';
import { env } from './env';

/**
 * The client IP, taken from the X-Forwarded-For entry added by the outermost
 * trusted proxy; entries before it can be forged by the client. Without a
 * proxy (local development) Next.js fills the header with the socket address.
 */
export function getClientIp(headers: Headers) {
  const entries = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const ip = entries[entries.length - env.TRUSTED_PROXY_HOPS];

  return ip && isIP(ip) ? ip : undefined;
}
