'use client';

import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import type { PaymentStatus } from '@/lib/types/credits';
import { cn } from '@/lib/utils';

const POLL_INTERVAL_MS = 3000;
/** The webhook usually arrives in seconds; stop polling after this. */
const POLL_LIMIT_MS = 3 * 60 * 1000;

/**
 * Shown when the user comes back from the checkout: follows the payment until
 * the AbacatePay webhook confirms it and the credits are added.
 */
export function PaymentReturn({
  paymentId,
  initialStatus,
}: {
  paymentId: string;
  initialStatus: PaymentStatus;
}) {
  const t = useTranslations('paymentReturn');
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (status !== 'PENDING') return;
    const startedAt = Date.now();
    const controller = new AbortController();
    const timer = setInterval(async () => {
      if (Date.now() - startedAt > POLL_LIMIT_MS) {
        clearInterval(timer);
        setGaveUp(true);
        return;
      }
      if (document.visibilityState !== 'visible') return;
      const response = await fetch(`/bff/payments/${paymentId}`, {
        signal: controller.signal,
        cache: 'no-store',
      }).catch(() => null);
      if (!response?.ok) return;
      const data = (await response.json()) as { status: PaymentStatus };
      if (data.status !== 'PENDING') {
        setStatus(data.status);
        router.refresh();
      }
    }, POLL_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [paymentId, status, router]);

  const view = {
    PENDING: {
      icon: Loader2,
      tone: 'border-primary/30 bg-accent text-accent-foreground',
      title: gaveUp ? t('pendingLateTitle') : t('pendingTitle'),
      text: gaveUp ? t('pendingLateText') : t('pendingText'),
    },
    PAID: {
      icon: CircleCheck,
      tone: 'border-success/40 bg-success/10',
      title: t('paidTitle'),
      text: t('paidText'),
    },
    CANCELLED: {
      icon: CircleAlert,
      tone: 'border-destructive/40 bg-destructive/10',
      title: t('cancelledTitle'),
      text: t('cancelledText'),
    },
    REFUNDED: {
      icon: CircleAlert,
      tone: 'border-destructive/40 bg-destructive/10',
      title: t('refundedTitle'),
      text: t('refundedText'),
    },
  }[status];
  const Icon = view.icon;

  return (
    <output
      className={cn('flex items-start gap-3 rounded-xl border p-4', view.tone)}
    >
      <Icon
        className={cn(
          'mt-0.5 size-5 shrink-0',
          status === 'PENDING' && !gaveUp && 'animate-spin',
          status === 'PAID' && 'text-success',
          (status === 'CANCELLED' || status === 'REFUNDED') &&
            'text-destructive',
        )}
        aria-hidden="true"
      />
      <span>
        <span className="block font-medium">{view.title}</span>
        <span className="block text-sm opacity-90">{view.text}</span>
      </span>
    </output>
  );
}
