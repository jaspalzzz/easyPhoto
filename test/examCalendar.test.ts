import { describe, expect, it } from "vitest";
import { EXAM_CALENDAR, calendarUpcoming } from "@/lib/examCalendar";

describe("exam calendar", () => {
  it("gives every entry an end date on or after its start", () => {
    for (const e of EXAM_CALENDAR) {
      expect(e.endISO, e.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.endISO >= e.startISO, e.id).toBe(true);
    }
  });

  it("never lists a window that has already closed as upcoming", () => {
    const on = new Date("2026-10-15T00:00:00Z");
    const ids = calendarUpcoming(on).map((e) => e.id);
    for (const e of EXAM_CALENDAR) {
      if (e.endISO < "2026-10-15") expect(ids, `${e.id} ended ${e.endISO}`).not.toContain(e.id);
      else expect(ids, e.id).toContain(e.id);
    }
  });

  it("keeps a window on its last day and drops it the day after", () => {
    const last = EXAM_CALENDAR.find((e) => e.id === "ibps-clerk-2026")!;
    expect(calendarUpcoming(new Date(`${last.endISO}T12:00:00Z`)).map((e) => e.id)).toContain(last.id);
    expect(calendarUpcoming(new Date("2026-10-12T00:00:00Z")).map((e) => e.id)).not.toContain(last.id);
  });
});
