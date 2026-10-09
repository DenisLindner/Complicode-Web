import { describe, expect, it } from 'vitest';
import { safeRedirectPath } from './redirect';

describe('safeRedirectPath', () => {
  it.each([
    ['/app/desafios', '/app/desafios'],
    ['/app/desafios?page=2', '/app/desafios?page=2'],
    ['/app/../entrar', '/entrar'],
  ])('keeps the internal path %s', (value, expected) => {
    expect(safeRedirectPath(value)).toBe(expected);
  });

  it.each([
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
    'javascript:alert(1)',
    'app',
    '',
    undefined,
    ['/app'],
  ])('falls back for %s', (value) => {
    expect(safeRedirectPath(value)).toBe('/app');
  });
});
