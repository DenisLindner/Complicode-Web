'use client';

import { useEffect, useState } from 'react';

/** Whole seconds left until `until` (a timestamp), updated every second. */
export function useCountdown(until: number | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until === null) {
      return;
    }
    // Resyncs right away, since `now` may predate the new deadline.
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [until]);

  return until === null ? 0 : Math.max(0, Math.floor((until - now) / 1000));
}
