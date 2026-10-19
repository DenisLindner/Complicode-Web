import 'server-only';
import type { Locale } from '@/i18n/routing';
import { apiRequest } from './api-request';

/**
 * Tells the API which language the user reads the website in, so the emails
 * and Telegram messages follow it. Never throws: a failure here must not
 * break the login or the language switch.
 */
export async function saveUserLocale(locale: Locale, accessToken: string) {
  try {
    await apiRequest('/users/me/locale', {
      method: 'PATCH',
      body: { locale },
      accessToken,
    });
  } catch (error) {
    console.error('Could not save the language of the user', error);
  }
}
