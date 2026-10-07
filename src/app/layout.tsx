import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { Providers } from "@/components/theme/providers";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import { preferencesScript } from "@/lib/preferences";
import { absoluteUrl } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: { default: "The ESOCS Administration Portal", template: `%s · ESOCS Admin` },
  description: siteConfig.description,
  applicationName: "ESOCS Administration Portal",
  icons: {
    icon: [
      { url: "/brand/esocs-crest.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/brand/esocs-crest.png",
    shortcut: "/brand/esocs-crest.png",
  },
  openGraph: {
    title: "The ESOCS Administration Portal",
    description: "Digital Church & Ordination Governance Portal for the Eternal Sacred Order of the Cherubim & Seraphim.",
    images: [{ url: "/brand/hero-mount-zion.webp", width: 1200, height: 630, alt: "ESOCS Administration Portal" }],
  },
  robots: { index: false, follow: false, nocache: true },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Per-request CSP nonce from the proxy; inline scripts must carry it.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: preferencesScript }} />
      </head>
      <body>
        <Providers nonce={nonce}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
