import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A handwritten note with a hand-drawn arrow, the one playful touch on the
 * page. Decorative: whatever it says must also be said in the copy.
 *
 * `right` draws a sideways arrow whose tip sits 10px above the note's bottom
 * edge, so `bottom-1/2 -mb-2.5` lands it on the vertical center of a target.
 */
export function Scribble({
  children,
  arrow = 'down-left',
  className,
  style,
}: {
  children: ReactNode;
  arrow?: 'down-left' | 'down-right' | 'right';
  className?: string;
  style?: CSSProperties;
}) {
  if (arrow === 'right') {
    return (
      <div
        aria-hidden="true"
        style={style}
        className={cn(
          'pointer-events-none absolute z-10 flex pop items-end gap-1',
          className,
        )}
      >
        <p className="mb-5 -rotate-6 font-hand text-xl leading-tight whitespace-nowrap text-brand">
          {children}
        </p>
        <svg
          viewBox="0 0 64 32"
          fill="none"
          className="h-8 w-16 shrink-0 stroke-brand opacity-70"
        >
          <path
            d="M3 9C20 2 40 6 58 21"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M48 23l10 -1l-3 -10"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn('pointer-events-none absolute z-10 w-48 pop', className)}
    >
      <p
        className={cn(
          'font-hand text-xl leading-tight text-brand',
          arrow === 'down-left'
            ? 'ml-10 -rotate-6'
            : 'mr-10 rotate-6 text-right',
        )}
      >
        {children}
      </p>
      <svg
        viewBox="0 0 48 56"
        fill="none"
        className={cn(
          'mt-1 h-14 w-12 stroke-brand opacity-70',
          arrow === 'down-right' && 'ml-auto -scale-x-100',
        )}
      >
        <path
          d="M40 4C30 10 14 18 10 46"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3 38l7 9 8-7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
