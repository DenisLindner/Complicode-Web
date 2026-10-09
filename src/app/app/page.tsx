import {
  ArrowRight,
  Coins,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { Button } from '@/components/ui/button';
import { listMyChallenges } from '@/lib/server/challenges';
import { requireUser } from '@/lib/server/dal';

export const metadata: Metadata = { title: 'Início' };

function Stat({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 text-brand" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
        {value}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          {action.label}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const [user, recent] = await Promise.all([
    requireUser(),
    listMyChallenges(1, 3),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Olá, {user.firstName}
          </h1>
          <p className="text-muted-foreground">
            {user.credits > 0
              ? 'Pronto para o próximo desafio?'
              : 'Você está sem créditos no momento.'}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/app/gerar">
            <Sparkles data-icon="inline-start" />
            Gerar desafio
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={Coins}
          label="Créditos"
          value={String(user.credits)}
          action={
            user.verified
              ? undefined
              : { href: '/boas-vindas', label: 'Ganhar 2 grátis' }
          }
        />
        <Stat
          icon={FileText}
          label="Desafios gerados"
          value={String(recent.total)}
          action={
            recent.total > 0
              ? { href: '/app/desafios', label: 'Ver todos' }
              : undefined
          }
        />
        <Stat
          icon={ShieldCheck}
          label="Verificação"
          value={
            user.verified
              ? 'Completa'
              : `${Number(user.emailVerified) + Number(user.phoneVerified)} de 2`
          }
          action={
            user.verified
              ? undefined
              : { href: '/boas-vindas', label: 'Continuar' }
          }
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Desafios recentes</h2>
          {recent.total > 3 && (
            <Link
              href="/app/desafios"
              className="text-sm font-medium text-brand underline-offset-4 hover:underline"
            >
              Ver todos
            </Link>
          )}
        </div>
        {recent.items.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.items.map((challenge) => (
              <li key={challenge.id}>
                <ChallengeCard
                  challenge={challenge}
                  href={`/app/desafios/${challenge.id}`}
                  showVisibility
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            Você ainda não gerou nenhum desafio.{' '}
            <Link
              href="/app/gerar"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              Gerar o primeiro
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
