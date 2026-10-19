import { CircleCheck, FileText, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { PaginationLinks, parsePage } from '@/components/pagination-links';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { listMyChallenges } from '@/lib/server/challenges';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/app/challenges'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'myChallenges',
  });
  return { title: t('meta') };
}

const LIMIT = 12;

export default async function MyChallengesPage({
  searchParams,
}: PageProps<'/[locale]/app/challenges'>) {
  const [query, t] = await Promise.all([
    searchParams,
    getTranslations('myChallenges'),
  ]);
  const page = parsePage(query.page);
  const { items, total } = await listMyChallenges(page, LIMIT);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {total > 0 ? t('count', { count: total }) : t('emptyLead')}
          </p>
        </div>
        {total > 0 && (
          <Button asChild>
            <Link href="/app/generate">
              <Sparkles data-icon="inline-start" />
              {t('generate')}
            </Link>
          </Button>
        )}
      </div>

      {query.removed === '1' && (
        <Alert>
          <CircleCheck />
          <AlertDescription>{t('removed')}</AlertDescription>
        </Alert>
      )}

      {items.length > 0 ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((challenge) => (
              <li key={challenge.id}>
                <ChallengeCard
                  challenge={challenge}
                  href={{
                    pathname: '/app/challenges/[id]',
                    params: { id: challenge.id },
                  }}
                  showVisibility
                />
              </li>
            ))}
          </ul>
          <PaginationLinks
            page={page}
            total={total}
            limit={LIMIT}
            basePath="/app/challenges"
          />
        </>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <h2 className="font-semibold">{t('emptyTitle')}</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {t('emptyText')}
          </p>
          <Button asChild className="mt-6">
            <Link href="/app/generate">
              <Sparkles data-icon="inline-start" />
              {t('emptyCta')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
