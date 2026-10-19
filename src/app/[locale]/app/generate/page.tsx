import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { getStacks } from '@/lib/server/challenges';
import { requireUser } from '@/lib/server/dal';
import { LEVEL_ORDER } from '@/lib/levels';
import type { ChallengeLevel } from '@/lib/types/challenge';
import { Generator } from './generator';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/app/generate'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'generator',
  });
  return { title: t('meta') };
}

/** ?stack=backend&framework=nestjs&level=JUNIOR preselects the choices. */
export default async function GeneratePage({
  searchParams,
}: PageProps<'/[locale]/app/generate'>) {
  const [user, stacks, params] = await Promise.all([
    requireUser(),
    getStacks(),
    searchParams,
  ]);

  const stack = stacks.find(({ slug }) => slug === params.stack);
  const framework = stack?.frameworks.find(
    ({ slug }) => slug === params.framework,
  );
  const level = LEVEL_ORDER.find((value) => value === params.level) as
    ChallengeLevel | undefined;

  return (
    <Generator
      stacks={stacks}
      credits={user.credits}
      verified={user.verified}
      initial={{ stackId: stack?.id, frameworkId: framework?.id, level }}
    />
  );
}
