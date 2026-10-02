"use client";

import { Input } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { isEmail, isPhone, normalizePhone } from "@/utils/format";
import type { Identifier } from "@/types";

export type IdentifierMode = "email" | "phone";

/** Turn what was typed into the payload the API expects, or null when it isn't valid. */
export function toIdentifier(mode: IdentifierMode, value: string): Identifier | null {
  const v = value.trim();
  if (mode === "email") return isEmail(v) ? { email: v } : null;
  return isPhone(v) ? { phoneNumber: normalizePhone(v) } : null;
}

/** Email / phone switch plus the matching input; shared by sign in, sign up and password reset. */
export default function IdentifierInput({
  mode,
  onModeChange,
  value,
  onChange,
  error,
  disabled,
}: {
  mode: IdentifierMode;
  onModeChange: (mode: IdentifierMode) => void;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const { t } = useLanguage();
  const modes: IdentifierMode[] = ["phone", "email"];

  return (
    <div className="space-y-3">
      <div
        role="tablist"
        aria-label={t("auth.signInWith")}
        className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800"
      >
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            disabled={disabled}
            onClick={() => onModeChange(m)}
            className={cn(
              "rounded-lg py-2 text-sm font-semibold transition-colors",
              mode === m
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {t(m === "email" ? "common.email" : "common.phone")}
          </button>
        ))}
      </div>
      <Input
        key={mode}
        label={t(mode === "email" ? "common.email" : "common.phone")}
        type={mode === "email" ? "email" : "tel"}
        inputMode={mode === "email" ? "email" : "tel"}
        autoComplete={mode === "email" ? "email" : "tel"}
        placeholder={mode === "email" ? "you@example.com" : "01XXXXXXXXX"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        disabled={disabled}
      />
    </div>
  );
}
