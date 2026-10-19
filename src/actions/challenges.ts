'use server';

import { getLocale, getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { apiFailure, type ActionResult } from '@/lib/server/action-result';
import { api } from '@/lib/server/api';
import { isApiError } from '@/lib/server/api-error';
import { challengeIdSchema } from '@/lib/server/challenges';

/** Generating calls Gemini (with fallbacks), which can take a while. */
const GENERATION_TIMEOUT_MS = 5 * 60 * 1000;

const generateSchema = z.object({
  stackId: z.uuid(),
  frameworkId: z.uuid(),
  level: z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR']),
});

export async function generateChallenge(
  input: z.input<typeof generateSchema>,
): Promise<ActionResult> {
  const [t, locale] = await Promise.all([
    getTranslations('actions.challenges'),
    getLocale() as Promise<Locale>,
  ]);

  const parsed = generateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: t('pickSelection') };
  }

  let id: string;
  try {
    // The challenge is written in the language the user is reading.
    ({ id } = await api<{ id: string }>('/challenges/generate', {
      method: 'POST',
      body: { ...parsed.data, locale },
      timeoutMs: GENERATION_TIMEOUT_MS,
    }));
  } catch (error) {
    return await apiFailure(error, {
      402: t('noCredits'),
      404: t('notAvailable'),
      503: t('overloaded'),
    });
  }

  redirect(
    getPathname({
      href: {
        pathname: '/app/challenges/[id]',
        params: { id },
        query: { new: '1' },
      },
      locale,
    }),
  );
}

export async function regenerateChallenge(id: string): Promise<ActionResult> {
  const t = await getTranslations('actions.challenges');

  if (!challengeIdSchema.safeParse(id).success) {
    return { ok: false, error: t('invalidChallenge') };
  }

  try {
    await api(`/challenges/${id}/regenerate`, {
      method: 'POST',
      timeoutMs: GENERATION_TIMEOUT_MS,
    });
    return { ok: true };
  } catch (error) {
    if (isApiError(error, 400)) {
      return { ok: false, error: t('alreadyRegenerated') };
    }
    return await apiFailure(error, {
      409: t('stillGenerating'),
      503: t('overloadedRegenerate'),
    });
  }
}

export async function setChallengeVisibility(
  id: string,
  isPublic: boolean,
): Promise<ActionResult> {
  const t = await getTranslations('actions.challenges');

  if (
    !challengeIdSchema.safeParse(id).success ||
    typeof isPublic !== 'boolean'
  ) {
    return { ok: false, error: t('invalidChallenge') };
  }

  try {
    await api(`/challenges/${id}/visibility`, {
      method: 'PATCH',
      body: { public: isPublic },
    });
    return { ok: true };
  } catch (error) {
    return await apiFailure(error, {
      400: t('onlyReadyPublic'),
      404: t('notFound'),
    });
  }
}

export async function deleteChallenge(id: string): Promise<ActionResult> {
  const [t, locale] = await Promise.all([
    getTranslations('actions.challenges'),
    getLocale() as Promise<Locale>,
  ]);

  if (!challengeIdSchema.safeParse(id).success) {
    return { ok: false, error: t('invalidChallenge') };
  }

  try {
    await api(`/challenges/${id}`, { method: 'DELETE' });
  } catch (error) {
    return await apiFailure(error, { 404: t('notFound') });
  }

  redirect(
    getPathname({
      href: { pathname: '/app/challenges', query: { removed: '1' } },
      locale,
    }),
  );
}
