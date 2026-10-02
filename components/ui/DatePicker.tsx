"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Popover from "./Popover";
import { controlClass, stateClass } from "./fieldStyles";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { addDays, formatDate, parseDateStr, todayStr, toDateStr } from "@/utils/format";

type Props = {
  id?: string;
  /** YYYY-MM-DD, or "" for no date yet. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest and latest pickable date, YYYY-MM-DD. */
  min?: string;
  max?: string;
  placeholder?: string;
  variant?: "field" | "bare";
  error?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
};

/** Shifts a date by whole months, keeping the day of month where the target month has it. */
const addMonths = (s: string, n: number) => {
  const d = parseDateStr(s);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return toDateStr(d);
};

const monthKey = (s: string) => s.slice(0, 7);

/** A calendar popover replacing the browser's native date input. */
export default function DatePicker({
  id,
  value,
  onChange,
  min,
  max,
  placeholder,
  variant = "field",
  error,
  disabled,
  className,
  ...aria
}: Props) {
  const { t, locale } = useLanguage();
  const today = todayStr();
  const [open, setOpen] = useState(false);
  // The day the calendar is showing / the keyboard is on; its month is the visible month
  const [cursor, setCursor] = useState(value || today);
  const gridRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Only pull focus into the grid for keyboard moves, not when clicking the month arrows
  const keyNav = useRef(false);

  const close = useCallback(() => setOpen(false), []);
  const inRange = useCallback((s: string) => (!min || s >= min) && (!max || s <= max), [min, max]);

  const openCalendar = () => {
    const start = value || today;
    setCursor(inRange(start) ? start : (min ?? start));
    keyNav.current = true;
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !keyNav.current) return;
    keyNav.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${cursor}"]`)?.focus();
  }, [open, cursor]);

  const weekdays = useMemo(
    // 2023-01-01 was a Sunday
    () => Array.from({ length: 7 }, (_, i) => formatDate(addDays("2023-01-01", i), locale, { weekday: "short" })),
    [locale]
  );

  const { first, count } = useMemo(() => {
    const d = parseDateStr(cursor);
    return {
      first: new Date(d.getFullYear(), d.getMonth(), 1).getDay(),
      count: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
    };
  }, [cursor]);

  const prefix = monthKey(cursor);
  const cells = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: count }, (_, i) => `${prefix}-${String(i + 1).padStart(2, "0")}`),
  ];

  const canGo = (delta: number) => {
    const target = addMonths(cursor, delta);
    return (!min || monthKey(target) >= monthKey(min)) && (!max || monthKey(target) <= monthKey(max));
  };
  const go = (delta: number) => {
    const target = addMonths(cursor, delta);
    // Land on a pickable day when the month is partly out of range
    setCursor(min && target < min ? min : max && target > max ? max : target);
  };

  const pick = (s: string) => {
    if (!inRange(s)) return;
    onChange(s);
    close();
    triggerRef.current?.focus();
  };

  const onGridKey = (e: KeyboardEvent) => {
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(cursor, -1),
      ArrowRight: () => addDays(cursor, 1),
      ArrowUp: () => addDays(cursor, -7),
      ArrowDown: () => addDays(cursor, 7),
      PageUp: () => addMonths(cursor, -1),
      PageDown: () => addMonths(cursor, 1),
      Home: () => `${prefix}-01`,
      End: () => `${prefix}-${String(count).padStart(2, "0")}`,
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    const next = move();
    if (!inRange(next)) return;
    keyNav.current = true;
    setCursor(next);
  };

  const bare = variant === "bare";
  const label = value ? formatDate(value, locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <Popover
      open={open}
      onClose={close}
      className={className}
      panelClassName="w-72 max-w-[calc(100vw-2rem)] p-3"
      trigger={
        <button
          ref={triggerRef}
          id={id}
          type="button"
          data-popover-trigger
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={aria["aria-label"]}
          aria-describedby={aria["aria-describedby"]}
          onClick={() => (open ? close() : openCalendar())}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-2 text-left",
            bare
              ? "rounded-md text-sm font-semibold text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:text-zinc-100"
              : cn(controlClass, stateClass(error), open && "border-emerald-500 ring-1 ring-emerald-500")
          )}
        >
          <span className={cn("truncate", !label && "text-zinc-400 dark:text-zinc-500")}>{label || placeholder || ""}</span>
          <CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-zinc-400" />
        </button>
      }
    >
      <div role="dialog" aria-label={aria["aria-label"] ?? t("common.selectDate")}>
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={!canGo(-1)}
            aria-label={t("common.prevMonth")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p aria-live="polite" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {formatDate(cursor, locale, { month: "long", year: "numeric" })}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={!canGo(1)}
            aria-label={t("common.nextMonth")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-zinc-400 dark:text-zinc-500">
          {weekdays.map((w, i) => (
            <span key={i} className="py-1">
              {w}
            </span>
          ))}
        </div>

        <div ref={gridRef} role="grid" onKeyDown={onGridKey} className="grid grid-cols-7 gap-y-0.5">
          {cells.map((s, i) => {
            if (!s) return <span key={`pad-${i}`} />;
            const disabledDay = !inRange(s);
            const isSelected = s === value;
            const isToday = s === today;
            return (
              <button
                key={s}
                type="button"
                data-date={s}
                role="gridcell"
                tabIndex={s === cursor ? 0 : -1}
                disabled={disabledDay}
                aria-selected={isSelected}
                aria-current={isToday ? "date" : undefined}
                aria-label={formatDate(s, locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                onClick={() => pick(s)}
                className={cn(
                  "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                  isSelected
                    ? "bg-emerald-500 font-semibold text-white shadow-sm"
                    : disabledDay
                      ? "cursor-not-allowed text-zinc-300 dark:text-zinc-700"
                      : "text-zinc-700 hover:bg-emerald-50 dark:text-zinc-200 dark:hover:bg-emerald-950/40",
                  isToday && !isSelected && "font-bold text-emerald-600 ring-1 ring-emerald-500/50 dark:text-emerald-400"
                )}
              >
                {Number(s.slice(8))}
              </button>
            );
          })}
        </div>

        {inRange(today) && (
          <button
            type="button"
            onClick={() => pick(today)}
            className="mt-2 w-full rounded-lg py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
          >
            {t("search.today")}
          </button>
        )}
      </div>
    </Popover>
  );
}
