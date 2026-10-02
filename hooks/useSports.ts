"use client";

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEFAULT_SPORTS } from "@/constants";
import { groundService } from "@/services/grounds";
import { capitalize } from "@/utils/format";
import { useAsync } from "./useAsync";

/** Display name for a sport: translated when we know it, otherwise just capitalised. */
export function useSportLabel() {
  const { t } = useLanguage();
  return (sport: string) => {
    const key = `sports.${sport}`;
    const label = t(key);
    return label === key ? capitalize(sport) : label;
  };
}

/** All public grounds that are open for booking, fetched once per mounting component. */
export function useActiveGrounds() {
  const { data, error, loading, reload } = useAsync(() => groundService.list(), "grounds");
  const grounds = useMemo(() => (data ?? []).filter((g) => g.status === "active"), [data]);
  return { grounds, error, loading, reload };
}

/** Sports offered by at least one active ground; falls back to the common ones until known. */
export function useSports() {
  const { grounds } = useActiveGrounds();
  return useMemo(() => {
    const found = new Set(grounds.flatMap((g) => g.sports));
    return found.size > 0 ? [...found].sort() : DEFAULT_SPORTS;
  }, [grounds]);
}
