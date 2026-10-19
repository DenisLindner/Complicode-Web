import { ArrowLeft, Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { AutoRefresh } from '@/components/auto-refresh';
import { ChallengeView } from '@/components/challenge/challenge-view';
import { getChallenge } from '@/lib/server/challenges';

export async function generateMetadata({
  params,
}: PageProps<'/app/desafios/[id]'>): Promise<Metadata> {
  const challenge = await getChallenge((await params).id);
  return { title: challenge?.projectName ?? challenge?.title ?? 'Desafio' };
}

export default async function ChallengePage({
  params,
  searchParams,
}: PageProps<'/app/desafios/[id]'>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const challenge = await getChallenge(id);

  if (!challenge) {
    notFound();
  }
  if (!challenge.isOwner) {
    // Someone else's public challenge has its own public page.
    redirect(`/d/${challenge.id}`);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/app/desafios"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Meus desafios
      </Link>

      {challenge.status === 'GENERATING' && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-16 text-center">
          <AutoRefresh />
          <Loader2
            className="size-8 animate-spin text-brand"
            aria-hidden="true"
          />
          <h1 className="text-xl font-semibold">
            Seu desafio está sendo gerado
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Isso leva de 20 a 60 segundos. Esta página atualiza sozinha quando
            ele ficar pronto.
          </p>
        </div>
      )}

      {challenge.status === 'READY' && (
        <ChallengeView challenge={challenge} isNew={query.novo === '1'} />
      )}
    </div>
  );
}
