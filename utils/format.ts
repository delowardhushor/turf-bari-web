import type { Booking, Company, Ground, Ref } from "@/types";
import { PRICING_DAYS } from "@/types";

const money = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });
export const formatMoney = (n: number) => `৳${money.format(Math.round(n))}`;

const pad = (n: number) => String(n).padStart(2, "0");

// Dates and prices in this API are plain strings in the venue's local time,
// so everything here works on local calendar dates, never UTC.

/** Local calendar date as YYYY-MM-DD. */
export const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => toDateStr(new Date());
export const parseDateStr = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s: string, n: number) => {
  const d = parseDateStr(s);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
export const isDateStr = (s: string | null | undefined): s is string =>
  !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parseDateStr(s).getTime());

// Latin digits in both languages; only month and weekday names are localised
const intlLocale = (locale: string) => (locale === "bn" ? "bn-BD-u-nu-latn" : "en-GB");

export const formatDate = (
  s: string,
  locale: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }
) => parseDateStr(s).toLocaleDateString(intlLocale(locale), opts);

export const formatDateLong = (s: string, locale: string) =>
  formatDate(s, locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
export const formatRange = (a: string, b: string) => `${formatTime(a)} – ${formatTime(b)}`;

export const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** True when the slot has already started (only possible for today or earlier). */
export const isSlotPast = (date: string, startTime: string, now: number) => {
  const today = toDateStr(new Date(now));
  if (date !== today) return date < today;
  const d = new Date(now);
  return timeToMinutes(startTime) <= d.getHours() * 60 + d.getMinutes();
};

export const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/** The company of a ground; `/grounds` populates it, but fall back gracefully if it is a bare id. */
export const companyOf = (g: Ground): Company | null =>
  typeof g.companyId === "string" ? null : g.companyId;

export const idOf = <T extends { _id: string }>(ref: Ref<T> | null | undefined): string =>
  !ref ? "" : typeof ref === "string" ? ref : ref._id;

/** Lowest price the ground can charge, for "from ৳X" labels. */
export const startingPrice = (g: Ground) => {
  const cells = (g.pricingConfig.timeBands ?? []).flatMap((b) =>
    PRICING_DAYS.map((d) => b.prices?.[d]).filter((p): p is number => typeof p === "number")
  );
  return Math.min(g.pricingConfig.basePrice, ...cells);
};

export const advanceAmount = (price: number) => Math.round(price * 0.5);

/** Only follow in-app redirect targets so a crafted ?next= can't send people elsewhere. */
export const safeNext = (next: string | null | undefined, fallback = "/") =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;

/** Remove spaces and dashes so the same number always matches the same account. */
export const normalizePhone = (s: string) => s.replace(/[\s-]/g, "");
export const isPhone = (s: string) => /^\+?\d{10,15}$/.test(normalizePhone(s));
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Has the booked slot finished? Without a slot (deleted) the whole booking day counts. */
export const isBookingOver = (b: Booking, now: number) => {
  const end = b.slotId?.endTime ?? "23:59";
  const [y, m, d] = b.bookingDate.split("-").map(Number);
  const [h, min] = end.split(":").map(Number);
  return new Date(y, m - 1, d, h, min).getTime() <= now;
};

/** Sort key: date then start time, so lists order chronologically. */
export const bookingStart = (b: Booking) => `${b.bookingDate} ${b.slotId?.startTime ?? ""}`;
