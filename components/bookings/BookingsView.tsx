"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarX } from "lucide-react";
import BookingCard from "./BookingCard";
import Container, { PageHeading } from "@/components/ui/Container";
import Button, { buttonStyles } from "@/components/ui/Button";
import { Alert, EmptyState, Skeleton } from "@/components/ui/Feedback";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAsync } from "@/hooks/useAsync";
import { useNow } from "@/hooks/useNow";
import { cn } from "@/lib/utils";
import { bookingService } from "@/services/bookings";
import { bookingStart, isBookingOver } from "@/utils/format";

type Tab = "upcoming" | "past" | "cancelled";
const TABS: Tab[] = ["upcoming", "past", "cancelled"];

export default function BookingsView() {
  const { t } = useLanguage();
  const now = useNow();
  const [tab, setTab] = useState<Tab>("upcoming");
  const { data, error, loading, reload } = useAsync(() => bookingService.list(), "my-bookings");

  const groups = useMemo(() => {
    const all = data ?? [];
    const live = all.filter((b) => b.status !== "cancelled");
    const byStart = (a: (typeof all)[number], b: (typeof all)[number]) =>
      bookingStart(a).localeCompare(bookingStart(b));
    return {
      // Next game first
      upcoming: live.filter((b) => !isBookingOver(b, now)).sort(byStart),
      // Most recent first
      past: live.filter((b) => isBookingOver(b, now)).sort((a, b) => byStart(b, a)),
      cancelled: all.filter((b) => b.status === "cancelled").sort((a, b) => byStart(b, a)),
    } satisfies Record<Tab, typeof all>;
  }, [data, now]);

  const list = groups[tab];

  return (
    <Container width="4xl" className="py-10">
      <PageHeading
        title={t("booking.myTitle")}
        subtitle={t("booking.mySubtitle")}
        action={
          <Link href="/turfs" className={buttonStyles({ size: "sm" })}>
            {t("nav.bookNow")}
          </Link>
        }
      />

      <div role="tablist" className="mt-8 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
              tab === k
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {t(`booking.tab.${k}`)}
            {data && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {groups[k].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {error ? (
          <Alert tone="error">
            <p>{error.message}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={reload}>
              {t("common.retry")}
            </Button>
          </Alert>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={t(`booking.empty.${tab}`)}
            description={tab === "upcoming" ? t("booking.emptyUpcomingDesc") : undefined}
            action={
              tab === "upcoming" && (
                <Link href="/turfs" className={buttonStyles()}>
                  {t("nav.findTurfs")}
                </Link>
              )
            }
          />
        ) : (
          <ul className="space-y-3">
            {list.map((b) => (
              <li key={b._id}>
                <BookingCard booking={b} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
