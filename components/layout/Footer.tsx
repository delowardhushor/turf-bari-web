"use client";

import Link from "next/link";
import { Flame, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t, locale } = useLanguage();
  const currentYear = new Date().getFullYear();
  const bn = locale === "bn" ? "font-bangla" : "";

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/10">
                <Flame className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Turf<span className="text-emerald-500">Bari</span>
              </span>
            </Link>
            <p className={`text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs ${bn}`}>
              {t("footer.tagline")}
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors" aria-label="GitHub">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 ${bn}`}>
              {t("footer.explore")}
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { key: "footer.browseTurfs", href: "/turfs" },
                { key: "footer.myReservations", href: "/bookings" },
                { key: "footer.aboutUs", href: "/about" },
                { key: "footer.faqs", href: "/faq" },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className={`text-sm text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors ${bn}`}>
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 ${bn}`}>
              {t("footer.contactUs")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span className={bn}>{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>support@turfbari.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 ${bn}`}>
              {t("footer.stayUpdated")}
            </h3>
            <p className={`mt-4 text-sm text-zinc-500 dark:text-zinc-400 ${bn}`}>
              {t("footer.newsletterDesc")}
            </p>
            <form className="mt-4 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder={t("footer.emailPlaceholder")}
                className={`w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-500 ${bn}`}
              />
              <button type="submit"
                className={`flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${bn}`}>
                {t("footer.join")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-zinc-200 bg-zinc-100/50 dark:border-zinc-800/50 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 ${bn}`}>
            &copy; {currentYear} TurfBari. {t("footer.allRights")}
          </p>
          <div className="flex space-x-6 text-xs text-zinc-400 dark:text-zinc-500">
            <a href="#" className={`hover:text-emerald-500 transition-colors ${bn}`}>{t("footer.privacy")}</a>
            <a href="#" className={`hover:text-emerald-500 transition-colors ${bn}`}>{t("footer.terms")}</a>
            <a href="#" className={`hover:text-emerald-500 transition-colors ${bn}`}>{t("footer.refund")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
