import { relayWebhook } from '@/lib/server/webhook-relay';

/**
 * Public webhook endpoints (AbacatePay and Telegram). Configure them in the
 * providers as https://<this app>/webhooks/abacatepay and /webhooks/telegram.
 */
export async function POST(
  request: Request,
  { params }: RouteContext<'/webhooks/[provider]'>,
) {
  return relayWebhook((await params).provider, request);
}
