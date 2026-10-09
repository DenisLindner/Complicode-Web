import { Clock, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LevelBadge } from '@/components/challenge/challenge-badges';
import {
  ChallengeDocument,
  documentSections,
} from '@/components/challenge/challenge-document';
import { TableOfContents } from '@/components/challenge/table-of-contents';
import { CopyMarkdownButton } from '@/components/challenge/copy-markdown-button';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { getChallenge } from '@/lib/server/challenges';

async function loadPublic(id: string) {
  const challenge = await getChallenge(id);
  return challenge?.status === 'READY' && challenge.content ? challenge : null;
}

export async function generateMetadata({
  params,
}: PageProps<'/d/[id]'>): Promise<Metadata> {
  const challenge = await loadPublic((await params).id);
  if (!challenge) {
    return { title: 'Desafio não encontrado' };
  }
  const title = challenge.projectName ?? challenge.title ?? 'Desafio';
  return {
    title,
    description: challenge.summary ?? undefined,
    openGraph: {
      title: `${title} · Desafio técnico`,
      description: challenge.summary ?? undefined,
      type: 'article',
    },
  };
}

/** A public challenge, readable without an account (shared links). */
export default async function PublicChallengePage({
  params,
}: PageProps<'/d/[id]'>) {
  const challenge = await loadPublic((await params).id);
  if (!challenge?.content) {
    notFound();
  }
  const content = challenge.content;

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
          <article className="min-w-0 space-y-10">
            <header className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {challenge.industry && (
                  <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                    {challenge.industry}
                  </span>
                )}
                <LevelBadge level={challenge.level} />
                <span className="text-muted-foreground">
                  {challenge.stack.name} · {challenge.framework.name}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {challenge.title}
                </h1>
                {challenge.projectName &&
                  challenge.projectName !== challenge.title && (
                    <p className="font-mono text-lg text-brand">
                      {challenge.projectName}
                    </p>
                  )}
                {challenge.summary && (
                  <p className="max-w-3xl text-pretty text-muted-foreground">
                    {challenge.summary}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {content.deadline && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-4" aria-hidden="true" />
                    {content.deadline}
                  </span>
                )}
                <CopyMarkdownButton id={challenge.id} />
              </div>
            </header>

            <ChallengeDocument content={content} />

            <section className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="text-lg font-semibold">
                  Quer um desafio desses só seu?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Escolha sua stack e seu nível. Os 2 primeiros são por nossa
                  conta.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/cadastro">
                  <Sparkles data-icon="inline-start" />
                  Gerar o meu
                </Link>
              </Button>
            </section>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents sections={documentSections(content)} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
