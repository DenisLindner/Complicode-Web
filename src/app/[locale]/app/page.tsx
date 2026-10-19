import {
  ArrowRight,
  Coins,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { listMyChallenges } from '@/lib/server/challenges';
import { requireUser } from '@/lib/server/dal';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/app'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'dashboard',
  });
  return { title: t('meta') };
}

function Stat({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  action?: {
    href: '/welcome' | '/app/challenges';
    label: string;
  };
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
  const [user, recent, t] = await Promise.all([
    requireUser(),
    listMyChallenges(1, 3),
    getTranslations('dashboard'),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t('greeting', { name: user.firstName })}
          </h1>
          <p className="text-muted-foreground">
            {user.credits > 0 ? t('ready') : t('noCredits')}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/app/generate">
            <Sparkles data-icon="inline-start" />
            {t('generate')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={Coins}
          label={t('credits')}
          value={String(user.credits)}
          action={
            user.verified
              ? undefined
              : { href: '/welcome', label: t('earnFree') }
          }
        />
        <Stat
          icon={FileText}
          label={t('generated')}
          value={String(recent.total)}
          action={
            recent.total > 0
              ? { href: '/app/challenges', label: t('seeAll') }
              : undefined
          }
        />
        <Stat
          icon={ShieldCheck}
          label={t('verification')}
          value={
            user.verified
              ? t('complete')
              : t('progress', {
                  done: Number(user.emailVerified) + Number(user.phoneVerified),
                })
          }
          action={
            user.verified
              ? undefined
              : { href: '/welcome', label: t('continue') }
          }
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t('recent')}</h2>
          {recent.total > 3 && (
            <Link
              href="/app/challenges"
              className="text-sm font-medium text-brand underline-offset-4 hover:underline"
            >
              {t('seeAll')}
            </Link>
          )}
        </div>
        {recent.items.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.items.map((challenge) => (
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
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            {t('empty')}{' '}
            <Link
              href="/app/generate"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              {t('first')}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
