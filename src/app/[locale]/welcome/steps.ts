import type { CurrentUser } from '@/lib/server/dal';

/** The label of each step is in the `onboarding.steps` messages. */
export const ONBOARDING_STEPS = [
  { id: 'start' },
  { id: 'email' },
  { id: 'phone' },
  { id: 'done' },
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
    return 'done';
  }
  const fresh = !user.emailVerified && !user.phoneVerified;
  if (requested === 'start' || (fresh && requested === undefined)) {
    return 'start';
  }
  return user.emailVerified ? 'phone' : 'email';
}
