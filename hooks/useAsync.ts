"use client";

import { useEffect, useEffectEvent, useState } from "react";

type Settled<T> = { id: string; data?: T; error?: Error };

/**
 * Runs `fn` whenever `key` changes and reports loading / data / error.
 * Pass `key: null` to hold off (e.g. until an id is known). `reload()` refetches.
 * Results from a superseded key are ignored, so fast filter changes can't show stale data.
 */
export function useAsync<T>(fn: () => Promise<T>, key: string | null) {
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<Settled<T>>();
  const run = useEffectEvent(fn);

  const id = key === null ? null : `${key}#${nonce}`;

  useEffect(() => {
    if (id === null) return;
    let cancelled = false;
    run().then(
      (data) => !cancelled && setResult({ id, data }),
      (error) => !cancelled && setResult({ id, error: error instanceof Error ? error : new Error(String(error)) })
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  const settled = id !== null && result?.id === id;
  return {
    data: settled ? result.data : undefined,
    error: settled ? result.error : undefined,
    loading: id !== null && !settled,
    reload: () => setNonce((n) => n + 1),
  };
}
