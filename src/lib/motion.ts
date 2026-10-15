import type { CSSProperties } from 'react';

/** Delay for the rise/pop entrance utilities, to stagger siblings. */
export function delay(ms: number) {
  return { '--d': `${ms}ms` } as CSSProperties;
}
