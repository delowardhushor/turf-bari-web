"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Container, { PageHeading } from "@/components/ui/Container";
import { useLanguage } from "@/contexts/LanguageContext";

const QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function FaqView() {
  const { t } = useLanguage();
  return (
    <Container width="2xl" className="py-10">
      <PageHeading title={t("faq.title")} subtitle={t("faq.subtitle")} />
      <div className="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {QUESTIONS.map((q) => (
          <details key={q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50 [&::-webkit-details-marker]:hidden">
              {t(`faq.items.${q}.q`)}
              <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t(`faq.items.${q}.a`)}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        {t("faq.stillStuck")}{" "}
        <Link href="/contact" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
          {t("nav.contactUs")}
        </Link>
      </p>
    </Container>
  );
}
