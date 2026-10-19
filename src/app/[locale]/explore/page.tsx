import { Compass } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { PaginationLinks, parsePage } from '@/components/pagination-links';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { listPublicChallenges } from '@/lib/server/challenges';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/explore'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'explore',
  });
  return { title: t('title'), description: t('description') };
}

const LIMIT = 12;

export default async function ExplorePage({
  searchParams,
}: PageProps<'/[locale]/explore'>) {
  const [query, t] = await Promise.all([
    searchParams,
    getTranslations('explore'),
  ]);
  const page = parsePage(query.page);
  const { items, total } = await listPublicChallenges(page, LIMIT);

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-12 sm:px-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('heading')}
          </h1>
          <p className="text-muted-foreground">{t('lead')}</p>
        </div>

        {items.length > 0 ? (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((challenge) => (
                <li key={challenge.id}>
                  <ChallengeCard
                    challenge={challenge}
                    href={{
                      pathname: '/c/[id]',
                      params: { id: challenge.id },
                    }}
                  />
                </li>
              ))}
            </ul>
            <PaginationLinks
              page={page}
              total={total}
              limit={LIMIT}
              basePath="/explore"
            />
          </>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
            <Compass
              className="mb-4 size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="font-semibold">{t('emptyTitle')}</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {t('emptyText')}
            </p>
            <Button asChild className="mt-6">
              <Link href="/signup">{t('emptyCta')}</Link>
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
