"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import TurfCard, { TurfCardSkeleton } from "./TurfCard";
import Container, { PageHeading } from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { DateField, Select } from "@/components/ui/Field";
import { SportIcon } from "@/components/ui/SportIcon";
import { Alert, EmptyState } from "@/components/ui/Feedback";
import { HOUR_OPTIONS } from "@/constants/time";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAsync } from "@/hooks/useAsync";
import { useNow } from "@/hooks/useNow";
import { useSportLabel, useSports } from "@/hooks/useSports";
import { cn } from "@/lib/utils";
import { groundService } from "@/services/grounds";
import { addDays, formatTime, isDateStr, isSlotPast, todayStr } from "@/utils/format";

type Filters = { date: string; sport: string; from: string; to: string };

export default function TurfSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sports = useSports();
  const sportLabel = useSportLabel();
  const now = useNow();

  const today = todayStr();
  const tomorrow = addDays(today, 1);

  const rawDate = params.get("date");
  const filters: Filters = {
    // Past dates make no sense for booking, so they fall back to today
    date: isDateStr(rawDate) && rawDate >= today ? rawDate : today,
    sport: params.get("sport") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
  };
  const { date, sport, from, to } = filters;

  const invalidRange = !!from && !!to && from >= to;
  const key = invalidRange ? null : `${date}|${sport}|${from}|${to}`;

  const { data, error, loading, reload } = useAsync(
    () =>
      groundService.search({
        date,
        sport: sport || undefined,
        startTime: from || undefined,
        endTime: to || undefined,
      }),
    key
  );

  // The API doesn't know the current time, so drop slots that have already started
  const results = useMemo(
    () =>
      (data ?? [])
        .map((r) => ({ ...r, availableSlots: r.availableSlots.filter((s) => !isSlotPast(date, s.startTime, now)) }))
        .filter((r) => r.availableSlots.length > 0),
    [data, date, now]
  );

  const sportOptions = [
    { value: "", label: t("search.anySport") },
    ...sports.map((s) => ({
      value: s.key,
      label: sportLabel(s.key),
      icon: <SportIcon icon={s.icon} className="text-base" />,
    })),
  ];
  const fromOptions = [
    { value: "", label: t("search.anyTime") },
    ...HOUR_OPTIONS.map((h) => ({ value: h, label: formatTime(h) })),
  ];
  const toOptions = [
    { value: "", label: t("search.anyTime") },
    ...[...HOUR_OPTIONS.slice(1), "23:59"].map((h) => ({ value: h, label: formatTime(h) })),
  ];

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };

  return (
    <Container className="py-10">
      <PageHeading title={t("search.title")} subtitle={t("search.subtitle")} />

      <section
        aria-label={t("search.filters")}
        className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <DateField
              label={t("search.date")}
              min={today}
              value={date}
              onChange={(v) => v && update({ date: v })}
            />
            <div className="mt-2 flex gap-2">
              {[
                { label: t("search.today"), value: today },
                { label: t("search.tomorrow"), value: tomorrow },
              ].map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => update({ date: chip.value })}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    date === chip.value
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <Select label={t("search.sport")} value={sport} onChange={(v) => update({ sport: v })} options={sportOptions} />
          <Select label={t("search.from")} value={from} onChange={(v) => update({ from: v })} options={fromOptions} />
          <Select label={t("search.to")} value={to} onChange={(v) => update({ to: v })} options={toOptions} />
        </div>
      </section>

      <div className="mt-8" aria-live="polite">
        {invalidRange ? (
          <Alert tone="error">{t("search.invalidRange")}</Alert>
        ) : error ? (
          <Alert tone="error">
            <p>{error.message}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={reload}>
              {t("common.retry")}
            </Button>
          </Alert>
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <TurfCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={t("search.noResultsTitle")}
            description={t("search.noResultsDesc")}
            action={
              (sport || from || to) && (
                <Button variant="secondary" onClick={() => update({ sport: "", from: "", to: "" })}>
                  {t("search.clearFilters")}
                </Button>
              )
            }
          />
        ) : (
          <>
            <p className="mb-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {t(results.length === 1 ? "search.resultsOne" : "search.resultsMany", { count: results.length })}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <TurfCard
                  key={r.ground._id}
                  ground={r.ground}
                  slots={r.availableSlots}
                  date={date}
                  sport={sport || undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
