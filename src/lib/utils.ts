import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register custom tokens so tailwind-merge doesn't confuse them with colours or spacing.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["2xs", "md", "heading-sm", "heading-md", "heading-lg", "heading-xl", "metric", "overline"],
        },
      ],
      shadow: [{ shadow: ["button", "inset"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  return new URL(path, base).toString();
}

const TITLES = /\b(most|rev|revd|dr|pastor|elder|bishop|apostle|evangelist|prophet|mother|mr|mrs|ms)\.?\s+/gi;

/** Two-letter initials, ignoring clerical and honorific titles. */
export function initials(name: string) {
  const words = name.replace(TITLES, "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Stable 0…n-1 bucket for a string, e.g. to pick an avatar colour. */
export function hashToIndex(value: string, n: number) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h) % n;
}

export function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  const cut = value.lastIndexOf(" ", max);
  return `${value.slice(0, cut > 0 ? cut : max).trimEnd()}…`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
