import { hasLocale } from 'next-intl';
import { type Locale, routing } from './routing';

/**
 * The `locale` route param is typed as a plain string. The proxy already
 * rejects unknown languages, so this only narrows the type.
 */
export function asLocale(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
