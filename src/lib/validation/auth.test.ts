import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './auth';

describe('auth validation', () => {
  it('normalizes the email', () => {
    const result = loginSchema.parse({
      email: '  Ana@Example.COM ',
      password: 'x',
    });

    expect(result.email).toBe('ana@example.com');
  });

  it('accepts a password that follows the API rules', () => {
    expect(
      registerSchema.safeParse({
        name: 'Ana Souza',
        email: 'ana@example.com',
        password: 'Senha123',
      }).success,
    ).toBe(true);
  });

  it.each([
    'senha123',
    'SENHA123',
    'SenhaSenha',
    'Sen1',
    `Aa1${'x'.repeat(62)}`,
  ])('rejects the password %s', (password) => {
    expect(
      registerSchema.safeParse({
        name: 'Ana Souza',
        email: 'ana@example.com',
        password,
      }).success,
    ).toBe(false);
  });
});
