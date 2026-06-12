import { EXAM_CALENDAR } from "@/lib/examCalendar";
import { SITE_URL } from "@/lib/site";

// Static export: emit /exam-calendar/ics at build time. public/_headers gives
// it Content-Type: text/calendar so phones open it straight into the calendar
// app — the no-backend "notification" mechanism (the user's own calendar
// reminds them; nothing is tracked by us).
export const dynamic = "force-static";

/** All-day VEVENT date: YYYYMMDD. */
const icsDate = (iso: string) => iso.replaceAll("-", "");

/** Next day in YYYYMMDD (DTEND is exclusive for all-day events). */
function icsDateNext(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return next.toISOString().slice(0, 10).replaceAll("-", "");
}

export function GET() {
  // Only exact official dates become events — a month-level "tentative"
  // window would create a misleading reminder.
  const events = EXAM_CALENDAR.filter((e) => e.status === "confirmed");

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//easyPhoto//Exam Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:easyPhoto exam calendar",
  ];

  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@easyphoto.in`,
      // A stable stamp (the verification date) keeps the build deterministic.
      `DTSTAMP:${icsDate(e.verifiedOn)}T000000Z`,
      `DTSTART;VALUE=DATE:${icsDate(e.startISO)}`,
      `DTEND;VALUE=DATE:${icsDateNext(e.startISO)}`,
      `SUMMARY:${e.name} — ${e.window}`,
      `DESCRIPTION:${e.event}. Photo & signature spec: ${SITE_URL}${e.specPath} (source: ${e.source.url})`,
      `URL:${SITE_URL}${e.specPath}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
}
