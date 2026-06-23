import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { calendarSorted } from "@/lib/examCalendar";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";

export const metadata = pageMetadata({
  title: "Exam Calendar 2026-27 — Upcoming Notification & Exam Dates",
  titleAbsolute: true,
  description:
    "Upcoming Indian exam notifications, application windows and exam dates " +
    "from the official SSC, UPSC and IBPS calendars — each entry sourced and " +
    "dated, with the photo & signature specs you'll need when the form opens.",
  path: "/exam-calendar/",
});

const FAQS: FaqItem[] = [
  {
    q: "Where do these dates come from?",
    a: "Each entry is taken from the board's official annual calendar (ssc.gov.in, upsc.gov.in, ibps.in) and shows the date we last confirmed it. Tentative entries are month-level windows from the official calendar; confirmed entries are exact published dates.",
  },
  {
    q: "Can the dates change?",
    a: "Yes — boards revise calendars between cycles, and exact application windows are fixed only when each notification is published. Always check the official notification before planning; this page links the official source on every entry.",
  },
  {
    q: "How do I get reminded before a window opens?",
    a: "Use the “Add to my calendar” button — it downloads a standard .ics file with the confirmed dates. Open it and your own phone's calendar (Google, Apple, anything) saves the events and reminds you. Nothing is tracked by us; the reminder lives on your device.",
  },
  {
    q: "What should I prepare before the form opens?",
    a: "The photo and signature in the exact size the portal demands — that's the step that rejects most applications. Each entry links to the official photo & signature spec with a free resizer, so you can have compliant files ready the day applications open.",
  },
];

export default function ExamCalendarPage() {
  const entries = calendarSorted();

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Exam Requirements", path: "/exam-requirements/" },
          { name: "Exam Calendar", path: "/exam-calendar/" },
        ])}
      />

      <header className="space-y-3 border-b border-hairline pb-7">
        <span className="eyebrow block text-brand">Official calendars, sourced &amp; dated</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          Upcoming Exam Dates &amp; Application Windows
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          What&apos;s opening next, from the official SSC, UPSC and IBPS
          calendars — so your photo and signature are ready{" "}
          <em>before</em> the form opens, not scrambled together on deadline day.
        </p>
        <a
          href="/exam-calendar/ics"
          className="inline-flex items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
        >
          <CalendarPlus className="h-4 w-4" strokeWidth={2} />
          Add to my calendar (.ics)
        </a>
        <p className="text-xs text-muted-foreground">
          Your phone&apos;s own calendar does the reminding — nothing is tracked by us.
        </p>
      </header>

      {/* Timeline */}
      <ol className="space-y-4">
        {entries.map((e) => {
          const confirmed = e.status === "confirmed";
          return (
            <li key={e.id} className="ep-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{e.name}</span>
                    <span
                      className={
                        confirmed
                          ? "inline-flex items-center gap-1 rounded-full bg-[hsl(142_55%_45%/0.12)] px-2 py-0.5 text-[11px] font-semibold text-[hsl(142_55%_28%)] dark:bg-[hsl(142_55%_45%/0.20)] dark:text-[hsl(142_55%_60%)]"
                          : "inline-flex items-center gap-1 rounded-full bg-[hsl(38_92%_50%/0.14)] px-2 py-0.5 text-[11px] font-semibold text-[hsl(32_80%_34%)] dark:bg-[hsl(38_92%_50%/0.20)] dark:text-[hsl(32_80%_62%)]"
                      }
                    >
                      {confirmed ? (
                        <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                      ) : (
                        <Clock3 className="h-3 w-3" strokeWidth={2} />
                      )}
                      {confirmed ? "Confirmed" : "Tentative"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.event}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[13px] font-medium text-ink">
                    <CalendarDays className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
                    {e.window}
                  </p>
                </div>
                <Link
                  href={e.specPath}
                  className="group inline-flex shrink-0 items-center gap-1 rounded-lg border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft/40"
                >
                  Photo &amp; signature spec
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                </Link>
              </div>
              <p className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-hairline pt-2.5 text-xs text-ink-soft">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                <span>Verified {e.verifiedOn} ·</span>
                <a
                  href={e.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-medium text-brand hover:underline"
                >
                  {e.source.label} <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </li>
          );
        })}
      </ol>

      <p className="text-xs text-muted-foreground">
        Exact application windows are fixed only when each notification is
        published — confirm on the official portal before planning. Spotted a
        date that&apos;s changed?{" "}
        <Link href="/contact/" className="text-brand hover:underline">
          Tell us
        </Link>
        .
      </p>

      {/* Be ready before the window opens */}
      <section className="rounded-lg border border-brand/25 bg-brand-soft/20 p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Be ready before the form opens
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The photo and signature sizes are published long before each window —
          prepare compliant files now and apply in minutes on day one.
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
        <Faq items={FAQS} />
      </section>
    </div>
  );
}
