import { isApiError } from '@/lib/server/api-error';
import { getPayment } from '@/lib/server/credits';
import { isSameOrigin } from '@/lib/server/same-origin';

/** Polled by the credits page when the user comes back from the checkout. */
export async function GET(
  request: Request,
  { params }: RouteContext<'/bff/pagamentos/[id]'>,
) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const payment = await getPayment((await params).id);
    if (!payment) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(
      { status: payment.status, credits: payment.credits },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const status = isApiError(error, 401) ? 401 : 502;
    return Response.json({ error: 'Unavailable' }, { status });
  }
}
