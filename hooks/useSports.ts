"use client";

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { groundService } from "@/services/grounds";
import { sportService } from "@/services/sports";
import { capitalize } from "@/utils/format";
import type { Sport } from "@/types";
import { useAsync } from "./useAsync";

/** Readable name for a sport key we have no record for, e.g. "table-tennis" -> "Table Tennis". */
const fallbackLabel = (key: string) => key.split("-").map(capitalize).join(" ");

/** The sports the platform supports, in the admin's order. Empty until loaded. */
export function useSports(): Sport[] {
  const { data } = useAsync(() => sportService.list(), "sports");
  return data ?? [];
}

/** Display name for a sport key in the current language; unknown keys are just prettified. */
export function useSportLabel() {
  const { locale } = useLanguage();
  const sports = useSports();
  return (key: string) => {
    const sport = sports.find((s) => s.key === key);
    return (locale === "bn" && sport?.name.bn) || sport?.name.en || fallbackLabel(key);
  };
}

/** The icon (emoji or image URL) for a sport key, if the admin set one. */
export function useSportIcon() {
  const sports = useSports();
  return (key: string) => sports.find((s) => s.key === key)?.icon;
}

/** All public grounds that are open for booking, fetched once per mounting component. */
export function useActiveGrounds() {
  const { data, error, loading, reload } = useAsync(() => groundService.list(), "grounds");
  const grounds = useMemo(() => (data ?? []).filter((g) => g.status === "active"), [data]);
  return { grounds, error, loading, reload };
}
