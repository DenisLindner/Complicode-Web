'use client';

import { InlineMarkdown } from '@/components/inline-markdown';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { ChallengeRequirement } from '@/lib/types/challenge';
import { cn } from '@/lib/utils';

function parseProgress(raw: string | null): number[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(value) ? value.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

/**
 * Requirements, with a personal checklist when `storageKey` is set. The
 * progress is a convenience that stays in this browser only.
 */
export function RequirementList({
  requirements,
  storageKey,
}: {
  requirements: ChallengeRequirement[];
  storageKey?: string;
}) {
  const [raw, setRaw] = useLocalStorage(storageKey ?? 'cc:progress:none');
  const done = storageKey ? parseProgress(raw) : [];

  const toggle = (index: number, checked: boolean) => {
    const next = checked
      ? [...new Set([...done, index])]
      : done.filter((item) => item !== index);
    setRaw(JSON.stringify(next));
  };

  return (
    <div className="space-y-3">
      {storageKey && (
        <p className="text-xs text-muted-foreground">
          {done.length} de {requirements.length} concluídos · marque o que já
          fez (fica salvo neste navegador)
        </p>
      )}
      <ol className="space-y-3">
        {requirements.map((requirement, index) => {
          const checked = done.includes(index);
          const id = storageKey ? `${storageKey}-${index}` : undefined;
          return (
            <li
              key={requirement.title}
              className={cn(
                'rounded-xl border bg-card p-4 transition-colors',
                checked && 'border-success/40 bg-success/5',
              )}
            >
              <div className="flex items-start gap-3">
                {storageKey ? (
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(value) => toggle(index, value === true)}
                    className="mt-0.5 border-muted-foreground/50"
                  />
                ) : (
                  <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                <div className="min-w-0 space-y-1.5">
                  <label
                    htmlFor={id}
                    className={cn(
                      'block font-medium',
                      storageKey && 'cursor-pointer',
                      checked && 'text-muted-foreground line-through',
                    )}
                  >
                    {requirement.title}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    <InlineMarkdown text={requirement.description} />
                  </p>
                  {requirement.details.length > 0 && (
                    <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground marker:text-border">
                      {requirement.details.map((detail) => (
                        <li key={detail}>
                          <InlineMarkdown text={detail} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
