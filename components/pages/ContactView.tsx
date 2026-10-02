"use client";

import { Mail, MapPin, Phone, Store } from "lucide-react";
import Container, { PageHeading } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";
import { CONSOLE_URL } from "@/constants";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactView() {
  const { t } = useLanguage();
  const items = [
    { icon: Phone, label: t("common.phone"), value: "+880 1700 000000", href: "tel:+8801700000000" },
    { icon: Mail, label: t("common.email"), value: "support@turfbari.com", href: "mailto:support@turfbari.com" },
    { icon: MapPin, label: t("contact.address"), value: t("footer.address"), href: undefined },
  ];

  return (
    <Container width="4xl" className="py-10">
      <PageHeading title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">{label}</p>
            {href ? (
              <a href={href} className="mt-1 block text-sm font-semibold text-zinc-900 hover:text-emerald-600 dark:text-zinc-50 dark:hover:text-emerald-400">
                {value}
              </a>
            ) : (
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
            )}
          </div>
        ))}
      </div>

      <section className="mt-8 flex flex-col gap-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <Store className="mt-1 h-6 w-6 shrink-0" aria-hidden />
          <div>
            <h2 className="text-lg font-bold">{t("contact.ownersTitle")}</h2>
            <p className="mt-1 max-w-xl text-sm text-emerald-50">{t("contact.ownersDesc")}</p>
          </div>
        </div>
        <a href={CONSOLE_URL} className={buttonStyles({ variant: "secondary", className: "shrink-0 border-transparent" })}>
          {t("auth.openConsole")}
        </a>
      </section>
    </Container>
  );
}
