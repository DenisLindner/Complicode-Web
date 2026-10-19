import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { isPage, localizedPath, splitLocale } from './i18n/paths';
import { routing } from './i18n/routing';
import { buildCsp, createNonce } from './lib/csp';
import { syncSession } from './lib/server/proxy-session';
import type { SessionCookie } from './lib/server/session-cookies';

const intlMiddleware = createMiddleware(routing);

/** Routes that are not translated and have no locale prefix. */
const UNLOCALIZED_PATHS = ['/bff', '/webhooks', '/session-expired'];

const startsWithPath = (pathname: string, paths: string[]) =>
  paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export async function proxy(request: NextRequest) {
  const session = await syncSession(request);
  const { pathname, search } = request.nextUrl;

  const nonce = createNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV === 'development');

  // Next.js reads the nonce from the request CSP and adds it to its scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  if (startsWithPath(pathname, UNLOCALIZED_PATHS)) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set('Content-Security-Policy', csp);
    return withCookies(response, session.cookies);
  }

  // Language negotiation: redirects `/foo` to `/pt/foo` when needed and
  // rewrites the default language to its internal `/en/foo` route.
  const response = intlMiddleware(
    new NextRequest(request, { headers: requestHeaders }),
  );
  if (response.status >= 300 && response.status < 400) {
    return withCookies(response, session.cookies);
  }

  const { locale, path } = splitLocale(pathname);

  if (
    !session.authenticated &&
    (isPage(path, locale, '/app') || isPage(path, locale, '/welcome'))
  ) {
    const login = new URL(localizedPath('/login', locale), request.url);
    login.searchParams.set('next', `${pathname}${search}`);
    return withCookies(NextResponse.redirect(login), session.cookies);
  }
  if (
    session.authenticated &&
    (isPage(path, locale, '/login') || isPage(path, locale, '/signup'))
  ) {
    return withCookies(
      NextResponse.redirect(
        new URL(localizedPath('/app', locale), request.url),
      ),
      session.cookies,
    );
  }

  response.headers.set('Content-Security-Policy', csp);
  return withCookies(response, session.cookies);
}

function withCookies(response: NextResponse, cookies: SessionCookie[]) {
  for (const cookie of cookies) {
    response.cookies.set(cookie);
  }
  return response;
}

export const config = {
  matcher: [
    {
      source:
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico|webp|txt|xml)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
