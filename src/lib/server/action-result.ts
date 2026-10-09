import 'server-only';
import type { z } from 'zod';
import { isApiError } from './api-error';

/** What a Server Action returns to its form. Never carries API internals. */
export interface ActionResult<Field extends string = string> {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<Field, string>>;
}

export function validationFailure<Field extends string>(
  error: z.ZodError,
): ActionResult<Field> {
  const fieldErrors: Partial<Record<Field, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as Field;
    fieldErrors[field] ??= issue.message;
  }
  return { ok: false, fieldErrors };
}

/**
 * Turns an API failure into a friendly pt-BR message. Specific statuses get
 * their message from `messages`; anything unexpected is logged on the server
 * and shown as a generic error.
 */
export function apiFailure(
  error: unknown,
  messages: Partial<Record<number, string>> = {},
): ActionResult {
  if (isApiError(error)) {
    const message = messages[error.status] ?? COMMON_MESSAGES[error.status];
    if (message) {
      return { ok: false, error: message };
    }
  }

  console.error(error);
  return {
    ok: false,
    error: 'Algo deu errado do nosso lado. Tente novamente em instantes.',
  };
}

const COMMON_MESSAGES: Partial<Record<number, string>> = {
  402: 'Você não tem créditos suficientes.',
  429: 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.',
  503: 'O serviço está indisponível no momento. Tente novamente em instantes.',
};
