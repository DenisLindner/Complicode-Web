'use server';

import { redirect } from 'next/navigation';
import { apiFailure, type ActionResult } from '@/lib/server/action-result';
import { api } from '@/lib/server/api';
import { isTrustedCheckoutUrl } from '@/lib/server/credits';

/** Creates the AbacatePay checkout of the credit package and goes there. */
export async function startCheckout(): Promise<ActionResult> {
  let checkoutUrl: string | null;
  try {
    ({ checkoutUrl } = await api<{ checkoutUrl: string | null }>(
      '/payments/checkout',
      { method: 'POST', timeoutMs: 30_000 },
    ));
  } catch (error) {
    return apiFailure(error, {
      503: 'O pagamento está indisponível no momento. Tente novamente em instantes.',
    });
  }

  if (!isTrustedCheckoutUrl(checkoutUrl)) {
    console.error('Unexpected checkout URL', checkoutUrl);
    return {
      ok: false,
      error: 'Não foi possível abrir o pagamento. Tente novamente.',
    };
  }

  redirect(checkoutUrl);
}
