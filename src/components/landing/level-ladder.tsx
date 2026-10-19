import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LEVEL_ORDER } from '@/lib/levels';
import { cn } from '@/lib/utils';

// Each step is taller and warmer than the one before it. Muted text stays
// above 4.5:1 up to a 16% tint; the last step is solid caramel.
const STEP_STYLES = [
  'lg:min-h-64 bg-card',
  'lg:min-h-76 bg-[color-mix(in_oklch,var(--primary)_8%,var(--card))]',
  'lg:min-h-88 bg-[color-mix(in_oklch,var(--primary)_16%,var(--card))]',
  'lg:min-h-100 bg-primary text-primary-foreground border-primary',
];

/** The four levels as a staircase: scope and deadline grow at each step. */
export function LevelLadder() {
  const t = useTranslations('levels');

  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      {LEVEL_ORDER.map((level, index) => {
        const last = index === LEVEL_ORDER.length - 1;
        return (
          <li
            key={level}
            className={cn(
              'flex reveal flex-col rounded-[1.5rem] border p-6',
              STEP_STYLES[index],
            )}
          >
            <span className="flex gap-1" aria-hidden="true">
              {LEVEL_ORDER.map((other, position) => (
                <span
                  key={other}
                  className={cn(
                    'h-1.5 w-6 rounded-full',
                    position <= index
                      ? last
                        ? 'bg-primary-foreground'
                        : 'bg-primary'
                      : last
                        ? 'bg-primary-foreground/25'
                        : 'bg-muted-foreground/20',
                  )}
                />
              ))}
            </span>
            <h3 className="mt-auto pt-10 text-2xl font-bold tracking-tight">
              {t(`${level}.label`)}
            </h3>
            <p
              className={cn(
                'mt-1 flex items-center gap-1.5 font-mono text-sm',
                last ? 'text-primary-foreground' : 'text-brand',
              )}
            >
              <Clock className="size-3.5" aria-hidden="true" />
              {t(`${level}.deadline`)}
            </p>
            <p
              className={cn(
                'mt-3 text-sm text-pretty',
                last ? 'text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              {t(`${level}.description`)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
