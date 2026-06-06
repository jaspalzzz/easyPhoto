import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Footer } from "@/components/site/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Passport & Visa Photo Maker — Free, Private, In-Browser",
    template: "%s — EasyPhoto",
  },
  description:
    "Create a compliant passport or visa photo for free. Auto-crops to your " +
    "country's exact head-size and background rules. 100% in your browser — " +
    "your photo never leaves your device.",
  openGraph: {
    type: "website",
    title: "Passport & Visa Photo Maker — Free, Private, In-Browser",
    description:
      "Compliant passport & visa photos plus free image and PDF tools. " +
      "Everything runs in your browser — nothing is uploaded.",
    siteName: "EasyPhoto",
  },
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
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="text-lg">📷</span> EasyPhoto
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
