import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, type Crumb } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

/**
 * Date-free on purpose (owner decision, 13 Oct 2026). This is a static export
 * and the site stops being rebuilt after October 2026, so any date printed
 * here would go stale and stay wrong. The page points to each board's own
 * calendar instead; the boards keep those current.
 */

export const metadata = pageMetadata({
  title: "Official Exam Calendars: SSC, UPSC, IBPS, NTA, RRB — easyPhoto",
  titleAbsolute: true,
  description:
    "Where SSC, UPSC, IBPS, NTA and RRB publish their exam dates, with links to each official " +
    "calendar and the photo and signature rules you'll need when the form opens.",
  path: "/exam-calendar/",
});

/** Each board's own calendar, checked 13 Oct 2026. */
const BOARDS: ReadonlyArray<{
  board: string;
  what: string;
  link: { href: string; label: string };
  specs: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    board: "SSC (Staff Selection Commission)",
    what: "Publishes a tentative calendar of examinations for the year on ssc.gov.in; each exam's exact dates are then fixed in its own notice.",
    link: { href: "https://ssc.gov.in/for-candidates/examination-calendar", label: "SSC examination calendar" },
    specs: [{ href: "/exam-requirements/ssc/", label: "SSC photo & signature" }],
  },
  {
    board: "UPSC (Union Public Service Commission)",
    what: "Publishes its calendar of examinations for the coming year as a PDF; the 2027 calendar was released on 20 May 2026.",
    link: { href: "https://upsc.gov.in/examinations/exam-calendar", label: "UPSC exam calendar" },
    specs: [{ href: "/exam-requirements/upsc/", label: "UPSC photo & signature" }],
  },
  {
    board: "IBPS (Institute of Banking Personnel Selection)",
    what: "Announces a tentative calendar for its common recruitment processes on ibps.in; each process then opens with its own notification.",
    link: { href: "https://www.ibps.in", label: "IBPS website" },
    specs: [{ href: "/exam-requirements/ibps/", label: "IBPS photo & signature" }],
  },
  {
    board: "NTA (National Testing Agency)",
    what: "Keeps one examination calendar PDF for its tests, including UGC-NET, the Joint CSIR-UGC NET, CUET and JEE (Main).",
    link: { href: "https://nta.ac.in/Download/Notice/Examcalendar.pdf", label: "NTA examination calendar (PDF)" },
    specs: [
      { href: "/exam-requirements/cuet/", label: "CUET photo & signature" },
      { href: "/exam-requirements/csir-net/", label: "CSIR-NET photo & signature" },
    ],
  },
  {
    board: "RRB (Railway Recruitment Boards)",
    what: "Has no single calendar page: each recruitment is a Centralised Employment Notice (CEN), listed on the regional RRB websites.",
    link: { href: "https://rrb.indianrailways.gov.in/", label: "RRB notices" },
    specs: [{ href: "/exam-requirements/rrb/", label: "RRB signature" }],
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Why doesn't this page list exam dates?",
    a: "Boards revise their calendars between cycles, and a copied date can be wrong by the time you read it. The official calendars linked here are kept current by the boards themselves.",
  },
  {
    q: "When are the exact application dates fixed?",
    a: "When the board publishes the notice for that exam. The annual calendars give planned months or dates, and both UPSC and NTA mark theirs as subject to change.",
  },
  {
    q: "What should I prepare before the form opens?",
    a: "Your photo and signature, to the rules on the exam's page here. Recheck them against the new notice when it's published, because boards sometimes change them between cycles.",
  },
];

export default function ExamCalendarPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Exam Requirements", path: "/exam-requirements/" },
    { name: "Exam Calendar", path: "/exam-calendar/" },
  ];

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd schema={[breadcrumbSchema(crumbs), faqSchema(FAQS)]} />
      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3 border-b border-hairline pb-7">
        <span className="eyebrow block text-brand">Official calendars</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[36px]">
          Where to Find Official Exam Dates
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Exam boards publish their own calendars and revise them between cycles, so this page
          doesn&apos;t copy dates that may change. It links each board&apos;s official calendar, and
          the photo and signature rules for its exams, so your files are ready before the form
          opens.
        </p>
      </header>

      <ul className="space-y-4">
        {BOARDS.map((b) => (
          <li key={b.board} className="ep-card p-5">
            <p className="font-semibold text-ink">{b.board}</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{b.what}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <a
                href={b.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-brand hover:underline"
              >
                {b.link.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {b.specs.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group inline-flex items-center gap-1 font-medium text-ink hover:text-brand"
                >
                  {s.label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <section className="rounded-lg border border-brand/25 bg-brand-soft/20 p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Be ready before the form opens</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Photo and signature rules are published in each notice, often long before the window
          opens. Prepare your files now, then check them again against the notice when you apply.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Link
            href="/tools/exam-package/"
            className="inline-flex items-center gap-1 rounded-md bg-cta px-3.5 py-2 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
          >
            Exam Application Kit <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/exam-requirements/"
            className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50"
          >
            All exam specs
          </Link>
          <Link
            href="/exam-photo-size/"
            className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50"
          >
            Size comparison table
          </Link>
        </div>
      </section>

      <section>
        <Faq items={FAQS} noSchema />
      </section>
    </div>
  );
}
