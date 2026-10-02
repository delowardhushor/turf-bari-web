"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { formatMoney, formatRange } from "@/utils/format";
import { PRICING_DAYS, type Ground } from "@/types";

/** The owner's price grid: one row per time band, one column per weekday. */
export default function PricingTable({ ground }: { ground: Ground }) {
  const { t } = useLanguage();
  const { basePrice, timeBands = [] } = ground.pricingConfig;

  if (timeBands.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {t("ground.flatRate", { price: formatMoney(basePrice), minutes: ground.slotDuration })}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("ground.timeBand")}
            </th>
            {PRICING_DAYS.map((d) => (
              <th key={d} scope="col" className="px-3 py-3 text-right font-semibold">
                {t(`days.${d}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {timeBands.map((band) => (
            <tr key={`${band.name}-${band.startTime}`}>
              <th scope="row" className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                {band.name}
                <span className="block text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  {formatRange(band.startTime, band.endTime)}
                </span>
              </th>
              {PRICING_DAYS.map((d) => {
                const price = band.prices?.[d];
                return (
                  <td
                    key={d}
                    className={
                      price === undefined
                        ? "px-3 py-3 text-right text-zinc-400 dark:text-zinc-500"
                        : "px-3 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100"
                    }
                  >
                    {formatMoney(price ?? basePrice)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
