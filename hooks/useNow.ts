"use client";

import { useEffect, useState } from "react";

/** Current time in ms, refreshed on an interval so "already started" slots drop off a long-open page. */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
