import { Instrument_Serif, Inter } from "next/font/google";
import localFont from "next/font/local";

export const satoshi = localFont({
  src: "./satoshi-variable.woff2",
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "fallback",
  preload: false,
  fallback: ["serif"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});
