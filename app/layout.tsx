import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { Footer } from "@/components/site/Footer";
import { Wordmark } from "@/components/site/Wordmark";
import { SITE_URL, SITE_NAME } from "@/lib/site";

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="easyPhoto home">
              <span className="text-lg">📷</span>
              <Wordmark className="text-base" />
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Passport
              </Link>
              <Link
                href="/tools/"
                className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Tools
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
