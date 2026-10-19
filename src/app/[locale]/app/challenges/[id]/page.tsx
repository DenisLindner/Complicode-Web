import { ArrowLeft, Loader2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { asLocale } from '@/i18n/locale';
import { AutoRefresh } from '@/components/auto-refresh';
import { ChallengeView } from '@/components/challenge/challenge-view';
import { getDocumentLabels } from '@/i18n/document-labels';
import { getPathname, Link } from '@/i18n/navigation';
import { getChallenge } from '@/lib/server/challenges';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/app/challenges/[id]'>): Promise<Metadata> {
  const { id, locale } = await params;
  const [challenge, t] = await Promise.all([
    getChallenge(id),
    getTranslations({ locale: asLocale(locale), namespace: 'publicChallenge' }),
  ]);
  return {
    title: challenge?.projectName ?? challenge?.title ?? t('fallbackTitle'),
  };
}

export default async function ChallengePage({
  params,
  searchParams,
}: PageProps<'/[locale]/app/challenges/[id]'>) {
  const [{ id, locale }, query] = await Promise.all([params, searchParams]);
  const [challenge, t] = await Promise.all([
    getChallenge(id),
    getTranslations('challenge'),
  ]);

  if (!challenge) {
    notFound();
  }
  if (!challenge.isOwner) {
    // Someone else's public challenge has its own public page.
    redirect(
      getPathname({
        href: { pathname: '/c/[id]', params: { id: challenge.id } },
        locale: asLocale(locale),
      }),
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/app/challenges"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('back')}
      </Link>

      {challenge.status === 'GENERATING' && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-16 text-center">
          <AutoRefresh />
          <Loader2
            className="size-8 animate-spin text-brand"
            aria-hidden="true"
          />
          <h1 className="text-xl font-semibold">{t('generatingTitle')}</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            {t('generatingText')}
          </p>
        </div>
      )}

      {challenge.status === 'READY' && (
        <ChallengeView
          challenge={challenge}
          documentLabels={await getDocumentLabels(challenge.locale)}
          isNew={query.new === '1'}
        />
      )}
    </div>
  );
}
