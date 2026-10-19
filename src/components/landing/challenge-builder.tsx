'use client';

import { ArrowRight, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { StackIcon } from '@/components/stack-icon';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { stackLabel } from '@/i18n/stack-label';
import { LEVEL_ORDER } from '@/lib/levels';
import type { ChallengeLevel } from '@/lib/types/challenge';
import { cn } from '@/lib/utils';

type SampleSlug = 'backend' | 'frontend' | 'fullstack' | 'mobile' | 'data';

/** The texts of each sample are in the `landing.builder.samples` messages. */
const SAMPLES: { slug: SampleSlug; framework: string }[] = [
  { slug: 'backend', framework: 'NestJS' },
  { slug: 'frontend', framework: 'React' },
  { slug: 'fullstack', framework: 'Next.js' },
  { slug: 'mobile', framework: 'Flutter' },
  { slug: 'data', framework: 'Pandas' },
];
/** Requirements are ordered by difficulty: each level adds the next one. */
const REQUIREMENT_KEYS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'] as const;

const REQUIREMENTS_PER_LEVEL: Record<ChallengeLevel, number> = {
  INTERN: 3,
  JUNIOR: 4,
  MID: 5,
  SENIOR: 6,
};

/** Landing demo: pick an area and a level and watch the scope change. */
export function ChallengeBuilder() {
  const t = useTranslations('landing.builder');
  const levels = useTranslations('levels');
  const stacks = useTranslations('stacks');
  const [slug, setSlug] = useState<SampleSlug>(SAMPLES[0].slug);
  const [level, setLevel] = useState<ChallengeLevel>('JUNIOR');

  const sample = SAMPLES.find((item) => item.slug === slug) ?? SAMPLES[0];
  const levelIndex = LEVEL_ORDER.indexOf(level);
  const requirements = REQUIREMENT_KEYS.slice(0, REQUIREMENTS_PER_LEVEL[level]);

  return (
    <div className="grid gap-4 rounded-[2rem] border bg-card p-3 sm:p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-8 p-3 sm:p-5">
        <fieldset>
          <legend className="mb-3 text-sm font-medium">{t('area')}</legend>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((item) => (
              <label
                key={item.slug}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all',
                  'hover:border-primary/60 has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                  'has-checked:border-espresso has-checked:bg-espresso has-checked:text-espresso-foreground dark:has-checked:border-primary dark:has-checked:bg-primary dark:has-checked:text-primary-foreground',
                )}
              >
                <input
                  type="radio"
                  name="builder-area"
                  value={item.slug}
                  checked={slug === item.slug}
                  onChange={() => setSlug(item.slug)}
                  className="sr-only"
                />
                <StackIcon slug={item.slug} className="size-4" />
                {stackLabel(stacks, item.slug, item.slug)}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium">{t('level')}</legend>
          <div className="grid grid-cols-4 gap-1.5">
            {LEVEL_ORDER.map((value, index) => (
              <label
                key={value}
                className="group cursor-pointer has-focus-visible:[&>span:first-of-type]:ring-3 has-focus-visible:[&>span:first-of-type]:ring-ring/50"
              >
                <input
                  type="radio"
                  name="builder-level"
                  value={value}
                  checked={level === value}
                  onChange={() => setLevel(value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'block h-2 rounded-full transition-colors duration-300',
                    index <= levelIndex
                      ? 'bg-primary'
                      : 'bg-muted group-hover:bg-primary/30',
                  )}
                />
                <span
                  className={cn(
                    'mt-2 block text-xs transition-colors sm:text-sm',
                    index === levelIndex
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {levels(`${value}.label`)}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-sm text-pretty text-muted-foreground">
            {levels(`${level}.description`)}
          </p>
        </fieldset>

        <div className="mt-auto hidden lg:block">
          <Button asChild size="xl">
            <Link href="/signup">
              {t('cta')}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] bg-cream p-5 sm:p-8">
        <div className="absolute inset-0 bg-graph [mask-image:linear-gradient(to_bottom,#000,transparent)] opacity-60" />
        <article
          key={sample.slug}
          aria-live="polite"
          className="relative rise rounded-2xl border bg-background p-5 shadow-sm sm:p-6"
        >
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            {t(`samples.${sample.slug}.industry`)} · {levels(`${level}.label`)}{' '}
            · {sample.framework}
          </p>
          <h3 className="mt-2 text-xl leading-snug font-semibold tracking-tight">
            {t(`samples.${sample.slug}.title`)}
          </h3>
          <p className="font-mono text-sm text-brand">
            {t(`samples.${sample.slug}.project`)}
          </p>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {t(`samples.${sample.slug}.context`)}
          </p>

          <p className="mt-5 mb-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t('requirements')}
          </p>
          <ul className="space-y-2 text-sm">
            {requirements.map((key) => (
              <li key={key} className="flex rise items-start gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {t(`samples.${sample.slug}.${key}`)}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3 border-t pt-4 text-sm">
            <Clock className="size-4 shrink-0 text-brand" aria-hidden="true" />
            <span className="font-medium">{levels(`${level}.deadline`)}</span>
            <span className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-500 ease-(--ease-out)"
                style={{ width: `${((levelIndex + 1) / 4) * 100}%` }}
              />
            </span>
          </div>
        </article>
        <p className="relative mt-4 text-center text-xs text-muted-foreground">
          {t('note')}
        </p>
      </div>

      <Button asChild size="xl" className="m-3 mt-0 lg:hidden">
        <Link href="/signup">
          {t('cta')}
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  );
}
