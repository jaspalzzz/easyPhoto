import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";

/**
 * Rich footer = a crawlable internal-link sitemap (every country + every tool).
 * Strong for SEO (link equity flows to every landing page) and for navigation.
 */
export function Footer() {
  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="container grid gap-10 py-12 lg:grid-cols-[1.6fr_3fr]">
        <div className="space-y-3">
          <Link href="/" className="font-semibold tracking-tight">
            📷 EasyPhoto
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Free, private passport &amp; visa photos and everyday image tools —
            made entirely in your browser.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Your files never leave your device.
          </p>
        </div>

        {/* Four link groups divide evenly: 2×2 on phones, 1×4 on wider screens. */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Passport &amp; visa</h3>
            <ul className="space-y-2 text-sm">
              {LAUNCH_ORDER.map((id) => (
                <li key={id}>
                  <Link
                    href={`/${id}/`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {COUNTRY_SPECS[id].label} photo
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {TOOLS_CATALOG.map((group) => (
            <div key={group.group} className="space-y-3">
              <h3 className="text-sm font-semibold">{group.group}</h3>
              <ul className="space-y-2 text-sm">
                {group.tools
                  .filter((t) => t.ready)
                  .map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tools/${t.slug}/`}
                        className="text-muted-foreground hover:text-foreground"
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

      <div className="border-t">
        <div className="container flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {2026} EasyPhoto. Processed in your browser — never uploaded.
            Always verify against official requirements before submitting.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy/" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms/" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
