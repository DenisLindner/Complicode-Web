import { Check, Clock, Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LogoMark } from '@/components/logo';
import { delay } from '@/lib/motion';
import { cn } from '@/lib/utils';

// The first three get checked, one after the other, once the shot is in.
const CHECKED = 3;
const FIRST_TICK_MS = 1400;
const TICK_GAP_MS = 550;

const REQUIREMENT_KEYS = ['req1', 'req2', 'req3', 'req4', 'req5'] as const;
const SECTION_KEYS = [
  'context',
  'requirements',
  'whatToUse',
  'deliverables',
  'deadline',
  'guide',
  'evaluation',
  'structure',
] as const;

/**
 * The challenge page as the app shows it, built from markup instead of a
 * screenshot so it follows the theme. Decorative.
 */
export function ProductShot({ className }: { className?: string }) {
  const t = useTranslations('landing.productShot');
  const nav = useTranslations('nav');
  const doc = useTranslations('document');
  const levels = useTranslations('levels');

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative h-[440px] overflow-hidden rounded-t-[1.75rem] border border-b-0 bg-background shadow-[0_-12px_60px_-20px] shadow-primary/30 select-none sm:h-[540px]',
        className,
      )}
    >
      <div className="flex h-12 items-center justify-between gap-4 border-b px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <LogoMark className="size-6" />
          <div className="hidden items-center gap-1 text-xs sm:flex">
            <span className="rounded-md px-2.5 py-1 text-muted-foreground">
              {nav('home')}
            </span>
            <span className="rounded-md px-2.5 py-1 text-muted-foreground">
              {nav('generate')}
            </span>
            <span className="rounded-md bg-muted px-2.5 py-1 font-medium">
              {nav('challenges')}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs">
          <Coins className="size-3.5 text-brand" />8
        </span>
      </div>

      <div className="grid gap-10 px-5 pt-7 sm:px-10 sm:pt-9 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="min-w-0 space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              {t('meta')}
            </p>
            <p className="font-heading text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
              {t('title')}
            </p>
            <p className="font-mono text-sm text-brand">{t('project')}</p>
            <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {levels('MID.deadline')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="flex items-baseline gap-2 font-heading font-semibold">
              <span className="font-mono text-xs font-normal text-brand">
                01
              </span>
              {doc('context')}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t('context')}
            </p>
          </div>

          <div className="space-y-3">
            <p className="flex items-baseline gap-2 font-heading font-semibold">
              <span className="font-mono text-xs font-normal text-brand">
                02
              </span>
              {doc('functional')}
            </p>
            <ul className="space-y-2.5 text-sm">
              {REQUIREMENT_KEYS.map((key, index) => {
                const checked = index < CHECKED;
                const tick = delay(FIRST_TICK_MS + index * TICK_GAP_MS);
                return (
                  <li key={key} className="flex items-start gap-2.5">
                    <span
                      style={tick}
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-input',
                        checked &&
                          'animate-[tick_0.35s_var(--ease-spring)_var(--d)_both]',
                      )}
                    >
                      {checked && (
                        <Check
                          style={tick}
                          strokeWidth={3}
                          className="size-3 pop text-primary-foreground"
                        />
                      )}
                    </span>
                    <span>{t(key)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="hidden space-y-4 lg:block">
          <div className="space-y-1.5">
            <p className="text-xs font-medium">{t('progress')}</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                style={delay(FIRST_TICK_MS)}
                className="h-full w-[38%] origin-left animate-[grow_1.8s_var(--ease-out)_var(--d)_both] rounded-full bg-primary"
              />
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {t('progressCount')}
            </p>
          </div>
          <ul className="space-y-1 border-l text-xs">
            {SECTION_KEYS.map((key, index) => (
              <li
                key={key}
                className={cn(
                  '-ml-px border-l py-1 pl-3',
                  index === 1
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground',
                )}
              >
                {doc(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background" />
    </div>
  );
}
