import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { passportPath, visaPath } from "@/lib/makerPages";
import { TrustPills } from "@/components/site/TrustStrip";
import { HeroVisual } from "@/components/site/HeroVisual";
import { StatsBand } from "@/components/site/StatsBand";
import { FeaturedTools } from "@/components/site/FeaturedTools";
import { AiShowcase } from "@/components/site/AiShowcase";
import { PopularDocs } from "@/components/site/PopularDocs";
import { ToolsTabs } from "@/components/site/ToolsTabs";
import { WhyRejected } from "@/components/site/WhyRejected";
import { ComparisonTable } from "@/components/site/ComparisonTable";
import { DarkTrustStrip } from "@/components/site/DarkTrustStrip";
import { Faq, HOME_FAQ } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareApplicationSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ToolSearch } from "@/components/site/ToolSearch";
import { RecentTools } from "@/components/site/RecentTools";

export const metadata = pageMetadata({
  title: "easyPhoto — Document Photo & Form-Resize Tools for India",
  description:
    "Free tools for Indian passport photos, visa photos and exam form resizing. " +
    "Pick your country or exam — everything runs in your browser, nothing is uploaded.",
  path: "/",
});

/* Quick-access chips shown below the hero search bar */
const POPULAR_CHIPS = [
  { label: "Indian Passport",       href: "/passport-photo/"                  },
  { label: "Voter ID",              href: "/exam-requirements/voter-id/"      },
  { label: "USA Visa",              href: visaPath("us")                      },
  { label: "SSC Photo",             href: "/ssc-photo-resizer/"               },
  { label: "UPSC Photo",            href: "/upsc-photo-resizer/"              },
  { label: "Sign Image",            href: "/tools/sign-image/"                },
  { label: "Transparent Signature", href: "/tools/transparent-signature/"     },
];

/* Popular search terms — bottom SEO + discovery strip */
const POPULAR_SEARCHES = [
  { label: "USA Visa Photo",        href: visaPath("us")                      },
  { label: "Indian Passport Photo", href: "/passport-photo/"                  },
  { label: "Voter ID Photo Resizer",href: "/exam-requirements/voter-id/"      },
  { label: "Sign on Image",         href: "/tools/sign-image/"                },
  { label: "Canada Visa Photo",     href: visaPath("canada")                  },
  { label: "UK Passport Photo",     href: passportPath("uk")                  },
  { label: "UPSC Photo Resize",     href: "/upsc-photo-resizer/"              },
  { label: "Transparent Signature", href: "/tools/transparent-signature/"     },
  { label: "Railway Exam Photo",    href: "/railway-photo-resizer/"           },
  { label: "Banking Exam Photo",    href: "/ibps-photo-resizer/"              },
  { label: "Signature Resize",      href: "/tools/signature-resize/"          },
  { label: "Background Remover",    href: "/tools/background-removal/"        },
  { label: "Compress PDF",          href: "/tools/pdf-compress/"              },
  { label: "Passport Size Photo",   href: "/passport-photo/"                  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        schema={[
          softwareApplicationSchema({
            name: "easyPhoto — Document Photo & Form-Resize Tools",
            description:
              "Free tools for Indian passport photos, visa photos, exam form resizing and government document images. Everything runs in your browser, nothing is uploaded.",
            url: "/",
            category: "UtilitiesApplication",
            dateModified: "2026-06-21",
          }),
          faqSchema(HOME_FAQ),
        ]}
      />

      {/* Personalisation bar for returning users */}
      <RecentTools />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-paper">
        <div className="container pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-10">

            {/* Left — value proposition */}
            <div className="hero-enter max-w-xl">
              <span className="eyebrow">
                Passport · Visa · ID Card · Exam — exact to the millimetre
              </span>
              <h1 className="mt-4 text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-tightest sm:text-[3.25rem]">
                Document photos that{" "}
                <span className="mark-gold"><span className="text-gradient-brand">get accepted</span></span>
              </h1>
              <p className="mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                100% free tools. No uploads. No data stored.
                Choose your country or exam — we crop, check and deliver.
              </p>

              {/* Search + popular chips */}
              <div className="mt-6 max-w-md">
                <ToolSearch />
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Popular:
                  </span>
                  {POPULAR_CHIPS.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="rounded-full border border-hairline bg-card px-2.5 py-1 text-[11.5px] font-medium text-ink transition-colors hover:bg-accent"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              <TrustPills className="mt-6 justify-start" />
            </div>

            {/* Right — animated before/after visual */}
            <div className="lg:pl-2">
              <HeroVisual />
            </div>
          </div>

          {/* ── Stats band — anchored to hero bottom, same bg ─────────── */}
          <StatsBand />
        </div>
      </section>

      {/* ── FEATURED TOOLS — "Everything you need in one place" ─────── */}
      <FeaturedTools />

      {/* ── WHY PHOTOS GET REJECTED (pain) ───────────────────────────── */}
      <WhyRejected />

      {/* ── AI SHOWCASE — 3-panel before/AI/after + 4-step strip ─────── */}
      <AiShowcase />

      {/* ── COMPARISON — easyPhoto vs Photo Studio ───────────────────── */}
      <ComparisonTable />

      {/* ── POPULAR DOCS + EXAMS + STATS ─────────────────────────────── */}
      <PopularDocs />

      {/* ── ALL TOOLS — tabbed ────────────────────────────────────────── */}
      <ToolsTabs />

      {/* ── DARK TRUST STRIP ─────────────────────────────────────────── */}
      <DarkTrustStrip />

      {/* ── POPULAR SEARCHES ──────────────────────────────────────────── */}
      <section className="border-t border-hairline bg-paper">
        <div className="container py-10">
          <p className="mb-4 text-[13.5px] font-bold text-ink">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((s) => (
              <Link
                key={s.href + s.label}
                href={s.href}
                className="rounded-full border border-hairline bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-accent"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="container py-14 sm:py-16">
        <Faq noSchema />
      </section>
    </>
  );
}
