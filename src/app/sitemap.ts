import type { MetadataRoute } from 'next';
import { localizedPath } from '@/i18n/paths';
import { routing } from '@/i18n/routing';
import { env } from '@/lib/server/env';

const PAGES = ['/', '/explore', '/signup', '/login'] as const;

/** One entry per page and language, each linking to its translations. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (
    page: (typeof PAGES)[number],
    locale: (typeof routing.locales)[number],
  ) =>
    `${env.APP_URL}${localizedPath(page, locale) === '/' ? '' : localizedPath(page, locale)}`;

  return PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: url(page, locale),
      changeFrequency:
        page === '/explore' ? ('daily' as const) : ('monthly' as const),
      priority: page === '/' ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((other) => [other, url(page, other)]),
        ),
      },
    })),
  );
}
