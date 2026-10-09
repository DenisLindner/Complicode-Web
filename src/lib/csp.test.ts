import { describe, expect, it } from 'vitest';
import { buildCsp, createNonce } from './csp';

describe('buildCsp', () => {
  it('only lets scripts with the nonce run in production', () => {
    const csp = buildCsp('abc', false);

    expect(csp).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic';");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).not.toContain('unsafe-eval');
  });

  it('allows eval in development for React debugging', () => {
    const csp = buildCsp('abc', true);

    expect(csp).toContain("'unsafe-eval'");
    expect(csp).not.toContain('upgrade-insecure-requests');
  });
});

describe('createNonce', () => {
  it('creates a different nonce on every call', () => {
    expect(createNonce()).not.toBe(createNonce());
  });
});
