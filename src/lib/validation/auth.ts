import { z } from 'zod';
import type messages from '../../../messages/en.json';

/** Same rules as the API (RegisterDTO), shown live in the signup form. */
export const PASSWORD_RULES = [
  {
    id: 'length',
    test: (value: string) => value.length >= 8 && value.length <= 64,
  },
  {
    id: 'upper',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'lower',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    test: (value: string) => /\d/.test(value),
  },
] as const;

export type ValidationKey = keyof (typeof messages)['validation'];
/** `t` of the `validation` namespace. */
export type ValidationTranslator = (key: ValidationKey) => string;

/** The schemas are built per language, so the errors are already translated. */
export function createAuthSchemas(t: ValidationTranslator) {
  const email = z
    .string()
    .trim()
    .toLowerCase()
    .min(1, t('emailRequired'))
    .max(254, t('emailTooLong'))
    .pipe(z.email(t('emailInvalid')));

  const loginSchema = z.object({
    email,
    password: z
      .string()
      .min(1, t('passwordRequired'))
      .max(64, t('passwordInvalid')),
  });

  const registerSchema = z.object({
    name: z.string().trim().min(3, t('nameMin')).max(100, t('nameMax')),
    email,
    password: z
      .string()
      .refine(
        (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
        t('passwordWeak'),
      ),
  });

  return { loginSchema, registerSchema };
}

type AuthSchemas = ReturnType<typeof createAuthSchemas>;
export type LoginInput = z.input<AuthSchemas['loginSchema']>;
export type RegisterInput = z.input<AuthSchemas['registerSchema']>;
