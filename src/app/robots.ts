import type { MetadataRoute } from 'next';
import { localizedPath } from '@/i18n/paths';
import { routing } from '@/i18n/routing';
import { env } from '@/lib/server/env';

export default function robots(): MetadataRoute.Robots {
  const everyLanguage = (
    page: Parameters<typeof localizedPath>[0],
    trailingSlash = false,
  ) =>
    routing.locales.map(
      (locale) => `${localizedPath(page, locale)}${trailingSlash ? '/' : ''}`,
    );

  return {
    rules: {
      userAgent: '*',
      allow: [
        ...routing.locales.map((locale) => localizedPath('/', locale)),
        ...everyLanguage('/explore'),
        // Public challenges: /c/<id> in English, /d/<id> in the other languages.
        ...routing.locales.map((locale) =>
          locale === 'en' ? '/c/' : `/${locale}/d/`,
        ),
      ],
      disallow: [
        ...everyLanguage('/app'),
        ...everyLanguage('/welcome'),
        '/bff',
        '/webhooks',
        '/session-expired',
      ],
    },
    sitemap: `${env.APP_URL}/sitemap.xml`,
  };
}
