'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
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

const GENERATION_ERRORS = {
  402: 'Você não tem créditos suficientes para gerar um desafio.',
  503: 'A IA está sobrecarregada agora. Seu crédito foi devolvido; tente de novo em alguns minutos.',
};

export async function generateChallenge(
  input: z.input<typeof generateSchema>,
): Promise<ActionResult> {
  const parsed = generateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Escolha a stack, o framework e o nível.' };
  }

  let id: string;
  try {
    ({ id } = await api<{ id: string }>('/challenges/generate', {
      method: 'POST',
      body: parsed.data,
      timeoutMs: GENERATION_TIMEOUT_MS,
    }));
  } catch (error) {
    return apiFailure(error, {
      ...GENERATION_ERRORS,
      404: 'Essa combinação de stack e framework não está disponível.',
    });
  }

  redirect(`/app/desafios/${id}?novo=1`);
}

export async function regenerateChallenge(id: string): Promise<ActionResult> {
  if (!challengeIdSchema.safeParse(id).success) {
    return { ok: false, error: 'Desafio inválido.' };
  }

  try {
    await api(`/challenges/${id}/regenerate`, {
      method: 'POST',
      timeoutMs: GENERATION_TIMEOUT_MS,
    });
    return { ok: true };
  } catch (error) {
    if (isApiError(error, 400)) {
      return { ok: false, error: 'Este desafio já foi regerado.' };
    }
    return apiFailure(error, {
      409: 'Este desafio ainda está sendo gerado.',
      503: 'A IA está sobrecarregada agora. Tente regerar de novo em alguns minutos.',
    });
  }
}

export async function setChallengeVisibility(
  id: string,
  isPublic: boolean,
): Promise<ActionResult> {
  if (
    !challengeIdSchema.safeParse(id).success ||
    typeof isPublic !== 'boolean'
  ) {
    return { ok: false, error: 'Desafio inválido.' };
  }

  try {
    await api(`/challenges/${id}/visibility`, {
      method: 'PATCH',
      body: { public: isPublic },
    });
    return { ok: true };
  } catch (error) {
    return apiFailure(error, {
      400: 'Só desafios prontos podem ser públicos.',
      404: 'Desafio não encontrado.',
    });
  }
}

export async function deleteChallenge(id: string): Promise<ActionResult> {
  if (!challengeIdSchema.safeParse(id).success) {
    return { ok: false, error: 'Desafio inválido.' };
  }

  try {
    await api(`/challenges/${id}`, { method: 'DELETE' });
  } catch (error) {
    return apiFailure(error, { 404: 'Desafio não encontrado.' });
  }

  redirect('/app/desafios?removido=1');
}
