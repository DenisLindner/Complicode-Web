'use server';

import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { saveUserLocale } from '@/lib/server/locale';
import { getAccessToken } from '@/lib/server/session';

/**
 * Called when a logged in user switches the language of the website. The
 * navigation itself (URL and cookie) is done by the language switcher.
 */
export async function setPreferredLocale(locale: string) {
  if (!hasLocale(routing.locales, locale)) {
    return;
  }

  const accessToken = await getAccessToken();
  if (accessToken) {
    await saveUserLocale(locale, accessToken);
  }
}
