import 'server-only';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_URL: z.url(),
  API_URL: z.url().transform((url) => url.replace(/\/+$/, '')),
  INTERNAL_API_KEY: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  /**
   * Reverse proxies in front of this app that append to X-Forwarded-For.
   * The client IP is the entry added by the outermost one.
   */
  TRUSTED_PROXY_HOPS: z.coerce.number().int().min(1).default(1),
});

/**
 * Server-only configuration. None of these values may reach the browser, so
 * nothing here uses the NEXT_PUBLIC_ prefix and importing this module from a
 * Client Component fails the build.
 */
export const env = schema.parse(process.env);
