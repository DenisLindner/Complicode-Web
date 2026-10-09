import 'server-only';
import { env } from './env';

/**
 * Route Handlers under /bff are only for this app's own pages. Browsers send
 * Sec-Fetch-Site and Origin, so cross-site calls are rejected even before
 * looking at the session (Server Actions get the same check from Next.js).
 */
export function isSameOrigin(request: Request) {
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') {
    return false;
  }

  const origin = request.headers.get('origin');
  return !origin || origin === new URL(env.APP_URL).origin;
}
