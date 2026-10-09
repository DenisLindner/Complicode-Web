export type CreditTransactionType =
  | 'SIGNUP_BONUS'
  | 'PURCHASE'
  | 'CHALLENGE_GENERATION'
  | 'REFUND'
  | 'PURCHASE_REFUND';

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';

export interface Payment {
  id: string;
  status: PaymentStatus;
  amountCents: number;
  credits: number;
  paidAt: string | null;
  createdAt: string;
  /** Only kept for pending payments, to resume the checkout. */
  checkoutUrl: string | null;
}

/** Same package as the API (payment.constants.ts). */
export const CREDIT_PACKAGE = { credits: 10, amountCents: 1000 };
