import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck, Zap, Lock, BadgeCheck, ArrowRight,
  Globe, Aperture, FileText, PenLine, Wrench,
} from "lucide-react";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import { MAKER_PAGES, PASSPORT_COUNTRIES, primaryMakerPath } from "@/lib/makerPages";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { Wordmark } from "@/components/site/Wordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { cn } from "@/lib/utils";

/* Only link countries that have a generated maker page (MAKER_PAGES drives
   generateStaticParams). Some launch countries have spec data but no page yet,
   so linking them straight from LAUNCH_ORDER would produce 404s. */
const MAKER_COUNTRY_IDS = new Set(MAKER_PAGES.map((m) => m.countryId));
const FOOTER_COUNTRY_IDS = LAUNCH_ORDER.filter((id) => MAKER_COUNTRY_IDS.has(id));

/* ── Link groups ──────────────────────────────────────────────────────────
   The footer is a crawlable internal-link sitemap (every country + every ready
   tool gets a link → link-equity to all landing pages). It is organised into
   horizontal bands that mirror the header mega-menu: a colour-accented header
   (bar + icon + uppercase label) over a grid of links that FLOW across the full
   width — so the long country list no longer stacks into one lopsided column.
   Link URLs and anchor text are unchanged; only the layout changed. */

interface FooterLink { href: string; label: string }
interface LinkGroup {
  label: string;
  Icon: LucideIcon;
  /** Category landing page (already exists; adds an internal link, none removed). */
  viewAllHref: string;
  viewAllLabel: string;
  barCls: string;   /* accent bar colour (pops on navy) */
  iconCls: string;  /* matching icon colour            */
  links: FooterLink[];
}

const COUNTRY_LINKS: FooterLink[] = FOOTER_COUNTRY_IDS.map((id) => ({
  href: primaryMakerPath(id),
  label: `${COUNTRY_SPECS[id].label} ${
    (PASSPORT_COUNTRIES as readonly string[]).includes(id) ? "passport" : "visa"
  } photo`,
}));

/* Per-tool-group styling, keyed by slug so it can't drift if catalog order changes. */
const TOOL_GROUP_STYLE: Record<string, { Icon: LucideIcon; barCls: string; iconCls: string }> = {
  photo:     { Icon: Aperture, barCls: "bg-emerald-400", iconCls: "text-emerald-400" },
  pdf:       { Icon: FileText, barCls: "bg-violet-400",  iconCls: "text-violet-400"  },
  signature: { Icon: PenLine,  barCls: "bg-orange-400",  iconCls: "text-orange-400"  },
};

const LINK_GROUPS: LinkGroup[] = [
  {
    label: "Passport & Visa",
    Icon: Globe,
    viewAllHref: "/visa-photo/",
    viewAllLabel: "All countries",
    barCls: "bg-amber-400",
    iconCls: "text-amber-400",
    links: [
      { href: "/passport-photo/", label: "Passport photo maker" },
      { href: "/visa-photo/",     label: "Visa photo maker"     },
      ...COUNTRY_LINKS,
    ],
  },
  ...TOOLS_CATALOG.map((group): LinkGroup => {
    const style = TOOL_GROUP_STYLE[group.slug] ?? {
      Icon: Wrench, barCls: "bg-white/40", iconCls: "text-white/60",
    };
    return {
      label: group.group,
      Icon: style.Icon,
      viewAllHref: `/tools/${group.slug}/`,
      viewAllLabel: "View all",
      barCls: style.barCls,
      iconCls: style.iconCls,
      links: group.tools
        .filter((t) => t.ready)
        .map((t) => ({ href: `/tools/${t.slug}/`, label: t.title })),
    };
  }),
];

/* Trust signals — echo the header mega-menu's footer strip, dark-styled. */
const TRUST_SIGNALS = [
  { Icon: ShieldCheck, label: "100% Private",         sub: "Files never leave your device" },
  { Icon: Zap,         label: "Browser Processing",   sub: "No uploads, no waiting"        },
  { Icon: Lock,        label: "No Data Stored",        sub: "We don't keep your files"      },
  { Icon: BadgeCheck,  label: "Spec-Checked",           sub: "Against published requirements" },
] as const;

const linkCls = "text-sm text-white/70 transition-colors hover:text-[hsl(var(--cta))]";

/**
 * Rich navy footer = a crawlable internal-link sitemap (every country + tool),
 * styled to match the navy header so the page is intentionally framed top and
 * bottom. Light text on navy, gold hover + gold top rule.
 */
export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-cta bg-[hsl(222_60%_8%)] text-white/70">
      {/* ── Brand + trust signals ─────────────────────────────────────── */}
      <div className="container grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[1.3fr_2fr] lg:items-start lg:gap-16">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" onDark />
            <Wordmark className="text-[1.35rem]" tone="light" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            Free, private passport &amp; visa photos and everyday image &amp; PDF
            tools, made entirely in your browser.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:gap-x-4">
          {TRUST_SIGNALS.map(({ Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                <Icon className="h-4 w-4 text-[hsl(var(--cta))]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <p className="text-[12.5px] font-bold leading-tight text-white">{label}</p>
                <p className="mt-0.5 text-xs leading-snug text-white/70">{sub}</p>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Link bands (sitemap) ──────────────────────────────────────── */}
      <div className="container space-y-9 py-12">
        {LINK_GROUPS.map((group) => (
          <section key={group.label}>
            {/* Accent-bar header (matches header mega-menu columns) */}
            <div className="mb-4 flex items-center gap-2.5">
              <span className={cn("h-4 w-[3px] shrink-0 rounded-full", group.barCls)} />
              <group.Icon className={cn("h-4 w-4 shrink-0", group.iconCls)} strokeWidth={1.75} />
              <h3 className="eyebrow text-white">{group.label}</h3>
              <span className="text-xs font-medium text-white/70">{group.links.length}</span>
              <Link
                href={group.viewAllHref}
                className="ml-auto inline-flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-white/70 transition-colors hover:text-[hsl(var(--cta))]"
              >
                {group.viewAllLabel}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Links flow across the width instead of stacking */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {group.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
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
