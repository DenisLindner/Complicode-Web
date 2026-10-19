'use client';

import { Check, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/logo';
import { cn } from '@/lib/utils';

// What the model writes, in order (keys of the `generating` messages). The
// pace is illustrative: the API answers once the whole document is ready.
const PHASES = [
  'phase1',
  'phase2',
  'phase3',
  'phase4',
  'phase5',
  'phase6',
  'phase7',
] as const;
const PHASE_MS = 6000;

export function GeneratingView({
  selection,
  newVersion = false,
}: {
  selection: string;
  /** A regeneration of an existing challenge. */
  newVersion?: boolean;
}) {
  const t = useTranslations('generating');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setPhase((current) => Math.min(current + 1, PHASES.length - 1)),
      PHASE_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
      <div className="relative mb-8">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/25" />
        <LogoMark className="relative size-16" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {newVersion ? t('newVersion') : t('title')}
      </h1>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {selection}
      </p>

      <ol className="mt-8 w-full space-y-3 text-left">
        {PHASES.map((key, index) => {
          const done = index < phase;
          const active = index === phase;
          return (
            <li
              key={key}
              className={cn(
                'flex items-center gap-3 text-sm transition-opacity',
                index > phase && 'opacity-40',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary text-brand',
                )}
              >
                {done ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : active ? (
                  <Loader2
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              {t(key)}
            </li>
          );
        })}
      </ol>

      <output className="sr-only">{t(PHASES[phase])}</output>
      <p className="mt-8 max-w-md text-sm text-pretty text-muted-foreground">
        {t.rich('note', {
          strong: (chunks) => (
            <strong className="text-foreground">{chunks}</strong>
          ),
        })}
      </p>
    </div>
  );
}
