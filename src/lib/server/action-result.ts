import 'server-only';
import { getTranslations } from 'next-intl/server';
import type { z } from 'zod';
import { isApiError } from './api-error';

/** What a Server Action returns to its form. Never carries API internals. */
export interface ActionResult<Field extends string = string> {
  ok: boolean;
  error?: string;
  /** Lets the form react to a specific failure whatever the language. */
  code?: 'EMAIL_TAKEN';
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
 * Turns an API failure into a friendly message in the language of the
 * visitor. Specific statuses get their message from `messages`; anything
 * unexpected is logged on the server and shown as a generic error.
 */
export async function apiFailure(
  error: unknown,
  messages: Partial<Record<number, string>> = {},
): Promise<ActionResult> {
  const t = await getTranslations('errors');

  if (isApiError(error)) {
    const common: Partial<Record<number, string>> = {
      402: t('noCredits'),
      429: t('tooManyRequests'),
      503: t('unavailable'),
    };
    const message = messages[error.status] ?? common[error.status];
    if (message) {
      return { ok: false, error: message };
    }
  }

  console.error(error);
  return { ok: false, error: t('generic') };
}
