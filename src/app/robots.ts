import type { MetadataRoute } from 'next';
import { env } from '@/lib/server/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/explorar', '/d/'],
      disallow: [
        '/app',
        '/boas-vindas',
        '/bff',
        '/webhooks',
        '/sessao-expirada',
      ],
    },
    sitemap: `${env.APP_URL}/sitemap.xml`,
  };
}
