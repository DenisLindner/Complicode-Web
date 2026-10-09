import type { CurrentUser } from '@/lib/server/dal';

export const ONBOARDING_STEPS = [
  { id: 'inicio', label: 'Boas-vindas' },
  { id: 'email', label: 'Email' },
  { id: 'telefone', label: 'Telefone' },
  { id: 'pronto', label: 'Bônus' },
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]['id'];

type Progress = Pick<CurrentUser, 'emailVerified' | 'phoneVerified'>;

/**
 * The step to show. The server state wins over the URL, so a step cannot be
 * skipped: email comes before the phone and the bonus only after both.
 */
export function resolveStep(
  user: Progress,
  requested?: unknown,
): OnboardingStep {
  if (user.emailVerified && user.phoneVerified) {
    return 'pronto';
  }
  const fresh = !user.emailVerified && !user.phoneVerified;
  if (requested === 'inicio' || (fresh && requested === undefined)) {
    return 'inicio';
  }
  return user.emailVerified ? 'telefone' : 'email';
}
