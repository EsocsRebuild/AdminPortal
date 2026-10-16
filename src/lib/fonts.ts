import { Plus_Jakarta_Sans, Outfit, Playfair_Display } from "next/font/google";

export const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontDisplay = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

/** Executive regal brand font for wordmark and headers. */
export const fontBrand = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});

export const fontVariables = `${fontSans.variable} ${fontDisplay.variable} ${fontBrand.variable}`;
