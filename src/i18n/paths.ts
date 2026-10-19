import { type AppPathname, type Locale, routing } from './routing';

/**
 * Pure path helpers, safe to use in the proxy and in server code: the
 * components use the navigation APIs from `./navigation` instead.
 */

/** The locale prefix of a URL path (empty for the default locale). */
export function localePrefix(locale: Locale) {
  return locale === routing.defaultLocale ? '' : `/${locale}`;
}

/** The URL path of a static page in a language, e.g. `/pt/entrar`. */
export function localizedPath(
  href: Exclude<AppPathname, `${string}[${string}`>,
  locale: Locale,
) {
  const entry: string | Partial<Record<Locale, string>> =
    routing.pathnames[href];
  const path = typeof entry === 'string' ? entry : (entry[locale] ?? href);

  return `${localePrefix(locale)}${path === '/' ? '' : path}` || '/';
}

/** Splits `/pt/entrar` into its locale and the path without the prefix. */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const [, first, ...rest] = pathname.split('/');
  const locale = routing.locales.find(
    (candidate) => candidate !== routing.defaultLocale && candidate === first,
  );

  return locale
    ? { locale, path: `/${rest.join('/')}` }
    : { locale: routing.defaultLocale, path: pathname };
}

/** Whether a path (without the locale prefix) is the page or below it. */
export function isPage(
  path: string,
  locale: Locale,
  href: Exclude<AppPathname, `${string}[${string}`>,
) {
  const page = localizedPath(href, locale).slice(localePrefix(locale).length);

  return path === page || path.startsWith(`${page}/`);
}
