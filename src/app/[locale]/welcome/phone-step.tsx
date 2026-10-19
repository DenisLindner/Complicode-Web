'use client';

import { ExternalLink, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  startPhoneVerification,
  type PhoneVerificationStart,
} from '@/actions/verification';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountdown } from '@/hooks/use-countdown';
import { useRouter } from '@/i18n/navigation';
import type { VerificationStatus } from '@/lib/types/verification';

const POLL_INTERVAL_MS = 3000;
const COOLDOWN_MS = 60_000;

type TelegramLink = Required<
  Pick<PhoneVerificationStart, 'deepLink' | 'qrCode'>
> & {
  expiresAt: number;
};

export function PhoneStep() {
  const t = useTranslations('onboarding.phone');
  const router = useRouter();
  const [link, setLink] = useState<TelegramLink | null>(null);
  const [error, setError] = useState<string>();
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [loading, startLoading] = useTransition();
  const requestedOnMount = useRef(false);
  const retryIn = useCountdown(retryAt);
  const expiresIn = useCountdown(link?.expiresAt ?? null);
  const expired = link !== null && expiresIn === 0;
  const instructions = [t('step1'), t('step2'), t('step3')];

  const requestLink = () =>
    startLoading(async () => {
      setError(undefined);
      const result = await startPhoneVerification();
      if (result.deepLink && result.qrCode && result.expiresAt) {
        setLink({
          deepLink: result.deepLink,
          qrCode: result.qrCode,
          expiresAt: new Date(result.expiresAt).getTime(),
        });
        setRetryAt(null);
      } else if (result.ok) {
        // Already verified (in another tab, for example).
        router.refresh();
      } else if (result.cooldown) {
        setRetryAt(Date.now() + COOLDOWN_MS);
      } else {
        setError(result.error);
      }
    });

  useEffect(() => {
    if (!requestedOnMount.current) {
      requestedOnMount.current = true;
      requestLink();
    }
  });

  // Retries on its own when the cooldown of a previous link ends.
  useEffect(() => {
    if (retryAt !== null && retryIn === 0 && !loading) {
      requestLink();
    }
  });

  // Polls the status while the link is valid and the tab is visible.
  useEffect(() => {
    if (!link || expired) {
      return;
    }
    const controller = new AbortController();
    const poll = async () => {
      if (document.visibilityState !== 'visible') return;
      const response = await fetch('/bff/verification', {
        signal: controller.signal,
        cache: 'no-store',
      }).catch(() => null);
      if (!response?.ok) return;
      const status = (await response.json()) as VerificationStatus;
      if (status.phoneVerified) {
        controller.abort();
        toast.success(t('confirmedToast'));
        router.push({ pathname: '/welcome', query: { step: 'done' } });
        router.refresh();
      }
    };
    const timer = setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [link, expired, router, t]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Smartphone className="size-5" aria-hidden="true" />
        </span>
        <h1 className="pt-2 text-3xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-pretty text-muted-foreground">{t('lead')}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="space-y-6">
          <ol className="space-y-3">
            {instructions.map((text, index) => (
              <li key={text} className="flex items-start gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs">
                  {index + 1}
                </span>
                <span className="pt-0.5">{text}</span>
              </li>
            ))}
          </ol>

          {link && !expired ? (
            <div className="space-y-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a
                  href={link.deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('open')}
                  <ExternalLink data-icon="inline-end" />
                </a>
              </Button>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="relative mt-1.5 flex size-2.5 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                <p>
                  {t.rich('waiting', {
                    time: `${Math.floor(expiresIn / 60)}:${String(expiresIn % 60).padStart(2, '0')}`,
                    status: (chunks) => <output>{chunks}</output>,
                    countdown: (chunks) => (
                      <span className="font-mono text-foreground tabular-nums">
                        {chunks}
                      </span>
                    ),
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {expired && (
                <p className="text-sm text-muted-foreground">{t('expired')}</p>
              )}
              {retryAt !== null && retryIn > 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('cooldown', { seconds: retryIn })}
                </p>
              )}
              <Button
                size="lg"
                variant={expired || error ? 'default' : 'outline'}
                onClick={requestLink}
                disabled={loading || retryIn > 0}
              >
                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                {loading ? t('generating') : t('generate')}
              </Button>
            </div>
          )}
        </div>

        <div className="hidden rounded-xl border bg-card p-4 text-center sm:block">
          {link && !expired ? (
            // A data URL generated on the server from the Telegram link.
            // oxlint-disable-next-line nextjs/no-img-element -- data URL, nothing to optimize
            <img
              src={link.qrCode}
              alt={t('qrAlt')}
              width={176}
              height={176}
              className="rounded-md"
            />
          ) : (
            <Skeleton className="size-44" />
          )}
          <p className="mt-3 max-w-44 text-xs text-muted-foreground">
            {t('qrHint')}
          </p>
        </div>
      </div>
    </div>
  );
}
