import type { Metadata } from 'next';
import { getStacks } from '@/lib/server/challenges';
import { requireUser } from '@/lib/server/dal';
import { LEVEL_ORDER } from '@/lib/levels';
import type { ChallengeLevel } from '@/lib/types/challenge';
import { Generator } from './generator';

export const metadata: Metadata = { title: 'Gerar desafio' };

/** ?stack=backend&framework=nestjs&nivel=JUNIOR preselects the choices. */
export default async function GeneratePage({
  searchParams,
}: PageProps<'/app/gerar'>) {
  const [user, stacks, params] = await Promise.all([
    requireUser(),
    getStacks(),
    searchParams,
  ]);

  const stack = stacks.find(({ slug }) => slug === params.stack);
  const framework = stack?.frameworks.find(
    ({ slug }) => slug === params.framework,
  );
  const level = LEVEL_ORDER.find((value) => value === params.nivel) as
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
