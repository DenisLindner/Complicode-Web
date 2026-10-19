import { hasLocale } from 'next-intl';
import { NextResponse, type NextRequest } from 'next/server';
import { localizedPath } from '@/i18n/paths';
import { LOCALE_COOKIE, routing } from '@/i18n/routing';
import { expiredSessionCookies } from '@/lib/server/session-cookies';

/**
 * Where the DAL sends a visitor whose session the API rejected (revoked in
 * Keycloak, for example): clears the cookies and goes to the login, in the
 * language the visitor was reading.
 */
export function GET(request: NextRequest) {
  // The page that sent the visitor here says which language they were reading.
  const requested =
    request.nextUrl.searchParams.get('locale') ??
    request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const response = NextResponse.redirect(
    new URL(`${localizedPath('/login', locale)}?session=expired`, request.url),
  );
  for (const cookie of expiredSessionCookies()) {
    response.cookies.set(cookie);
  }
  return response;
}
