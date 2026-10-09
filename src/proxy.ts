import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp, createNonce } from './lib/csp';
import { syncSession } from './lib/server/proxy-session';
import type { SessionCookie } from './lib/server/session-cookies';

/** Pages that need a session (checked again by the DAL on every render). */
const PROTECTED_PATHS = ['/app', '/boas-vindas'];
/** Pages that make no sense with a session. */
const GUEST_PATHS = ['/entrar', '/cadastro'];

const matches = (pathname: string, paths: string[]) =>
  paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export async function proxy(request: NextRequest) {
  const session = await syncSession(request);
  const { pathname, search } = request.nextUrl;

  if (!session.authenticated && matches(pathname, PROTECTED_PATHS)) {
    const login = new URL('/entrar', request.url);
    login.searchParams.set('next', `${pathname}${search}`);
    return withCookies(NextResponse.redirect(login), session.cookies);
  }
  if (session.authenticated && matches(pathname, GUEST_PATHS)) {
    return withCookies(
      NextResponse.redirect(new URL('/app', request.url)),
      session.cookies,
    );
  }

  const nonce = createNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV === 'development');

  // Next.js reads the nonce from the request CSP and adds it to its scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
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
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico|webp|txt)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
