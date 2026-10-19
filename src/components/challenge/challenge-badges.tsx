import { Globe, Languages, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/i18n/routing';
import type { ChallengeLevel, ChallengeStatus } from '@/lib/types/challenge';

export function LevelBadge({ level }: { level: ChallengeLevel }) {
  const t = useTranslations('levels');

  return (
    <Badge variant="secondary" className="font-mono font-normal">
      {t(`${level}.label`)}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ChallengeStatus }) {
  const t = useTranslations('challengeCard');

  if (status === 'GENERATING') {
    return (
      <Badge variant="outline" className="gap-1 text-brand">
        <Loader2 className="animate-spin" aria-hidden="true" />
        {t('badgeGenerating')}
      </Badge>
    );
  }
  return null;
}

export function PublicBadge() {
  const t = useTranslations('challengeCard');

  return (
    <Badge variant="outline" className="gap-1">
      <Globe aria-hidden="true" />
      {t('public')}
    </Badge>
  );
}

/** Shown on challenges written in a language other than the one being read. */
export function LanguageBadge({ locale }: { locale: Locale }) {
  const t = useTranslations('languages');
  const card = useTranslations('challengeCard');

  return (
    <Badge
      variant="outline"
      className="gap-1 font-mono uppercase"
      title={card('languageNote', { language: t(locale) })}
    >
      <Languages aria-hidden="true" />
      {locale}
    </Badge>
  );
}
