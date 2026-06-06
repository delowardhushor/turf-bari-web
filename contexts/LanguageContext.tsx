"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Locale = "en" | "bn";

type Dictionary = typeof import("../dictionaries/en.json");

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dict: Dictionary | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  dict: null,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DICTIONARIES: Record<Locale, () => Promise<Dictionary>> = {
  en: () =>
    import("../dictionaries/en.json").then((m) => m.default as Dictionary),
  bn: () =>
    import("../dictionaries/bn.json").then((m) => m.default as Dictionary),
};

const STORAGE_KEY = "turfbari_locale";

/** Resolve a dot-separated key like "hero.heading1" into a nested value. */
function resolve(obj: Record<string, unknown>, key: string): string {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part];
    }
    return key; // fallback to key itself
  }, obj) as string;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [dict, setDict] = useState<Dictionary | null>(null);

  // Load dictionary whenever locale changes
  useEffect(() => {
    DICTIONARIES[locale]().then(setDict);
  }, [locale]);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (stored === "en" || stored === "bn")) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    // Update the <html lang="..."> attribute for accessibility + Bangla font
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: string): string => {
      if (!dict) return key;
      return resolve(dict as unknown as Record<string, unknown>, key) ?? key;
    },
    [dict]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLanguage() {
  return useContext(LanguageContext);
}
