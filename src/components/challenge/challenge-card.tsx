import Link from 'next/link';
import { StackIcon } from '@/components/stack-icon';
import { formatDate } from '@/lib/format';
import type { ChallengeSummary } from '@/lib/types/challenge';
import { LevelBadge, PublicBadge, StatusBadge } from './challenge-badges';

export function ChallengeCard({
  challenge,
  href,
  showVisibility = false,
}: {
  challenge: ChallengeSummary;
  href: string;
  showVisibility?: boolean;
}) {
  const title =
    challenge.title ??
    (challenge.status === 'FAILED' ? 'Geração falhou' : 'Gerando desafio…');

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all outline-none hover:border-primary/50 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
          {challenge.industry ?? challenge.stack.name}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusBadge status={challenge.status} />
          {showVisibility && challenge.public && <PublicBadge />}
        </div>
      </div>
      <h3 className="line-clamp-2 font-semibold text-balance group-hover:text-brand">
        {title}
      </h3>
      {challenge.projectName && challenge.projectName !== challenge.title && (
        <p className="mt-0.5 font-mono text-sm text-brand">
          {challenge.projectName}
        </p>
      )}
      {challenge.summary && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {challenge.summary}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-5 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5">
          <StackIcon
            slug={challenge.stack.slug}
            className="size-3.5 shrink-0"
          />
          <span className="truncate">{challenge.framework.name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <LevelBadge level={challenge.level} />
          <time dateTime={challenge.createdAt}>
            {formatDate(challenge.createdAt)}
          </time>
        </span>
      </div>
    </Link>
  );
}
