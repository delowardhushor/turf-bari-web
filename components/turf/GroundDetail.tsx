"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Banknote, Clock, MapPin, Percent, Timer, Trophy } from "lucide-react";
import BookingPanel from "./BookingPanel";
import PricingTable from "./PricingTable";
import Container from "@/components/ui/Container";
import Button, { buttonStyles } from "@/components/ui/Button";
import { Alert, EmptyState, Skeleton } from "@/components/ui/Feedback";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAsync } from "@/hooks/useAsync";
import { useSportLabel } from "@/hooks/useSports";
import { ApiError } from "@/services/api";
import { groundService } from "@/services/grounds";
import { companyOf, formatDate, formatRange, isDateStr, todayStr } from "@/utils/format";
import type { Ground } from "@/types";

function Fact({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
      </div>
    </div>
  );
}

function GroundDetailSkeleton() {
  return (
    <Container className="py-10">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-6 h-9 w-1/2" />
      <Skeleton className="mt-3 h-4 w-1/3" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </Container>
  );
}

export default function GroundDetail({ id }: { id: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const { data: ground, error, loading, reload } = useAsync(() => groundService.get(id), id);

  const today = todayStr();
  const rawDate = params.get("date");
  const selection = {
    date: isDateStr(rawDate) && rawDate >= today ? rawDate : today,
    sport: params.get("sport") ?? "",
    slot: params.get("slot") ?? "",
  };

  const onSelect = (patch: Partial<typeof selection>) => {
    const next = { ...selection, ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };

  if (loading) return <GroundDetailSkeleton />;

  if (error || !ground) {
    const notFound = error instanceof ApiError && (error.status === 404 || error.status === 400);
    return (
      <Container className="py-16">
        {notFound ? (
          <EmptyState
            icon={MapPin}
            title={t("ground.notFound")}
            description={t("ground.notFoundDesc")}
            action={
              <Link href="/turfs" className={buttonStyles()}>
                {t("ground.backToSearch")}
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

  return <GroundContent ground={ground} selection={selection} onSelect={onSelect} />;
}

function GroundContent({
  ground,
  selection,
  onSelect,
}: {
  ground: Ground;
  selection: { date: string; sport: string; slot: string };
  onSelect: (patch: Partial<{ date: string; sport: string; slot: string }>) => void;
}) {
  const { t, locale } = useLanguage();
  const sportLabel = useSportLabel();
  const company = companyOf(ground);
  const today = todayStr();

  // Offers that are running or still to come; dates arrive as ISO strings
  const offers = (ground.campaigns ?? []).filter((c) => c.endDate.slice(0, 10) >= today);
  const active = ground.status === "active";

  return (
    <Container className="py-8 sm:py-10">
      <Link
        href="/turfs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("ground.backToSearch")}
      </Link>

      <header className="mt-5">
        <div className="flex flex-wrap gap-1.5">
          {ground.sports.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <Trophy className="h-3 w-3" aria-hidden />
              {sportLabel(s)}
            </span>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {ground.name}
        </h1>
        {company && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              {company.name} · {company.address}
            </span>
          </p>
        )}
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="min-w-0 space-y-8 lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            <Fact
              icon={Clock}
              label={t("ground.hours")}
              value={formatRange(ground.operatingHours.start, ground.operatingHours.end)}
            />
            <Fact
              icon={Timer}
              label={t("ground.slotLength")}
              value={t("common.minutes", { count: ground.slotDuration })}
            />
            <Fact
              icon={Banknote}
              label={t("ground.payment")}
              value={t(ground.advancePayment ? "ground.advanceRequired" : "ground.noAdvance")}
            />
          </div>

          {ground.description && (
            <section>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t("ground.about")}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {ground.description}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t("ground.pricing")}</h2>
            <p className="mb-3 mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("ground.pricingNote")}</p>
            <PricingTable ground={ground} />
          </section>

          {offers.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t("ground.offers")}</h2>
              <ul className="mt-3 space-y-2">
                {offers.map((c) => (
                  <li
                    key={`${c.name}-${c.startDate}`}
                    className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30"
                  >
                    <Percent className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-900 dark:text-amber-200">
                        {c.name} — {t("ground.percentOff", { percent: c.discountPercentage })}
                      </p>
                      <p className="mt-0.5 text-xs text-amber-800/80 dark:text-amber-300/80">
                        {formatDate(c.startDate.slice(0, 10), locale)} – {formatDate(c.endDate.slice(0, 10), locale)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          {active ? (
            <BookingPanel ground={ground} selection={selection} onSelect={onSelect} />
          ) : (
            <Alert tone="info">{t("ground.inactive")}</Alert>
          )}
        </aside>
      </div>
    </Container>
  );
}
