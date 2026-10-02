"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  /** The element that toggles the panel; mark it with `data-popover-trigger` so Escape can return focus to it. */
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
};

/**
 * A floating panel under its trigger. Closes on outside click and Escape, and flips
 * upward or to the right edge when it would otherwise run off the screen.
 */
export default function Popover({ open, onClose, trigger, children, className, panelClassName }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState({ up: false, end: false });

  useLayoutEffect(() => {
    if (!open || !wrapRef.current || !panelRef.current) return;
    const wrap = wrapRef.current.getBoundingClientRect();
    const panel = panelRef.current.getBoundingClientRect();
    const below = window.innerHeight - wrap.bottom;
    setPlace({
      up: panel.height + 12 > below && wrap.top > below,
      end: wrap.left + panel.width > window.innerWidth - 8 && wrap.right - panel.width > 8,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
      wrapRef.current?.querySelector<HTMLElement>("[data-popover-trigger]")?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {trigger}
      {open && (
        <div
          ref={panelRef}
          className={cn(
            "absolute z-50 rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-300/40 ring-1 ring-black/5",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40 dark:ring-white/5",
            "animate-[popover-in_120ms_ease-out]",
            place.up ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top",
            place.end ? "right-0" : "left-0",
            panelClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
