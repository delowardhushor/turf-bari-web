"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, MapPin } from "lucide-react";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSportLabel } from "@/hooks/useSports";
import { formatDate, formatMoney, formatRange } from "@/utils/format";
import type { Booking } from "@/types";

export default function BookingCard({ booking }: { booking: Booking }) {
  const { t, locale } = useLanguage();
  const sportLabel = useSportLabel();
  const { groundId: ground, slotId: slot, companyId: company } = booking;
  const cancelled = booking.status === "cancelled";

  return (
    <Link
      href={`/bookings/${booking._id}`}
      className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 sm:p-5"
    >
      <div className="hidden h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 sm:flex">
        <span className="text-[11px] font-semibold uppercase">
          {formatDate(booking.bookingDate, locale, { month: "short" })}
        </span>
        <span className="text-xl font-bold leading-none">
          {formatDate(booking.bookingDate, locale, { day: "numeric" })}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={
              cancelled
                ? "truncate font-semibold text-zinc-500 line-through dark:text-zinc-500"
                : "truncate font-semibold text-zinc-900 dark:text-zinc-50"
            }
          >
            {ground?.name ?? t("booking.groundRemoved")}
          </h3>
          <BookingStatusBadge status={booking.status} />
          {!cancelled && <PaymentStatusBadge status={booking.paymentStatus} />}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {formatDate(booking.bookingDate, locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>
          {slot && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {formatRange(slot.startTime, slot.endTime)}
            </span>
          )}
          {company && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {company.name}
            </span>
          )}
          <span>{sportLabel(booking.sport)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{formatMoney(booking.totalPrice)}</span>
        <ChevronRight className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600" />
      </div>
    </Link>
  );
}
