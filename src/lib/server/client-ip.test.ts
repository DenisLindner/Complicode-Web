import { describe, expect, it } from 'vitest';
import { getClientIp } from './client-ip';

const ip = (forwardedFor?: string) =>
  getClientIp(
    new Headers(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
  );

describe('getClientIp', () => {
  it('uses the entry added by the trusted proxy', () => {
    expect(ip('203.0.113.7')).toBe('203.0.113.7');
  });

  it('ignores entries forged by the client before it', () => {
    expect(ip('1.1.1.1, 203.0.113.7')).toBe('203.0.113.7');
  });

  it('ignores missing or invalid values', () => {
    expect(ip()).toBeUndefined();
    expect(ip('not-an-ip')).toBeUndefined();
  });
});
