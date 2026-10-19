import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { StackIcon } from '@/components/stack-icon';
import { Link } from '@/i18n/navigation';
import { stackLabel } from '@/i18n/stack-label';
import type { ChallengeSummary } from '@/lib/types/challenge';
import {
  LanguageBadge,
  LevelBadge,
  PublicBadge,
  StatusBadge,
} from './challenge-badges';

type ChallengeHref = Parameters<typeof Link>[0]['href'];

export function ChallengeCard({
  challenge,
  href,
  showVisibility = false,
}: {
  challenge: ChallengeSummary;
  href: ChallengeHref;
  showVisibility?: boolean;
}) {
  const t = useTranslations('challengeCard');
  const stacks = useTranslations('stacks');
  const format = useFormatter();
  const locale = useLocale();

  const stackName = stackLabel(
    stacks,
    challenge.stack.slug,
    challenge.stack.name,
  );
  const title = challenge.title ?? t('generating');
  // The text of the card is in the language of the challenge.
  const otherLanguage = challenge.locale !== locale;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all outline-none hover:border-primary/50 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
          {challenge.industry ?? stackName}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusBadge status={challenge.status} />
          {otherLanguage && <LanguageBadge locale={challenge.locale} />}
          {showVisibility && challenge.public && <PublicBadge />}
        </div>
      </div>
      <h3
        lang={challenge.locale}
        className="line-clamp-2 font-semibold text-balance group-hover:text-brand"
      >
        {title}
      </h3>
      {challenge.projectName && challenge.projectName !== challenge.title && (
        <p className="mt-0.5 font-mono text-sm text-brand">
          {challenge.projectName}
        </p>
      )}
      {challenge.summary && (
        <p
          lang={challenge.locale}
          className="mt-2 line-clamp-2 text-sm text-muted-foreground"
        >
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
            {format.dateTime(new Date(challenge.createdAt), 'short')}
          </time>
        </span>
      </div>
    </Link>
  );
}
