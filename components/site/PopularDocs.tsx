import Link from "next/link";
import { ArrowRight, Globe, BookOpen, ShieldCheck, Wrench, Lock } from "lucide-react";
import { Flag } from "@/components/site/Flag";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import { MAKER_PAGES, primaryMakerPath } from "@/lib/makerPages";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { READY_TOOLS } from "@/lib/toolsCatalog";

/* ── Popular Countries ─────────────────────────────────────────────────
   4 headline markets get large hero cards; every other launch country is
   linked as a compact flag chip below ("long-tail" SEO links, kept but
   de-emphasised). All routes resolve via primaryMakerPath — the same helper
   the footer uses — so the URLs always match the real maker pages. */
const HERO_COUNTRIES = [
  // India keeps its canonical hub page (/passport-photo/); the rest use the
  // maker route that primaryMakerPath / the footer already point to.
  { id: "india",  name: "India",  sub: "Passport · Visa · ID", href: "/passport-photo/"        },
  { id: "us",     name: "USA",    sub: "Passport · Visa",      href: primaryMakerPath("us")     },
  { id: "uk",     name: "UK",     sub: "Passport · Visa",      href: primaryMakerPath("uk")     },
  { id: "canada", name: "Canada", sub: "Passport · Visa",      href: primaryMakerPath("canada") },
];

const HERO_IDS = new Set(HERO_COUNTRIES.map((c) => c.id));

/* Only countries that actually have a generated maker page can be linked —
   MAKER_PAGES is the source of truth (it drives generateStaticParams). A few
   launch countries (e.g. the Gulf states) have spec data but no maker page yet,
   so primaryMakerPath would otherwise resolve to a 404. */
const MAKER_COUNTRY_IDS = new Set(MAKER_PAGES.map((m) => m.countryId));

// Remaining launch countries → compact flag chips (long-tail discovery + SEO).
const MORE_COUNTRIES = LAUNCH_ORDER.filter(
  (id) => !HERO_IDS.has(id) && MAKER_COUNTRY_IDS.has(id)
)
  .map((id) => ({
    id,
    label: COUNTRY_SPECS[id]?.label ?? id,
    href: primaryMakerPath(id),
  }))
  .filter((c) => Boolean(c.label));

// Row 2 — Identity documents (icon tiles)
const ID_DOCS = [
  { label: "Aadhaar Card",    sub: "UIDAI",              href: "/aadhaar-photo/"                       },
  { label: "PAN Card",        sub: "Income Tax India",   href: "/tools/form-resizer/pan/"              },
  { label: "OCI Card",        sub: "Ministry of Home",   href: "/tools/form-resizer/oci/"              },
  { label: "Driving License", sub: "All States",         href: "/tools/form-resizer/driving-licence/"  },
  { label: "Voter ID Card",   sub: "Election Commission",href: "/exam-requirements/voter-id/"          },
];

const POPULAR_EXAMS = [
  { label: "SSC",           sub: "CGL, CHSL, MTS",      href: "/ssc-photo-resizer/"              },
  { label: "UPSC",          sub: "Civil Services IAS",   href: "/upsc-photo-resizer/"             },
  { label: "Railway RRB",   sub: "NTPC, Group D",        href: "/railway-photo-resizer/"          },
  { label: "IBPS Banking",  sub: "PO, Clerk, SO",        href: "/ibps-photo-resizer/"             },
  { label: "SBI PO",        sub: "Probationary Officer", href: "/sbi-po-photo-resizer/"           },
  { label: "NEET / JEE",    sub: "NTA Exams",            href: "/tools/form-resizer/nta/"         },
  { label: "NDA / CDS",     sub: "Defence Exams",        href: "/tools/form-resizer/nda/"         },
  { label: "CTET",          sub: "Teacher Eligibility",  href: "/tools/form-resizer/ctet/"        },
];

