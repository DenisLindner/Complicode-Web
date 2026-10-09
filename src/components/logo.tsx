import { cn } from '@/lib/utils';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn('size-7 shrink-0', className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M12.5 10 7.5 16l5 6M19.5 10l5 6-5 6"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="font-mono text-lg font-semibold tracking-tight">
        complicode
      </span>
    </span>
  );
}
