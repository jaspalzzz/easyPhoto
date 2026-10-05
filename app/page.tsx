import Link from "next/link";
import { passportPath, visaPath } from "@/lib/makerPages";
import { TrustPills } from "@/components/site/TrustStrip";
import { HomeStarter } from "@/components/site/HomeStarter";
import { StatsBand } from "@/components/site/StatsBand";
import { ChoosePath } from "@/components/site/ChoosePath";
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
import { LatestGuides } from "@/components/site/LatestGuides";

export const metadata = pageMetadata({
  title: "easyPhoto — Document Photo & Form-Resize Tools for India",
  description:
    "Free tools for Indian passport photos, visa photos and exam form resizing. " +
    "Pick your country or exam — everything runs in your browser, nothing is uploaded.",
  path: "/",
});

/* Popular search terms — bottom SEO + discovery strip */
const POPULAR_SEARCHES = [
  { label: "USA Passport & Visa Photo", href: passportPath("us")                  },
  { label: "Indian Passport Photo", href: "/passport-photo/"                  },
  { label: "Voter ID Photo Resizer",href: "/exam-requirements/voter-id/"      },
  { label: "Sign on Image",         href: "/tools/sign-image/"                },
  { label: "Canada Visa Photo",     href: visaPath("canada")                  },
  { label: "UK Passport Photo",     href: passportPath("uk")                  },
  { label: "UPSC Photo Resize",     href: "/exam-requirements/upsc/"              },
  { label: "Transparent Signature", href: "/tools/transparent-signature/"     },
  { label: "Railway Exam Photo",    href: "/exam-requirements/rrb/"           },
  { label: "Banking Exam Photo",    href: "/exam-requirements/ibps/"              },
  { label: "Signature Resize",      href: "/tools/signature-resize/"          },
  { label: "Background Remover",    href: "/tools/background-removal/"        },
  { label: "Photo Resize 20 KB",    href: "/tools/resize-kb/?target=20"       },
  { label: "Add Signature to Photo",href: "/tools/sign-image/"                },
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

            {/* Left — value proposition. On mobile it follows the upload card
                (order-last) so the first thing a phone visitor sees is the drop
                zone, not prose or a search box — the whole point of the
                upload-first hero. */}
            <div className="hero-enter order-last max-w-xl lg:order-first">
              <span className="eyebrow">
                Passport · Visa · ID Card · Exam — prepared to selected dimensions
              </span>
              <h1 className="mt-4 text-balance text-[36px] font-semibold leading-[1.04] tracking-tightest sm:text-[48px]">
                Document photos{" "}
                <span className="mark-gold"><span>prepared to spec</span></span>
              </h1>
              <p className="mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                100% free tools. No uploads. No data stored.
                Drop a photo to resize it to an exact size, or pick your exam.
              </p>

              {/* Search moved below the value prop — discovery, not the primary
                  action. The drop zone is the primary action now. */}
              <div className="mt-6 max-w-md">
                <ToolSearch />
              </div>

              <TrustPills className="mt-6 justify-start" />
            </div>

            {/* Upload-first card — the primary action. order-first on mobile. */}
            <div className="order-first lg:order-last lg:pl-2">
              <HomeStarter />
            </div>
          </div>

          {/* ── Stats band — anchored to hero bottom, same bg ─────────── */}
          <StatsBand />
        </div>
      </section>

      {/* ── CHOOSE YOUR PATH — three-path hierarchy (exam / passport / tools) ─ */}
      <ChoosePath />

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

      {/* ── LATEST GUIDES — the site's written work, previously unreachable
             from the homepage ────────────────────────────────────────── */}
      <LatestGuides />

      {/* ── DARK TRUST STRIP ─────────────────────────────────────────── */}
      <DarkTrustStrip />

      {/* ── POPULAR SEARCHES ──────────────────────────────────────────── */}
      <section className="border-t border-hairline bg-paper">
        <div className="container py-10">
          <p className="mb-4 text-[14px] font-bold text-ink">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((s) => (
              <Link
                key={s.href + s.label}
                href={s.href}
                className="rounded-full border border-hairline bg-card px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-accent"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="container py-14 sm:py-20">
        <Faq noSchema />
      </section>
    </>
  );
}
