import { NextResponse, type NextRequest } from 'next/server';
import { expiredSessionCookies } from '@/lib/server/session-cookies';

/**
 * Where the DAL sends a visitor whose session the API rejected (revoked in
 * Keycloak, for example): clears the cookies and goes to the login.
 */
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL('/entrar?sessao=expirada', request.url),
  );
  for (const cookie of expiredSessionCookies()) {
    response.cookies.set(cookie);
  }
  return response;
}
