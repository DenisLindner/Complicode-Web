import 'server-only';
import { env } from './env';

/** Providers whose webhooks reach the API through this app. */
const PROVIDERS: Record<string, { headers: string[] }> = {
  // HMAC of the raw body in X-Webhook-Signature, secret in the query string.
  abacatepay: { headers: ['x-webhook-signature'] },
  telegram: { headers: ['x-telegram-bot-api-secret-token'] },
};

const MAX_BODY_BYTES = 256 * 1024;
const TIMEOUT_MS = 15_000;

/**
 * Forwards a webhook to the API unchanged (same bytes, query string and
 * signature header), so the API stays on a private network and still
 * verifies the signature itself. Nothing is trusted or parsed here.
 */
export async function relayWebhook(provider: string, request: Request) {
  const config = PROVIDERS[provider];
  if (!config) {
    return new Response('Not found', { status: 404 });
  }

  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return new Response('Payload too large', { status: 413 });
  }
  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_BODY_BYTES) {
    return new Response('Payload too large', { status: 413 });
  }

  const headers = new Headers({
    'Content-Type': request.headers.get('content-type') ?? 'application/json',
  });
  for (const name of config.headers) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const { search } = new URL(request.url);
  try {
    const response = await fetch(
      `${env.API_URL}/webhooks/${provider}${search}`,
      {
        method: 'POST',
        headers,
        body,
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
    return new Response(await response.text(), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // The provider retries on failure.
    return new Response('Unavailable', { status: 503 });
  }
}
