import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import { PASSPORT_COUNTRIES, primaryMakerPath } from "@/lib/makerPages";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { Wordmark } from "@/components/site/Wordmark";
import { LogoMark } from "@/components/site/LogoMark";

/**
 * Rich navy footer = a crawlable internal-link sitemap (every country + tool),
 * styled to match the navy header so the page is intentionally framed top and
 * bottom. Light text on navy, gold hover + gold top rule. Link structure is
 * unchanged (SEO link-equity to every landing page).
 */
const linkCls =
  "text-white/55 transition-colors hover:text-[hsl(var(--cta))]";

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-cta bg-[hsl(222_60%_8%)] text-white/70">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.6fr_3fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" onDark />
            <Wordmark className="text-[1.35rem]" tone="light" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            Free, private passport &amp; visa photos and everyday image &amp; PDF
            tools, made entirely in your browser.
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/75">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--cta))]" strokeWidth={1.75} />
            Your files never leave your device
          </p>
        </div>

        {/* Four link groups divide evenly: 2×2 on phones, 1×4 on wider screens. */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="eyebrow text-white">Passport &amp; visa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/passport-photo/" className={linkCls}>
                  Passport photo maker
                </Link>
              </li>
              <li>
                <Link href="/visa-photo/" className={linkCls}>
                  Visa photo maker
                </Link>
              </li>
              {LAUNCH_ORDER.map((id) => (
                <li key={id}>
                  <Link href={primaryMakerPath(id)} className={linkCls}>
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
              <h3 className="eyebrow text-white">{group.group}</h3>
              <ul className="space-y-2 text-sm">
                {group.tools
                  .filter((t) => t.ready)
                  .map((t) => (
                    <li key={t.slug}>
                      <Link href={`/tools/${t.slug}/`} className={linkCls}>
                        {t.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} easyPhoto. Processed in your browser, never uploaded.
            Always verify against official requirements before submitting.
          </p>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/blog/" className="transition-colors hover:text-[hsl(var(--cta))]">Blog</Link>
            <Link href="/about/" className="transition-colors hover:text-[hsl(var(--cta))]">About</Link>
            <Link href="/contact/" className="transition-colors hover:text-[hsl(var(--cta))]">Contact</Link>
            <Link href="/privacy/" className="transition-colors hover:text-[hsl(var(--cta))]">Privacy</Link>
            <Link href="/terms/" className="transition-colors hover:text-[hsl(var(--cta))]">Terms</Link>
            <Link href="/disclaimer/" className="transition-colors hover:text-[hsl(var(--cta))]">Disclaimer</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
