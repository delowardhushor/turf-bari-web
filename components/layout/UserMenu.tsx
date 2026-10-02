"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { initials } from "@/utils/format";

/** Avatar button with a small dropdown; shown in the header once a customer is signed in. */
export default function UserMenu() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  // Navigating somewhere closes the menu
  const visible = open && openedOn === pathname;

  const item =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpenedOn(pathname);
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={visible}
        className="flex h-10 items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:hover:bg-zinc-800"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-[8rem] truncate text-sm font-medium text-zinc-800 dark:text-zinc-100 lg:block">
          {user.name}
        </span>
        <ChevronDown className="h-4 w-4 text-zinc-400" aria-hidden />
      </button>

      {visible && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-100 px-3 pb-2 pt-1.5 dark:border-zinc-800">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email ?? user.phoneNumber}</p>
          </div>
          <div className="pt-1.5">
            <Link href="/bookings" role="menuitem" className={item}>
              <CalendarDays className="h-4 w-4" aria-hidden />
              {t("nav.myBookings")}
            </Link>
            <Link href="/account" role="menuitem" className={item}>
              <UserRound className="h-4 w-4" aria-hidden />
              {t("nav.account")}
            </Link>
            <button type="button" role="menuitem" onClick={() => signOut({ redirect: true })} className={item}>
              <LogOut className="h-4 w-4" aria-hidden />
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
