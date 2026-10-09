import { z } from 'zod';

/** Same rules as the API (RegisterDTO), shown live in the signup form. */
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'Entre 8 e 64 caracteres',
    test: (value: string) => value.length >= 8 && value.length <= 64,
  },
  {
    id: 'upper',
    label: 'Uma letra maiúscula',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'lower',
    label: 'Uma letra minúscula',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'Um número',
    test: (value: string) => /\d/.test(value),
  },
] as const;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Informe seu email')
  .max(254, 'Email muito longo')
  .pipe(z.email('Informe um email válido'));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha').max(64, 'Senha inválida'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Use pelo menos 3 caracteres')
    .max(100, 'Use no máximo 100 caracteres'),
  email,
  password: z
    .string()
    .refine(
      (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
      'A senha não atende aos requisitos',
    ),
});

export type LoginInput = z.input<typeof loginSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
