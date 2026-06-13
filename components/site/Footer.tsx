import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import { PASSPORT_COUNTRIES, primaryMakerPath } from "@/lib/makerPages";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { Wordmark } from "@/components/site/Wordmark";
import { LogoMark } from "@/components/site/LogoMark";

/**
 * Rich footer = a crawlable internal-link sitemap (every country + every tool).
 * Strong for SEO (link equity flows to every landing page) and for navigation.
 */
export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-brand/70 bg-paper">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.6fr_3fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <Wordmark className="text-[1.35rem]" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Free, private passport &amp; visa photos and everyday image &amp; PDF
            tools, made entirely in your browser.
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
            Your files never leave your device
          </p>
        </div>

        {/* Four link groups divide evenly: 2×2 on phones, 1×4 on wider screens. */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="eyebrow text-ink">Passport &amp; visa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/passport-photo/"
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  Passport photo maker
                </Link>
              </li>
              <li>
                <Link
                  href="/visa-photo/"
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  Visa photo maker
                </Link>
              </li>
              {LAUNCH_ORDER.map((id) => (
                <li key={id}>
                  <Link
                    href={primaryMakerPath(id)}
                    className="text-muted-foreground transition-colors hover:text-brand"
                  >
                    {COUNTRY_SPECS[id].label}{" "}
                    {(PASSPORT_COUNTRIES as readonly string[]).includes(id)
                      ? "passport"
                      : "visa"}{" "}
                    photo
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {TOOLS_CATALOG.map((group) => (
            <div key={group.group} className="space-y-3">
              <h3 className="eyebrow text-ink">{group.group}</h3>
              <ul className="space-y-2 text-sm">
                {group.tools
                  .filter((t) => t.ready)
                  .map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tools/${t.slug}/`}
                        className="text-muted-foreground transition-colors hover:text-brand"
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} easyPhoto. Processed in your browser, never uploaded.
            Always verify against official requirements before submitting.
          </p>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/blog/" className="transition-colors hover:text-brand">
              Blog
            </Link>
            <Link href="/about/" className="transition-colors hover:text-brand">
              About
            </Link>
            <Link href="/contact/" className="transition-colors hover:text-brand">
              Contact
            </Link>
            <Link href="/privacy/" className="transition-colors hover:text-brand">
              Privacy
            </Link>
            <Link href="/terms/" className="transition-colors hover:text-brand">
              Terms
            </Link>
            <Link href="/disclaimer/" className="transition-colors hover:text-brand">
              Disclaimer
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
