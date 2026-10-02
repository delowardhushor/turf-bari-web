"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import Popover from "./Popover";
import { controlClass, stateClass } from "./fieldStyles";
import { cn } from "@/lib/utils";

export type DropdownOption = { value: string; label: string; icon?: ReactNode };

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  /** Shown when `value` matches no option. */
  placeholder?: string;
  /** "field" is a bordered input look; "bare" is borderless, for compact search bars. */
  variant?: "field" | "bare";
  error?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
};

/** A styled replacement for the native <select>: keyboard friendly, themed, and able to show icons. */
export default function Dropdown({
  id,
  value,
  onChange,
  options,
  placeholder,
  variant = "field",
  error,
  disabled,
  className,
  ...aria
}: Props) {
  const autoId = useId();
  const listId = `${autoId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  const close = useCallback(() => setOpen(false), []);
  const openList = () => {
    setActive(Math.max(selectedIndex, 0));
    setOpen(true);
  };

  // Move focus into the list so arrow keys work, and keep the active option visible
  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${autoId}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, autoId]);

  const choose = (i: number) => {
    const option = options[i];
    if (!option) return;
    onChange(option.value);
    close();
    triggerRef.current?.focus();
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openList();
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(i + 1, last));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        return;
      case "Home":
        e.preventDefault();
        setActive(0);
        return;
      case "End":
        e.preventDefault();
        setActive(last);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        return;
      case "Tab":
        close();
        return;
    }
    // Typing jumps to the first option starting with what was typed
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      const t = typed.current;
      const nowMs = e.timeStamp;
      t.text = (nowMs - t.at > 600 ? "" : t.text) + e.key.toLowerCase();
      t.at = nowMs;
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
      if (hit >= 0) setActive(hit);
    }
  };

  const bare = variant === "bare";

  return (
    <Popover
      open={open}
      onClose={close}
      className={className}
      panelClassName="min-w-full w-max max-w-[min(22rem,calc(100vw-2rem))] p-1.5"
      trigger={
        <button
          ref={triggerRef}
          id={id}
          type="button"
          data-popover-trigger
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={aria["aria-label"]}
          aria-describedby={aria["aria-describedby"]}
          onClick={() => (open ? close() : openList())}
          onKeyDown={onTriggerKey}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-2 text-left",
            bare
              ? "rounded-md text-sm font-semibold text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:text-zinc-100"
              : cn(controlClass, stateClass(error), open && "border-emerald-500 ring-1 ring-emerald-500")
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {selected?.icon}
            <span className={cn("truncate", !selected && "text-zinc-400 dark:text-zinc-500")}>
              {selected?.label ?? placeholder ?? ""}
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className={cn("h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-150", open && "rotate-180")}
          />
        </button>
      }
    >
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-label={aria["aria-label"]}
        aria-activedescendant={`${autoId}-opt-${active}`}
        onKeyDown={onListKey}
        className="max-h-64 overflow-y-auto overscroll-contain focus:outline-none"
      >
        {options.map((o, i) => {
          const isSelected = o.value === value;
          return (
            <div
              key={o.value}
              id={`${autoId}-opt-${i}`}
              role="option"
              aria-selected={isSelected}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm",
                i === active && "bg-emerald-50 dark:bg-emerald-950/40",
                isSelected
                  ? "font-semibold text-emerald-700 dark:text-emerald-400"
                  : "text-zinc-700 dark:text-zinc-200"
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                {o.icon}
                <span className="truncate">{o.label}</span>
              </span>
              {isSelected && <Check aria-hidden className="h-4 w-4 shrink-0" />}
            </div>
          );
        })}
      </div>
    </Popover>
  );
}
