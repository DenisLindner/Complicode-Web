import type { MetadataRoute } from 'next';
import { env } from '@/lib/server/env';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/explorar', '/cadastro', '/entrar'].map((path) => ({
    url: `${env.APP_URL}${path}`,
    changeFrequency: path === '/explorar' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : 0.6,
  }));
}
