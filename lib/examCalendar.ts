/**
 * Exam calendar — upcoming notification windows and exam dates.
 * -------------------------------------------------------------
 * Same golden rule as the spec database: every entry comes from a board's
 * OFFICIAL annual calendar, carries its source and the date we confirmed it,
 * and is labelled confirmed (exact official date) or tentative (month-level
 * from the official calendar). A stale date is a trust-killer — update when
 * boards release calendars (~once a year each) and when notifications drop.
 *
 * No backend: the page renders statically and /exam-calendar/ics serves a
 * build-time .ics so users' OWN calendar apps do the reminding.
 */

export type CalendarStatus = "confirmed" | "tentative";

export interface ExamCalendarEntry {
  id: string;
  /** Display name, e.g. "SSC CHSL 2026". */
  name: string;
  /** What happens, e.g. "Tier 1 exam" or "Notification + application window". */
  event: string;
  /** Human-readable window, e.g. "13 September 2026" or "July – September 2026". */
  window: string;
  /**
   * Sort/ICS anchor: first day of the window (ISO). Tentative month-level
   * entries use the 1st of the month and are EXCLUDED from the .ics feed.
   */
  startISO: string;
  /** Exact-date entries get an all-day ICS event; month-level ones don't. */
  status: CalendarStatus;
  /** Our spec page for this exam (photo/signature sizes + resizer). */
  specPath: string;
  source: { url: string; label: string };
  verifiedOn: string; // ISO date we confirmed against the source
}

export const EXAM_CALENDAR: ExamCalendarEntry[] = [
  {
    id: "ssc-chsl-2026",
    name: "SSC CHSL 2026",
    event: "Tier 1 exam window (notification expected shortly before)",
    window: "July – September 2026",
    startISO: "2026-07-01",
    status: "tentative",
    specPath: "/exam-requirements/ssc/",
    source: {
      url: "https://ssc.gov.in/for-candidates/examination-calendar",
      label: "SSC examination calendar 2026-27 (ssc.gov.in)",
    },
    verifiedOn: "2026-06-12",
  },
  {
    id: "ibps-po-2026",
    name: "IBPS PO 2026",
    event: "Prelims exam (registration opens with the notification, ~July)",
    window: "22 – 23 August 2026",
    startISO: "2026-08-22",
    status: "confirmed",
    specPath: "/exam-requirements/ibps/",
    source: { url: "https://www.ibps.in", label: "IBPS calendar 2026-27 (ibps.in)" },
    verifiedOn: "2026-06-12",
  },
  {
    id: "upsc-nda2-2026",
    name: "UPSC NDA II 2026",
    event: "Written exam (applications closed 11 June)",
    window: "13 September 2026",
    startISO: "2026-09-13",
    status: "confirmed",
    specPath: "/exam-requirements/nda/",
    source: { url: "https://upsc.gov.in", label: "UPSC annual calendar (upsc.gov.in)" },
    verifiedOn: "2026-06-12",
  },
  {
    id: "upsc-cds2-2026",
    name: "UPSC CDS II 2026",
    event: "Written exam (applications closed 9 June)",
    window: "13 September 2026",
    startISO: "2026-09-13",
    status: "confirmed",
    specPath: "/exam-requirements/cds/",
    source: { url: "https://upsc.gov.in", label: "UPSC annual calendar (upsc.gov.in)" },
    verifiedOn: "2026-06-12",
  },
  {
    id: "ssc-gd-2027",
    name: "SSC GD Constable 2027",
    event: "Notification + application window",
    window: "September 2026 (exam January – March 2027)",
    startISO: "2026-09-01",
    status: "tentative",
    specPath: "/exam-requirements/ssc/",
    source: {
      url: "https://ssc.gov.in/for-candidates/examination-calendar",
      label: "SSC examination calendar 2026-27 (ssc.gov.in)",
    },
    verifiedOn: "2026-06-12",
  },
  {
    id: "ibps-clerk-2026",
    name: "IBPS Clerk (CSA) 2026",
    event: "Prelims exam (registration opens with the notification)",
    window: "10 – 11 October 2026",
    startISO: "2026-10-10",
    status: "confirmed",
    specPath: "/exam-requirements/ibps/",
    source: { url: "https://www.ibps.in", label: "IBPS calendar 2026-27 (ibps.in)" },
    verifiedOn: "2026-06-12",
  },
  {
    id: "ibps-rrb-officer-2026",
    name: "IBPS RRB Officer Scale I 2026",
    event: "Prelims exam",
    window: "21 – 22 November 2026",
    startISO: "2026-11-21",
    status: "confirmed",
    specPath: "/exam-requirements/ibps/",
    source: { url: "https://www.ibps.in", label: "IBPS calendar 2026-27 (ibps.in)" },
    verifiedOn: "2026-06-12",
  },
  {
    id: "ibps-rrb-clerk-2026",
    name: "IBPS RRB Clerk 2026",
    event: "Prelims exam",
    window: "6, 12 – 13 December 2026",
    startISO: "2026-12-06",
    status: "confirmed",
    specPath: "/exam-requirements/ibps/",
    source: { url: "https://www.ibps.in", label: "IBPS calendar 2026-27 (ibps.in)" },
    verifiedOn: "2026-06-12",
  },
];

/** Entries sorted by start date (the page renders upcoming-first). */
export function calendarSorted(): ExamCalendarEntry[] {
  return [...EXAM_CALENDAR].sort((a, b) => a.startISO.localeCompare(b.startISO));
}
