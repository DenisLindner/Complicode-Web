import { describe, expect, it } from 'vitest';
import { resolveStep } from './steps';

const user = (emailVerified: boolean, phoneVerified: boolean) => ({
  emailVerified,
  phoneVerified,
});

describe('resolveStep', () => {
  it('welcomes a new user', () => {
    expect(resolveStep(user(false, false))).toBe('start');
  });

  it('follows the requested step only when it is allowed', () => {
    expect(resolveStep(user(false, false), 'email')).toBe('email');
    expect(resolveStep(user(false, false), 'phone')).toBe('email');
    expect(resolveStep(user(false, false), 'done')).toBe('email');
    expect(resolveStep(user(true, false), 'email')).toBe('phone');
  });

  it('resumes where the user stopped', () => {
    expect(resolveStep(user(true, false))).toBe('phone');
    expect(resolveStep(user(false, true))).toBe('email');
  });

  it('shows the bonus once everything is verified', () => {
    expect(resolveStep(user(true, true), 'start')).toBe('done');
  });
});
