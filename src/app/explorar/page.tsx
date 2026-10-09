import { Compass } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { PaginationLinks, parsePage } from '@/components/pagination-links';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { listPublicChallenges } from '@/lib/server/challenges';

export const metadata: Metadata = {
  title: 'Explorar desafios',
  description:
    'Desafios técnicos gerados pela comunidade do Complicode, baseados em problemas reais da indústria.',
};

const LIMIT = 12;

export default async function ExplorePage({
  searchParams,
}: PageProps<'/explorar'>) {
  const page = parsePage((await searchParams).page);
  const { items, total } = await listPublicChallenges(page, LIMIT);

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-12 sm:px-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Explorar desafios
          </h1>
          <p className="text-muted-foreground">
            Desafios que a comunidade gerou e decidiu compartilhar. Abra um para
            ver o briefing completo.
          </p>
        </div>

        {items.length > 0 ? (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((challenge) => (
                <li key={challenge.id}>
                  <ChallengeCard
                    challenge={challenge}
                    href={`/d/${challenge.id}`}
                  />
                </li>
              ))}
            </ul>
            <PaginationLinks
              page={page}
              total={total}
              limit={LIMIT}
              basePath="/explorar"
            />
          </>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
            <Compass
              className="mb-4 size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="font-semibold">A galeria ainda está vazia</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Gere um desafio e torne-o público para ser o primeiro a aparecer
              aqui.
            </p>
            <Button asChild className="mt-6">
              <Link href="/cadastro">Gerar meu desafio</Link>
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
