import type { Metadata, Viewport } from "next";

import { Providers } from "@/components/theme/providers";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import { demoUser } from "@/lib/fixtures";
import { preferencesScript } from "@/lib/preferences";
import { absoluteUrl } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: { default: siteConfig.product, template: `%s · ${siteConfig.product}` },
  description: siteConfig.description,
  applicationName: siteConfig.product,
  // Internal tool: keep it out of search engines.
  robots: { index: false, follow: false },
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  // TODO: replace demoUser with the real session (e.g. from a cookie) once auth is wired up.
  const user = demoUser;
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
      </head>
      <body>
        <Providers user={user}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
