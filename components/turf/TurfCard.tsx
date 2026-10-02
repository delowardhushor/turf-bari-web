"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, Trophy } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSportLabel } from "@/hooks/useSports";
import { companyOf, formatMoney, formatTime, startingPrice } from "@/utils/format";
import type { Ground, Slot } from "@/types";

const MAX_CHIPS = 6;

/** Query string that carries a search over to the turf page so the choice isn't lost. */
function detailHref(ground: Ground, params: { date?: string; sport?: string; slot?: string }) {
  const q = new URLSearchParams();
  if (params.date) q.set("date", params.date);
  if (params.sport) q.set("sport", params.sport);
  if (params.slot) q.set("slot", params.slot);
  const qs = q.toString();
  return `/turfs/${ground._id}${qs ? `?${qs}` : ""}`;
}

type Props = {
  ground: Ground;
  /** Free slots for the searched date; when given the card shows them as quick-book chips. */
  slots?: Slot[];
  date?: string;
  sport?: string;
};

export default function TurfCard({ ground, slots, date, sport }: Props) {
  const { t } = useLanguage();
  const sportLabel = useSportLabel();
  const company = companyOf(ground);
  const sorted = slots ? [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime)) : [];
  const price = slots ? Math.min(...slots.map((s) => s.price)) : startingPrice(ground);
  // A ground with one sport needs no sport in the link; the booking page picks it
  const sportParam = sport ?? (ground.sports.length === 1 ? ground.sports[0] : undefined);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative flex h-32 items-end bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4">
        <Trophy className="absolute right-4 top-4 h-10 w-10 text-white/20" aria-hidden />
        <div className="flex flex-wrap gap-1.5">
          {ground.sports.map((s) => (
            <span key={s} className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-sm">
              {sportLabel(s)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{ground.name}</h3>
        {company && (
          <p className="mt-1 flex items-start gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>
              {company.name} · {company.address}
            </span>
          </p>
        )}

        {slots && (
          <div className="mt-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {t(slots.length === 1 ? "search.slotOpenOne" : "search.slotsOpen", { count: slots.length })}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sorted.slice(0, MAX_CHIPS).map((s) => (
                <Link
                  key={s._id}
                  href={detailHref(ground, { date, sport: sportParam, slot: s._id })}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
                >
                  {formatTime(s.startTime)}
                </Link>
              ))}
              {sorted.length > MAX_CHIPS && (
                <span className="px-1 py-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {t("search.moreSlots", { count: sorted.length - MAX_CHIPS })}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div className="mt-4">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{t("search.from")}</span>
            <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              {formatMoney(price)}{" "}
              <span className="text-xs font-normal text-zinc-400">
                {t("search.perSlot", { minutes: ground.slotDuration })}
              </span>
            </p>
          </div>
          <Link
            href={detailHref(ground, { date, sport: sportParam })}
            className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4" })}
          >
            {t("search.viewBook")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TurfCardSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="h-32 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
