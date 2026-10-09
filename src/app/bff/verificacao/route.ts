import { api } from '@/lib/server/api';
import { isApiError } from '@/lib/server/api-error';
import { isSameOrigin } from '@/lib/server/same-origin';
import type { VerificationStatus } from '@/lib/types/verification';

/** Polled by the onboarding while the user shares the phone on Telegram. */
export async function GET(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const status = await api<VerificationStatus & { phone?: string }>(
      '/verification',
    );
    const body: VerificationStatus = {
      emailVerified: status.emailVerified,
      phoneVerified: status.phoneVerified,
      credits: status.credits,
    };
    return Response.json(body, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const status = isApiError(error, 401) ? 401 : 502;
    return Response.json({ error: 'Unavailable' }, { status });
  }
}
