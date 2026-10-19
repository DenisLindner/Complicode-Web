import type { ChallengeLevel } from './types/challenge';

/**
 * Same scope the API asks the model for (src/ai/prompts/challenge.prompt.ts).
 * The label, deadline and description of each level are in the `levels`
 * messages.
 */
export const LEVEL_ORDER: ChallengeLevel[] = [
  'INTERN',
  'JUNIOR',
  'MID',
  'SENIOR',
];
