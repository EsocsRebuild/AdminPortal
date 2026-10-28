import { DM_Sans, Plus_Jakarta_Sans, Raleway, Roboto_Mono } from "next/font/google";

export const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

/** Executive ecclesiastical font matching Ordination Portal (Raleway). */
export const fontBrand = Raleway({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});

export const fontMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${fontSans.variable} ${fontDisplay.variable} ${fontBrand.variable} ${fontMono.variable}`;
