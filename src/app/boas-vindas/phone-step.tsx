'use client';

import { ExternalLink, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import type { VerificationStatus } from '@/lib/types/verification';

const POLL_INTERVAL_MS = 3000;
const COOLDOWN_MS = 60_000;

const INSTRUCTIONS = [
  'Abra o bot do Complicode no Telegram.',
  'Toque em Iniciar.',
  'Toque em “📱 Compartilhar meu telefone” e confirme.',
];

type Link = Required<Pick<PhoneVerificationStart, 'deepLink' | 'qrCode'>> & {
  expiresAt: number;
};

export function PhoneStep() {
  const router = useRouter();
  const [link, setLink] = useState<Link | null>(null);
  const [error, setError] = useState<string>();
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [loading, startLoading] = useTransition();
  const requestedOnMount = useRef(false);
  const retryIn = useCountdown(retryAt);
  const expiresIn = useCountdown(link?.expiresAt ?? null);
  const expired = link !== null && expiresIn === 0;

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
      const response = await fetch('/bff/verificacao', {
        signal: controller.signal,
        cache: 'no-store',
      }).catch(() => null);
      if (!response?.ok) return;
      const status = (await response.json()) as VerificationStatus;
      if (status.phoneVerified) {
        controller.abort();
        toast.success('Telefone confirmado!');
        router.push('/boas-vindas?etapa=pronto');
        router.refresh();
      }
    };
    const timer = setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [link, expired, router]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Smartphone className="size-5" aria-hidden="true" />
        </span>
        <h1 className="pt-2 text-3xl font-semibold tracking-tight">
          Confirme seu telefone
        </h1>
        <p className="text-pretty text-muted-foreground">
          É pelo Telegram: sem SMS e sem custo. O número vem da sua conta do
          Telegram e serve só para garantir uma conta por pessoa.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="space-y-6">
          <ol className="space-y-3">
            {INSTRUCTIONS.map((text, index) => (
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
                  Abrir no Telegram
                  <ExternalLink data-icon="inline-end" />
                </a>
              </Button>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="relative mt-1.5 flex size-2.5 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                <p>
                  <output>
                    Aguardando a confirmação no Telegram…
                  </output>{' '}
                  O link expira em{' '}
                  <span className="font-mono text-foreground tabular-nums">
                    {Math.floor(expiresIn / 60)}:
                    {String(expiresIn % 60).padStart(2, '0')}
                  </span>
                  .
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {expired && (
                <p className="text-sm text-muted-foreground">
                  O link expirou. Gere um novo para continuar.
                </p>
              )}
              {retryAt !== null && retryIn > 0 && (
                <p className="text-sm text-muted-foreground">
                  Você gerou um link há pouco. Um novo fica disponível em{' '}
                  <span className="font-mono tabular-nums">{retryIn}s</span>.
                </p>
              )}
              <Button
                size="lg"
                variant={expired || error ? 'default' : 'outline'}
                onClick={requestLink}
                disabled={loading || retryIn > 0}
              >
                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                {loading ? 'Gerando link…' : 'Gerar novo link'}
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
              alt="QR code para abrir o bot do Telegram no celular"
              width={176}
              height={176}
              className="rounded-md"
            />
          ) : (
            <Skeleton className="size-44" />
          )}
          <p className="mt-3 max-w-44 text-xs text-muted-foreground">
            Está no computador? Escaneie com a câmera do celular.
          </p>
        </div>
      </div>
    </div>
  );
}
