import { CircleCheck, FileText, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { PaginationLinks, parsePage } from '@/components/pagination-links';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { listMyChallenges } from '@/lib/server/challenges';
import { plural } from '@/lib/format';

export const metadata: Metadata = { title: 'Meus desafios' };

const LIMIT = 12;

export default async function MyChallengesPage({
  searchParams,
}: PageProps<'/app/desafios'>) {
  const query = await searchParams;
  const page = parsePage(query.page);
  const { items, total } = await listMyChallenges(page, LIMIT);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Meus desafios
          </h1>
          <p className="text-muted-foreground">
            {total > 0
              ? plural(total, 'desafio gerado', 'desafios gerados')
              : 'Seus desafios aparecem aqui.'}
          </p>
        </div>
        {total > 0 && (
          <Button asChild>
            <Link href="/app/gerar">
              <Sparkles data-icon="inline-start" />
              Gerar desafio
            </Link>
          </Button>
        )}
      </div>

      {query.removido === '1' && (
        <Alert>
          <CircleCheck />
          <AlertDescription>Desafio excluído.</AlertDescription>
        </Alert>
      )}

      {items.length > 0 ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((challenge) => (
              <li key={challenge.id}>
                <ChallengeCard
                  challenge={challenge}
                  href={`/app/desafios/${challenge.id}`}
                  showVisibility
                />
              </li>
            ))}
          </ul>
          <PaginationLinks
            page={page}
            total={total}
            limit={LIMIT}
            basePath="/app/desafios"
          />
        </>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <h2 className="font-semibold">Nenhum desafio ainda</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Escolha sua stack e seu nível e receba um briefing completo, baseado
            em um problema real de empresa.
          </p>
          <Button asChild className="mt-6">
            <Link href="/app/gerar">
              <Sparkles data-icon="inline-start" />
              Gerar meu primeiro desafio
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
