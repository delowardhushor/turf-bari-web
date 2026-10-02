"use client";

import Link from "next/link";
import { CalendarCheck, Layers, Search } from "lucide-react";
import Container, { PageHeading } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

const STEPS = [
  { key: "search", icon: Search },
  { key: "pick", icon: Layers },
  { key: "book", icon: CalendarCheck },
] as const;

export default function AboutView() {
  const { t } = useLanguage();
  return (
    <Container width="4xl" className="py-10">
      <PageHeading title={t("about.title")} subtitle={t("about.subtitle")} />
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("about.body")}</p>

      <h2 className="mt-12 text-xl font-bold text-zinc-900 dark:text-zinc-50">{t("about.howTitle")}</h2>
      <ol className="mt-5 grid gap-4 sm:grid-cols-3">
        {STEPS.map(({ key, icon: Icon }, i) => (
          <li key={key} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-xs font-bold text-zinc-400">0{i + 1}</span>
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">{t(`about.steps.${key}.title`)}</h3>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{t(`about.steps.${key}.desc`)}</p>
          </li>
        ))}
      </ol>

      <Link href="/turfs" className={buttonStyles({ size: "lg", className: "mt-10" })}>
        {t("nav.findTurfs")}
      </Link>
    </Container>
  );
}
