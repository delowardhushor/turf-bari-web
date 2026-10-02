"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import enDictionary from "../dictionaries/en.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Locale = "en" | "bn";

type Dictionary = typeof import("../dictionaries/en.json");

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Look up a key; `{name}` placeholders in the text are filled from `vars`. */
  t: (key: string, vars?: Record<string, string | number>) => string;
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
  // English is bundled so the first paint shows real text instead of raw keys
  const [dict, setDict] = useState<Dictionary | null>(enDictionary as Dictionary);

  // Load dictionary whenever locale changes
  useEffect(() => {
    DICTIONARIES[locale]().then(setDict);
  }, [locale]);

  // Keep <html lang> in sync, including after the saved locale is restored,
  // so the Bangla font rule in globals.css applies
  useEffect(() => {
    document.documentElement.lang = locale;
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
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      if (!dict) return key;
      const text = resolve(dict as unknown as Record<string, unknown>, key) ?? key;
      if (!vars || typeof text !== "string") return text;
      return text.replace(/\{(\w+)\}/g, (match, name) =>
        name in vars ? String(vars[name]) : match
      );
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
