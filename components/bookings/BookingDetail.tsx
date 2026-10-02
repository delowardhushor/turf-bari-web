"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarX, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Button, { buttonStyles } from "@/components/ui/Button";
import { Alert, EmptyState, Skeleton } from "@/components/ui/Feedback";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAsync } from "@/hooks/useAsync";
import { useSportLabel } from "@/hooks/useSports";
import { ApiError } from "@/services/api";
import { bookingService } from "@/services/bookings";
import { formatDate, formatDateLong, formatMoney, formatRange } from "@/utils/format";
import type { ReactNode } from "react";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">{children}</dd>
    </div>
  );
}

export default function BookingDetail({ id }: { id: string }) {
  const { t, locale } = useLanguage();
  const sportLabel = useSportLabel();
  const justBooked = useSearchParams().get("new") === "1";
  const { data: booking, error, loading, reload } = useAsync(() => bookingService.get(id), id);

  if (loading) {
    return (
      <Container width="2xl" className="py-10">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-6 h-10 w-2/3" />
        <Skeleton className="mt-6 h-80 rounded-2xl" />
      </Container>
    );
  }

  if (error || !booking) {
    // The API answers 403 for someone else's booking and a CastError (400) for a malformed id
    const missing = error instanceof ApiError && [400, 403, 404].includes(error.status);
    return (
      <Container width="2xl" className="py-16">
        {missing ? (
          <EmptyState
            icon={CalendarX}
            title={t("booking.notFound")}
            description={t("booking.notFoundDesc")}
            action={
              <Link href="/bookings" className={buttonStyles()}>
                {t("booking.viewAll")}
              </Link>
            }
          />
        ) : (
          <Alert tone="error">
            <p>{error?.message ?? t("common.errorGeneric")}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={reload}>
              {t("common.retry")}
            </Button>
          </Alert>
        )}
      </Container>
    );
  }

  const { groundId: ground, slotId: slot, companyId: company } = booking;
  const cancelled = booking.status === "cancelled";
  const advance = booking.advancePaid;

  return (
    <Container width="2xl" className="py-8 sm:py-10">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("booking.viewAll")}
      </Link>

      {justBooked && !cancelled && (
        <Alert tone="success" className="mt-5">
          <p className="font-semibold">{t("booking.successTitle")}</p>
          <p className="mt-0.5">{t("booking.successDesc")}</p>
        </Alert>
      )}
      {cancelled && (
        <Alert tone="info" className="mt-5">
          {t("booking.cancelledNote")}
        </Alert>
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {ground?.name ?? t("booking.groundRemoved")}
          </h1>
          {company && (
            <p className="mt-2 flex items-start gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                {company.name} · {company.address}
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <BookingStatusBadge status={booking.status} />
          {!cancelled && <PaymentStatusBadge status={booking.paymentStatus} />}
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white px-6 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <Row label={t("booking.date")}>{formatDateLong(booking.bookingDate, locale)}</Row>
          {slot && <Row label={t("booking.time")}>{formatRange(slot.startTime, slot.endTime)}</Row>}
          <Row label={t("booking.sport")}>{sportLabel(booking.sport)}</Row>
          <Row label={t("booking.total")}>
            <span className="text-base font-bold">{formatMoney(booking.totalPrice)}</span>
          </Row>
          {advance > 0 && <Row label={t("booking.advance")}>{formatMoney(advance)}</Row>}
          <Row label={t("booking.paymentStatus")}>
            <PaymentStatusBadge status={booking.paymentStatus} />
          </Row>
          {booking.createdAt && (
            <Row label={t("booking.bookedOn")}>{formatDate(booking.createdAt.slice(0, 10), locale)}</Row>
          )}
          <Row label={t("booking.reference")}>
            <span className="font-mono text-xs uppercase">{booking._id.slice(-8)}</span>
          </Row>
        </dl>
      </section>

      {!cancelled && booking.status === "pending" && advance > 0 && booking.paymentStatus === "pending" && (
        <Alert tone="info" className="mt-5">
          {t("booking.advanceInfo", { amount: formatMoney(advance) })}
        </Alert>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {t("booking.changeInfo")}{" "}
          <Link href="/contact" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
            {t("nav.contactUs")}
          </Link>
        </p>
        {ground && (
          <Link href={`/turfs/${ground._id}`} className={buttonStyles({ variant: "secondary" })}>
            {t("booking.bookAgain")}
          </Link>
        )}
      </div>
    </Container>
  );
}
