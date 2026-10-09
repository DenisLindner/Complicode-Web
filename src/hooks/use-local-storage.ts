'use client';

import { useCallback, useSyncExternalStore } from 'react';

const EVENT = 'cc:local-storage';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    // Storage may be blocked (private mode, disabled site data).
    return null;
  }
}

/**
 * A raw localStorage value, in sync across components and tabs. The server
 * render (and the first client render) sees null, so hydration matches.
 */
export function useLocalStorage(key: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );

  const setValue = useCallback(
    (next: string) => {
      try {
        localStorage.setItem(key, next);
      } catch {
        // Not persisted, the interface still works for this visit.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  return [value, setValue] as const;
}
