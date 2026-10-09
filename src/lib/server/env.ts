import 'server-only';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_URL: z.url(),
  API_URL: z.url(),
  INTERNAL_API_KEY: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
});

/**
 * Server-only configuration. None of these values may reach the browser, so
 * nothing here uses the NEXT_PUBLIC_ prefix and importing this module from a
 * Client Component fails the build.
 */
export const env = schema.parse(process.env);
