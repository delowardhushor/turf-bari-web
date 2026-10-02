"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, ShieldCheck, Zap, Flame, ArrowRight } from "lucide-react";
import TurfCard, { TurfCardSkeleton } from "@/components/turf/TurfCard";
import { HOUR_OPTIONS } from "@/constants/time";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActiveGrounds, useSportLabel, useSports } from "@/hooks/useSports";
import { iconText } from "@/components/ui/SportIcon";
import { formatTime, todayStr } from "@/utils/format";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const sports = useSports();
  const sportLabel = useSportLabel();
  const { grounds, loading: groundsLoading } = useActiveGrounds();
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");

  // Hand the choices to the search screen, which defaults the date to today
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (sport) q.set("sport", sport);
    if (date) q.set("date", date);
    if (from) q.set("from", from);
    router.push(`/turfs${q.size ? `?${q}` : ""}`);
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950">

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.50),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.zinc.900),theme(colors.zinc.950))] opacity-70" />
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center lg:max-w-4xl lg:mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Flame className="h-3.5 w-3.5 fill-current animate-pulse" />
              <span>{t("hero.badge")}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
              {t("hero.heading1")}{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 bg-clip-text text-transparent">
                {t("hero.heading2")}
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {t("hero.subheading")}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 w-full max-w-3xl rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <form onSubmit={onSearch} className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-2 items-center">
                <div className="flex flex-col px-2 py-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{t("hero.sport")}</span>
                  <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100">
                    <option value="">{t("search.anySport")}</option>
                    {sports.map((s) => (
                      <option key={s.key} value={s.key}>{[iconText(s.icon), sportLabel(s.key)].filter(Boolean).join(" ")}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col px-2 py-1 md:border-l md:border-zinc-200 dark:md:border-zinc-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{t("hero.date")}</span>
                  <input type="date" min={todayStr()} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none dark:text-zinc-100" />
                </div>
                <div className="flex flex-col px-2 py-1 md:border-l md:border-zinc-200 dark:md:border-zinc-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{t("hero.time")}</span>
                  <select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100">
                    <option value="">{t("search.anyTime")}</option>
                    {HOUR_OPTIONS.map((h) => (
                      <option key={h} value={h}>{formatTime(h)}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 font-semibold text-white shadow-md hover:bg-emerald-600 transition-all active:scale-[0.98]">
                  <Search className="h-4 w-4 shrink-0" />
                  {t("hero.search")}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">{t("features.heading")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">{t("features.subheading")}</p>
          </div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {([["instant", Clock], ["verified", MapPin], ["secure", ShieldCheck], ["rewards", Zap]] as [string, React.ElementType][]).map(([key, Icon]) => (
              <motion.div key={key} variants={itemVariants}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-zinc-200/50 bg-white shadow-sm hover:shadow-md hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t(`features.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{t(`features.${key}.desc`)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Turfs: real grounds from the API; hidden when there are none */}
      {(groundsLoading || grounds.length > 0) && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t("turfs.heading")}</h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("turfs.subheading")}</p>
              </div>
              <Link href="/turfs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {t("turfs.viewAll")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {groundsLoading
                ? Array.from({ length: 3 }, (_, i) => <TurfCardSkeleton key={i} />)
                : grounds.slice(0, 3).map((ground) => <TurfCard key={ground._id} ground={ground} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-12 shadow-xl sm:px-12 sm:py-20">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(30rem_30rem_at_right,theme(colors.teal.500),transparent)] opacity-40" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t("cta.heading")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">{t("cta.subheading")}</p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/turfs" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-md hover:bg-emerald-50 hover:scale-[1.02] transition-all">{t("cta.findTurf")}</Link>
                <Link href="/contact" className="rounded-xl border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all">{t("cta.registerOwner")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
