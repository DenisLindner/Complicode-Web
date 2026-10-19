import { describe, expect, it } from 'vitest';
import { createAuthSchemas } from './auth';

// The keys stand in for the translated messages.
const { loginSchema, registerSchema } = createAuthSchemas((key) => key);

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

  it('reports the translated message of the field', () => {
    const result = registerSchema.safeParse({
      name: 'Al',
      email: '',
      password: 'x',
    });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining(['nameMin', 'emailRequired', 'passwordWeak']),
    );
  });
});
