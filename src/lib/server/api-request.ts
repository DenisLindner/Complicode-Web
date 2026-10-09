import 'server-only';
import { ApiError } from './api-error';
import { env } from './env';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string | null;
  clientIp?: string;
  timeoutMs?: number;
  /** Response body type; markdown endpoints answer text. */
  as?: 'json' | 'text';
}

const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * Calls the API with the internal key. Paths are built by our own server
 * code; dynamic segments must be validated and encoded by the caller.
 */
export async function apiRequest<T>(
  path: `/${string}`,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers({
    Accept: options.as === 'text' ? 'text/markdown' : 'application/json',
    'X-Internal-Key': env.INTERNAL_API_KEY,
  });
  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }
  if (options.clientIp) {
    headers.set('X-Client-IP', options.clientIp);
  }
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${env.API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError(503, ['API unreachable']);
  }

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => undefined);
    throw new ApiError(response.status, errorMessages(data));
  }
  if (response.status === 204) {
    return undefined as T;
  }

  return (
    options.as === 'text' ? await response.text() : await response.json()
  ) as T;
}

function errorMessages(data: unknown): string[] {
  const message = (data as { message?: unknown } | undefined)?.message;
  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === 'string');
  }
  return typeof message === 'string' ? [message] : [];
}
