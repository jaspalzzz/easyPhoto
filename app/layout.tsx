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
  themeColor: "#faf6ee",
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
        {/* Site-wide structured data: brand + website */}
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        {/* Solid paper header on a hairline — no glass/blur. */}
        <header className="sticky top-0 z-40 border-b border-hairline bg-paper">
          <div className="container flex h-14 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="easyPhoto home"
            >
              <LogoMark className="h-8 w-8" />
              <Wordmark className="text-lg" />
            </Link>
            <div className="flex items-center">
              <MainNav />
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
