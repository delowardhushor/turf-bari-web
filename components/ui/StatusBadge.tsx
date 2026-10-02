"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BookingStatus, PaymentStatus } from "@/types";

const BASE = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

const STATUS_TONE: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  cancelled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const PAYMENT_TONE: Record<PaymentStatus, string> = {
  pending: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useLanguage();
  return <span className={cn(BASE, STATUS_TONE[status])}>{t(`booking.status.${status}`)}</span>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useLanguage();
  return <span className={cn(BASE, PAYMENT_TONE[status])}>{t(`booking.payment.${status}`)}</span>;
}
