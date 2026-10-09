import { describe, expect, it } from 'vitest';
import { isTrustedCheckoutUrl } from './credits';

describe('isTrustedCheckoutUrl', () => {
  it.each([
    'https://abacatepay.com/pay/bill_123',
    'https://app.abacatepay.com/checkout/abc',
  ])('accepts %s', (url) => {
    expect(isTrustedCheckoutUrl(url)).toBe(true);
  });

  it.each([
    'http://abacatepay.com/pay/bill_123',
    'https://abacatepay.com.evil.com/pay',
    'https://evilabacatepay.com/pay',
    'javascript:alert(1)',
    '/app',
    '',
    null,
  ])('refuses %s', (url) => {
    expect(isTrustedCheckoutUrl(url)).toBe(false);
  });
});
