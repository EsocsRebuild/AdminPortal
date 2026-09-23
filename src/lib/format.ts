import { siteConfig } from "@/config/site";

const { locale, timeZone } = siteConfig;

type DateInput = Date | string | number;
const toDate = (d: DateInput) => (d instanceof Date ? d : new Date(d));

/** e.g. "5 Oct 2026" */
export function formatDate(date: DateInput, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
    ...options,
  }).format(toDate(date));
}

/** e.g. "5 Oct 2026, 9:30 am" */
export function formatDateTime(date: DateInput) {
  return formatDate(date, { hour: "numeric", minute: "2-digit", hour12: true });
}

/** e.g. "9:30 am" */
export function formatTime(date: DateInput) {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12: true, timeZone }).format(
    toDate(date),
  );
}

/** e.g. "in 3 days", "2 hours ago", "just now" */
export function formatRelative(date: DateInput, now: Date = new Date()) {
  const diff = toDate(date).getTime() - now.getTime();
  if (Math.abs(diff) < 45_000) return "just now";
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["week", 604_800_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return rtf.format(Math.round(diff / 1000), "second");
}

/** e.g. "₦25,000". Pass `compact` for "₦1.2M". */
export function formatCurrency(amount: number, { currency = siteConfig.currency, compact = false } = {}) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(amount);
}

/** e.g. "12,480" */
export function formatNumber(n: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(n);
}

/** e.g. "12.4K" */
export function formatCompact(n: number) {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** 0.124 → "12.4%". Pass `signed` for "+12.4%". */
export function formatPercent(ratio: number, { signed = false, digits = 1 } = {}) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(ratio);
}

/** 1536 → "1.5 KB" */
export function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
