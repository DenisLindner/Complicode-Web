const BASE = 'http://complicode.local';

/**
 * Accepts only paths inside this app (prevents open redirects such as
 * ?next=//evil.com or ?next=https://evil.com).
 */
export function safeRedirectPath(value: unknown, fallback = '/app') {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\')
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, BASE);
    return url.origin === BASE ? `${url.pathname}${url.search}` : fallback;
  } catch {
    return fallback;
  }
}
