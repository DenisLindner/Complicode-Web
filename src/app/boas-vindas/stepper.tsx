import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ONBOARDING_STEPS, type OnboardingStep } from './steps';

export function Stepper({ current }: { current: OnboardingStep }) {
  const currentIndex = ONBOARDING_STEPS.findIndex(({ id }) => id === current);

  return (
    <nav aria-label="Progresso do cadastro">
      <ol className="flex items-center gap-2">
        {ONBOARDING_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={step.id}
              className="flex flex-1 items-center gap-2 last:flex-none"
              aria-current={active ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary text-brand ring-4 ring-primary/15',
                  !done && !active && 'text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-sm sm:inline',
                  active ? 'font-medium' : 'text-muted-foreground',
                )}
              >
                {step.label}
                {done && <span className="sr-only"> (concluído)</span>}
              </span>
              {index < ONBOARDING_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-px flex-1 transition-colors',
                    done ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
