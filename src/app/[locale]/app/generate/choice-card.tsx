import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** A radio input styled as a selectable card (keyboard and screen reader friendly). */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  disabled,
  children,
  className,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer rounded-xl border bg-card p-4 transition-all outline-none',
        'hover:border-primary/50 hover:shadow-xs',
        'has-checked:border-primary has-checked:bg-accent/40 has-checked:ring-3 has-checked:ring-primary/20',
        'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
        'has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="sr-only"
      />
      {children}
    </label>
  );
}
