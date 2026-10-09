import 'server-only';
import { z } from 'zod';
import type { Paginated } from '@/lib/types/challenge';
import type { CreditTransaction, Payment } from '@/lib/types/credits';
import { api } from './api';
import { isApiError } from './api-error';

/** Checkout pages we redirect to; anything else is refused (open redirect). */
const CHECKOUT_HOSTS = ['abacatepay.com'];

export function isTrustedCheckoutUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      CHECKOUT_HOSTS.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
}

function toPayment(payment: Payment): Payment {
  return {
    id: payment.id,
    status: payment.status,
    amountCents: payment.amountCents,
    credits: payment.credits,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
    checkoutUrl:
      payment.status === 'PENDING' && isTrustedCheckoutUrl(payment.checkoutUrl)
        ? payment.checkoutUrl
        : null,
  };
}

export async function listTransactions(page = 1, limit = 10) {
  const result = await api<
    Paginated<CreditTransaction & { referenceId: string }>
  >(`/credits/transactions?page=${page}&limit=${limit}`);
  return {
    ...result,
    items: result.items.map(
      ({ id, type, amount, balanceAfter, createdAt }) => ({
        id,
        type,
        amount,
        balanceAfter,
        createdAt,
      }),
    ),
  };
}

export async function listPayments() {
  const result = await api<Paginated<Payment>>('/payments?limit=5');
  return result.items.map(toPayment);
}

export const paymentIdSchema = z.uuid();

export async function getPayment(id: string) {
  if (!paymentIdSchema.safeParse(id).success) {
    return null;
  }
  try {
    return toPayment(await api<Payment>(`/payments/${id}`));
  } catch (error) {
    if (isApiError(error, 404)) return null;
    throw error;
  }
}
