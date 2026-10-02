"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export const controlClass =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm transition-all " +
  "placeholder:text-zinc-400 focus:outline-none focus:ring-1 " +
  "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const stateClass = (error?: string) =>
  error
    ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500/70"
    : "border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800 dark:focus:border-emerald-500";

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FieldShell({ id, label, error, hint, children, className }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className, type, ...rest }: InputProps) {
  const id = useId();
  const { t } = useLanguage();
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <div className="relative">
        <input
          id={id}
          type={isPassword && shown ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(controlClass, stateClass(error), isPassword && "pr-11")}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? t("common.hidePassword") : t("common.showPassword")}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </FieldShell>
  );
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Select({ label, error, hint, className, children, ...rest }: SelectProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, stateClass(error))}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}
