import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted at build (no runtime CDN — keeps the CSP tight).
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
import { Footer } from "@/components/site/Footer";
import { Wordmark } from "@/components/site/Wordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { MainNav } from "@/components/site/MainNav";
import { MobileNav } from "@/components/site/MobileNav";
import { AnalyticsBeacon } from "@/components/site/AnalyticsBeacon";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import {
  SITE_URL,
  SITE_NAME,
  GOOGLE_SITE_VERIFICATION,
  BING_SITE_VERIFICATION,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Passport & Visa Photo Maker — Free, Private, In-Browser",
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Create a compliant passport or visa photo for free. Auto-crops to your " +
    "country's exact head-size and background rules. 100% in your browser — " +
    "your photo never leaves your device.",
  applicationName: SITE_NAME,
  // These reference files you drop into /public (see public/site.webmanifest).
  icons: {
    icon: [
      // Google Search's favicon picker only accepts icons ≥ 48×48 (a multiple
      // of 48) declared ON the page — the 192px PNG is what gets the brand
      // mark shown in search results instead of the generic globe.
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  // Rendered only when the env vars are set (see lib/site.ts) — paste your
  // Search Console / Bing codes post-deploy to verify ownership.
  ...(GOOGLE_SITE_VERIFICATION || BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(GOOGLE_SITE_VERIFICATION
            ? { google: GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(BING_SITE_VERIFICATION
            ? { other: { "msvalidate.01": BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Passport & Visa Photo Maker — Free, Private, In-Browser",
    description:
      "Compliant passport & visa photos plus free image and PDF tools. " +
      "Everything runs in your browser — nothing is uploaded.",
    siteName: SITE_NAME,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passport & Visa Photo Maker — Free, Private",
    description: "Compliant passport & visa photos + free image/PDF tools, in your browser.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  // Brand teal — gives easyPhoto a branded mobile browser/PWA chrome.
  themeColor: "#157F75",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-paper focus:text-brand"
        >
          Skip to main content
        </a>
        {/* Site-wide structured data: brand + website */}
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        {/* Crisp white header with a whisper of elevation — brand-forward. */}
        <header className="sticky top-0 z-40 border-b border-hairline bg-surface shadow-[0_1px_3px_rgb(0_0_0/0.04)]">
          <div className="container flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              aria-label="easyPhoto home"
            >
              <LogoMark className="h-9 w-9" />
              <Wordmark className="text-[1.35rem]" />
            </Link>
            <div className="flex items-center">
              <MainNav />
              <MobileNav />
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1">{children}</main>

        <Footer />
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
