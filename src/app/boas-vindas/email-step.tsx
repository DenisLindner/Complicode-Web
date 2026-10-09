'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Loader2, MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { confirmEmailCode, sendEmailCode } from '@/actions/verification';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useCountdown } from '@/hooks/use-countdown';

const RESEND_COOLDOWN_MS = 60_000;

export function EmailStep({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [resendAt, setResendAt] = useState<number | null>(null);
  const [sending, startSending] = useTransition();
  const [confirming, startConfirming] = useTransition();
  const sentOnMount = useRef(false);
  const secondsLeft = useCountdown(resendAt);

  const send = (isResend: boolean) =>
    startSending(async () => {
      setError(undefined);
      const result = await sendEmailCode();
      // A cooldown means a code was sent less than a minute ago.
      setResendAt(Date.now() + RESEND_COOLDOWN_MS);
      if (result.ok) {
        if (isResend) {
          toast.success('Enviamos um novo código.');
        }
      } else if (!result.cooldown || isResend) {
        setError(result.error);
      }
    });

  useEffect(() => {
    if (!sentOnMount.current) {
      sentOnMount.current = true;
      send(false);
    }
  });

  const confirm = (value: string) =>
    startConfirming(async () => {
      setError(undefined);
      const result = await confirmEmailCode(value);
      if (result.ok) {
        toast.success('Email confirmado!');
        router.push('/boas-vindas?etapa=telefone');
        router.refresh();
      } else {
        setError(result.error);
        setCode('');
      }
    });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <MailCheck className="size-5" aria-hidden="true" />
        </span>
        <h1 className="pt-2 text-3xl font-semibold tracking-tight">
          Confirme seu email
        </h1>
        <p className="text-pretty text-muted-foreground">
          {sending && resendAt === null
            ? 'Enviando um código de 6 dígitos para '
            : 'Enviamos um código de 6 dígitos para '}
          <strong className="font-medium text-foreground">{email}</strong>. Ele
          vale por 10 minutos.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (code.length === 6) confirm(code);
        }}
      >
        <label htmlFor="email-code" className="text-sm font-medium">
          Código de verificação
        </label>
        <InputOTP
          id="email-code"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={setCode}
          onComplete={confirm}
          disabled={confirming}
          aria-invalid={!!error}
          containerClassName="mt-2"
        >
          <InputOTPGroup>
            {[0, 1, 2].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="size-12 text-lg"
                aria-invalid={!!error}
              />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {[3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="size-12 text-lg"
                aria-invalid={!!error}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Não chegou? Confira o spam ou{' '}
            {secondsLeft > 0 ? (
              <span>
                reenvie em{' '}
                <span className="font-mono tabular-nums">{secondsLeft}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => send(true)}
                disabled={sending}
                className="font-medium text-brand underline-offset-4 hover:underline disabled:opacity-50"
              >
                reenvie o código
              </button>
            )}
            .
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={code.length < 6 || confirming}
          >
            {confirming && <Loader2 className="animate-spin" />}
            Confirmar
          </Button>
        </div>
      </form>
    </div>
  );
}