const STATS = [
  { Icon: Globe,       value: `${LAUNCH_ORDER.length}+`, label: "Countries Supported",       sub: "Official government specs"         },
  { Icon: BookOpen,    value: `${PORTAL_KEYS.length}+`,  label: "Exam Specifications",       sub: "SSC, UPSC, Railway, Banking & more"},
  { Icon: ShieldCheck, value: "Official",                label: "Spec Sources",              sub: "Checked against published requirements" },
  { Icon: Wrench,      value: `${READY_TOOLS.length}+`,  label: "Free Tools",                sub: "Photo, PDF, signature & more"      },
  { Icon: Lock,        value: "0",                       label: "Uploads to any server",     sub: "Everything runs in your browser"   },
];

export function PopularDocs() {
  return (
    <section className="border-t border-hairline bg-card">
      <div className="container reveal py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_240px] lg:gap-8">

          {/* LEFT: Documents + Exams stacked */}
          <div className="flex flex-col gap-10">

            {/* Popular Countries — 4 hero cards + long-tail flag chips */}
            <div>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="text-[17px] font-bold text-ink">Popular Countries</h2>
                <Link
                  href="/visa-photo/"
                  className="hidden shrink-0 items-center gap-1 text-[12.5px] font-semibold text-brand hover:underline sm:flex"
                >
                  View all countries <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Hero country cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {HERO_COUNTRIES.map(({ id, name, sub, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="lift-card group flex flex-col items-center gap-3 p-5 text-center"
                  >
                    <Flag
                      country={id}
                      className="h-11 w-[68px] rounded-md ring-1 ring-hairline"
                    />
                    <div>
                      <p className="text-[14px] font-bold leading-tight text-ink">{name}</p>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">{sub}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11.5px] font-semibold text-brand">
                      Make photo
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Long-tail — every other country as a compact flag chip */}
              <p className="mb-2 mt-6 text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground">
                More countries
              </p>
              <div className="flex flex-wrap gap-2">
                {MORE_COUNTRIES.map(({ id, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-2.5 py-1 text-[11.5px] font-medium text-ink transition-colors hover:border-hairline-strong hover:bg-surface"
                  >
                    <Flag country={id} className="h-3 w-[1.05rem] rounded-[2px]" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Documents — identity documents */}
            <div>
              <h2 className="mb-5 text-[17px] font-bold text-ink">Popular Documents</h2>
              <p className="mb-2 text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground">
                ID &amp; Other Documents
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {ID_DOCS.map((doc) => (
                  <Link
                    key={doc.href + doc.label}
                    href={doc.href}
                    className="group flex items-center gap-3 rounded-xl border border-hairline bg-card p-3.5 transition-colors hover:border-hairline-strong hover:bg-surface"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
                      <Globe className="h-4 w-4 text-brand" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-[12.5px] font-semibold leading-tight text-ink">
                        {doc.label}
                      </p>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">
                        {doc.sub}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/passport-photo/"
                className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand hover:underline"
              >
                View all documents <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Popular Exams */}
            <div>
              <h2 className="mb-5 text-[17px] font-bold text-ink">Popular Exams</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {POPULAR_EXAMS.map((exam) => (
                  <Link
                    key={exam.href + exam.label}
                    href={exam.href}
                    className="group flex items-center gap-3 rounded-xl border border-hairline bg-card p-3.5 transition-colors hover:border-hairline-strong hover:bg-surface"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black leading-none text-cta"
                      style={{ background: "hsl(222 60% 8%)" }}
                    >
                      {exam.label.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[12.5px] font-semibold leading-tight text-ink">
                        {exam.label}
                      </p>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">
                        {exam.sub}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/tools/exam-package/"
                className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand hover:underline"
              >
                View all exams <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

          {/* RIGHT: Stats panel — full height */}
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-hairline bg-card p-6">
            {STATS.map(({ Icon, value, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                  <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[1.6rem] font-black leading-none tracking-tight text-ink">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink">{label}</p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
