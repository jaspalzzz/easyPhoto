import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

// Self-hosted at build (no runtime CDN — keeps the CSP tight).
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});
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
import { DownloadToast } from "@/components/site/DownloadToast";
import { PwaInstallHint } from "@/components/site/PwaInstallHint";
import { CommandPalette } from "@/components/site/CommandPalette";
import { ThemeToggle } from "@/components/site/ThemeToggle";
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
    default: "Passport, Visa & Exam Photo Maker — Free, In-Browser",
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Create a compliant passport or visa photo for free, or resize photos & " +
    "signatures to exact exam-form limits. 100% in your browser — your photo " +
    "never leaves your device.",
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
  // Brand navy — gives easyPhoto a branded mobile browser/PWA chrome.
  themeColor: "#0C1B34",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/* Anti-FOUC: apply stored/system theme BEFORE first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ep-theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t!=='light'&&d))document.documentElement.classList.add('dark')}catch(_){}})()` }} />
        {/* LCP preload — hero before-card is the largest above-fold image; early
            fetch hint prevents the browser from discovering it late during HTML parse,
            which is the primary mobile LCP bottleneck on this page. */}
        <link rel="preload" as="image" href="/images/sample4_before_1782052955340.webp" fetchPriority="high" />
        {/* AdSense connection warming — even with lazyOnload, establishing the
            TCP+TLS handshake early saves ~200ms on first-ad impression. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-paper focus:text-brand"
        >
          Skip to main content
        </a>
        {/* Site-wide structured data: brand + website */}
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        {/* Navy bureau header with the gold rule — the document-official signature. */}
        <header className="sticky top-0 z-40 border-b-2 border-cta bg-[hsl(222_60%_8%)]">
          <div className="container flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              aria-label="easyPhoto home"
            >
              <LogoMark className="h-9 w-9" onDark />
              <Wordmark className="text-[1.35rem]" tone="light" />
            </Link>
            <div className="flex items-center gap-1">
              <MainNav onDark />
              <ThemeToggle />
              <MobileNav onDark />
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1">{children}</main>

        <Footer />
        <AnalyticsBeacon />
        <DownloadToast />
        <PwaInstallHint />
        <CommandPalette />
        {/* AdSense runtime. Domain ownership is verified via public/ads.txt
            (pub-8825078307302402), so this script is NOT needed in the static
            HTML for verification — it only loads the ad-serving runtime. No ad
            units exist and Auto ads stay OFF, so nothing renders yet. We load it
            lazyOnload (browser idle, after the page is interactive) so it never
            competes with LCP on mobile. When ads are flipped on (at the agreed
            traffic threshold, privacy-policy update same day), they still serve —
            just initialize a moment later. Do NOT move this back to a blocking/
            head <script>: that regresses mobile LCP for zero verification gain. */}
        <Script
          id="adsbygoogle-init"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8825078307302402"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
