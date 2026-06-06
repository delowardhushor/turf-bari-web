"use client";

import { useLanguage, type Locale } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LOCALES: { value: Locale; label: string; shortLabel: string }[] = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "bn", label: "বাংলা", shortLabel: "বাং" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const next = locale === "en" ? "bn" : "en";
  const nextItem = LOCALES.find((l) => l.value === next)!;
  const currentItem = LOCALES.find((l) => l.value === locale)!;

  return (
    <button
      onClick={() => setLocale(next)}
      aria-label={`Switch to ${nextItem.label}`}
      title={`Switch to ${nextItem.label}`}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-colors",
        "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700",
        "text-zinc-700 dark:text-zinc-200",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      )}
    >
      <Globe className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
      <motion.span
        key={locale}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.15 }}
        className={locale === "bn" ? "font-bangla" : ""}
      >
        {currentItem.shortLabel}
      </motion.span>
    </button>
  );
}
