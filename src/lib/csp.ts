/**
 * Strict Content Security Policy: scripts only run with the per-request nonce
 * (and what they load, through 'strict-dynamic'). Inline style attributes are
 * allowed because React and Radix set them; they cannot execute code.
 */
export function buildCsp(nonce: string, isDev: boolean) {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ];

  return directives.join('; ');
}

export function createNonce() {
  return btoa(crypto.randomUUID());
}
