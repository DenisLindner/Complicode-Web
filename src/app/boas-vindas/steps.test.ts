import { describe, expect, it } from 'vitest';
import { resolveStep } from './steps';

const user = (emailVerified: boolean, phoneVerified: boolean) => ({
  emailVerified,
  phoneVerified,
});

describe('resolveStep', () => {
  it('welcomes a new user', () => {
    expect(resolveStep(user(false, false))).toBe('inicio');
  });

  it('follows the requested step only when it is allowed', () => {
    expect(resolveStep(user(false, false), 'email')).toBe('email');
    expect(resolveStep(user(false, false), 'telefone')).toBe('email');
    expect(resolveStep(user(false, false), 'pronto')).toBe('email');
    expect(resolveStep(user(true, false), 'email')).toBe('telefone');
  });

  it('resumes where the user stopped', () => {
    expect(resolveStep(user(true, false))).toBe('telefone');
    expect(resolveStep(user(false, true))).toBe('email');
  });

  it('shows the bonus once everything is verified', () => {
    expect(resolveStep(user(true, true), 'inicio')).toBe('pronto');
  });
});
