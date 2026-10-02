"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarX } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Alert, Skeleton } from "@/components/ui/Feedback";
import { BOOKING_HORIZON_DAYS } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAsync } from "@/hooks/useAsync";
import { useNow } from "@/hooks/useNow";
import { useSportLabel } from "@/hooks/useSports";
import { cn } from "@/lib/utils";
import { ApiError } from "@/services/api";
import { bookingService } from "@/services/bookings";
import { groundService } from "@/services/grounds";
import {
  addDays,
  advanceAmount,
  formatDate,
  formatDateLong,
  formatMoney,
  formatRange,
  formatTime,
  isSlotPast,
  parseDateStr,
  todayStr,
} from "@/utils/format";
import type { Ground, Slot } from "@/types";

type Selection = { date: string; sport: string; slot: string };

type Props = {
  ground: Ground;
  /** Current choice, kept in the URL by the parent so it survives a sign-in round trip. */
  selection: Selection;
  onSelect: (patch: Partial<Selection>) => void;
};

const DAY_STRIP = 14;

type Part = "morning" | "afternoon" | "evening";
const partOf = (startTime: string): Part => {
  const hour = Number(startTime.slice(0, 2));
  return hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
};

export default function BookingPanel({ ground, selection, onSelect }: Props) {
  const { t, locale } = useLanguage();
  const sportLabel = useSportLabel();
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const now = useNow();

  const today = todayStr();
  const { date, sport, slot: slotId } = selection;
  const multiSport = ground.sports.length > 1;
  // One-sport grounds don't ask; the API would pick it anyway
  const activeSport = multiSport ? sport : ground.sports[0];

  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const slotsState = useAsync(() => groundService.slots(ground._id, date), `${ground._id}|${date}`);
  const slots = useMemo(
    () => [...(slotsState.data ?? [])].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [slotsState.data]
  );

  const isOpen = (s: Slot) => !s.isBooked && !s.isDisabled && !isSlotPast(date, s.startTime, now);
  const selected = slots.find((s) => s._id === slotId && isOpen(s));
  const selectionLost = !!slotId && !slotsState.loading && !!slotsState.data && !selected;

  const grouped = useMemo(() => {
    const parts: Record<Part, Slot[]> = { morning: [], afternoon: [], evening: [] };
    for (const s of slots) parts[partOf(s.startTime)].push(s);
    return parts;
  }, [slots]);

  const strip = Array.from({ length: DAY_STRIP }, (_, i) => addDays(today, i));
  const lastDay = addDays(today, BOOKING_HORIZON_DAYS);

  // Where to land after signing in or up: this page with the same choices
  const returnTo = `${pathname}?${new URLSearchParams(
    Object.entries({ date, sport: activeSport, slot: selected?._id ?? "" }).filter(([, v]) => v)
  ).toString()}`;

  const book = async () => {
    if (!selected) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(returnTo)}`);
      return;
    }
    setBookingError(null);
    setSubmitting(true);
    try {
      const booking = await bookingService.create(selected._id, activeSport || undefined);
      router.push(`/bookings/${booking._id}?new=1`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t("common.errorGeneric");
      // Someone else may have taken the slot while this page was open
      setBookingError(/already booked|disabled/i.test(message) ? t("ground.slotTaken") : message);
      onSelect({ slot: "" });
      slotsState.reload();
      setSubmitting(false);
    }
  };

  const advance = selected && ground.advancePayment ? advanceAmount(selected.price) : 0;
  const needsSport = multiSport && !activeSport;

  return (
    <section
      aria-label={t("ground.bookTitle")}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
    >
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t("ground.bookTitle")}</h2>

      {/* Date */}
      <div className="mt-5">
        <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t("ground.chooseDate")}</h3>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {strip.map((d) => {
            const active = d === date;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect({ date: d, slot: "" })}
                className={cn(
                  "flex w-14 shrink-0 flex-col items-center rounded-xl border py-2 text-center transition-colors",
                  active
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                )}
              >
                <span className="text-[11px] font-medium uppercase opacity-80">
                  {formatDate(d, locale, { weekday: "short" })}
                </span>
                <span className="text-lg font-bold leading-tight">{parseDateStr(d).getDate()}</span>
                <span className="text-[11px] opacity-80">{formatDate(d, locale, { month: "short" })}</span>
              </button>
            );
          })}
        </div>
        <Input
          label={t("ground.otherDate")}
          type="date"
          min={today}
          max={lastDay}
          value={date}
          onChange={(e) => e.target.value && onSelect({ date: e.target.value, slot: "" })}
          className="mt-2"
        />
      </div>

      {/* Sport */}
      {multiSport && (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t("ground.chooseSport")}</h3>
          <div role="radiogroup" aria-label={t("ground.chooseSport")} className="flex flex-wrap gap-2">
            {ground.sports.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={sport === s}
                onClick={() => onSelect({ sport: s })}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                  sport === s
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-200 text-zinc-700 hover:border-emerald-300 dark:border-zinc-700 dark:text-zinc-300"
                )}
              >
                {sportLabel(s)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Slots */}
      <div className="mt-5">
        <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t("ground.chooseSlot")}</h3>

        {slotsState.error ? (
          <Alert tone="error">
            <p>{slotsState.error.message}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={slotsState.reload}>
              {t("common.retry")}
            </Button>
          </Alert>
        ) : slotsState.loading ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center dark:border-zinc-700">
            <CalendarX className="h-6 w-6 text-zinc-400" aria-hidden />
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("ground.noSlots")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(["morning", "afternoon", "evening"] as Part[])
              .filter((p) => grouped[p].length > 0)
              .map((p) => (
                <div key={p}>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                    {t(`ground.${p}`)}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {grouped[p].map((s) => {
                      const open = isOpen(s);
                      const active = s._id === selected?._id;
                      return (
                        <button
                          key={s._id}
                          type="button"
                          disabled={!open}
                          aria-pressed={active}
                          onClick={() => onSelect({ slot: s._id })}
                          className={cn(
                            "rounded-xl border px-2 py-2 text-center transition-colors",
                            active
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                              : open
                                ? "border-zinc-200 bg-white text-zinc-800 hover:border-emerald-400 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-emerald-950/30"
                                : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-600"
                          )}
                        >
                          <span className={cn("block text-sm font-semibold", !open && "line-through")}>
                            {formatTime(s.startTime)}
                          </span>
                          <span className="block text-xs opacity-80">
                            {open ? formatMoney(s.price) : s.isBooked ? t("ground.booked") : t("ground.unavailable")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Summary + confirm */}
      <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
        {bookingError && (
          <Alert tone="error" className="mb-4">
            {bookingError}
          </Alert>
        )}
        {selectionLost && !bookingError && (
          <Alert tone="info" className="mb-4">
            {t("ground.slotGone")}
          </Alert>
        )}

        {selected ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">{t("booking.date")}</dt>
              <dd className="text-right font-medium text-zinc-900 dark:text-zinc-100">{formatDateLong(date, locale)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">{t("booking.time")}</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatRange(selected.startTime, selected.endTime)}
              </dd>
            </div>
            {activeSport && (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">{t("booking.sport")}</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{sportLabel(activeSport)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-zinc-100 pt-2 text-base dark:border-zinc-800">
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">{t("booking.total")}</dt>
              <dd className="font-bold text-zinc-900 dark:text-zinc-50">{formatMoney(selected.price)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("ground.pickSlot")}</p>
        )}

        {advance > 0 && (
          <Alert tone="info" className="mt-4">
            {t("ground.advanceNote", { amount: formatMoney(advance) })}
          </Alert>
        )}

        <Button
          size="lg"
          className="mt-5 w-full"
          disabled={!selected || needsSport || !ready}
          loading={submitting}
          onClick={book}
        >
          {submitting ? t("ground.booking") : user || !ready ? t("ground.confirm") : t("ground.signInToBook")}
        </Button>
        {selected && needsSport && (
          <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">{t("ground.pickSport")}</p>
        )}
        {!user && ready && (
          <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {t("ground.needAccount")}{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(returnTo)}`}
              className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {t("auth.createAccount")}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
