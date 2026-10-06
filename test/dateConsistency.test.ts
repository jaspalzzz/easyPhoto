/**
 * Visible dates, `dateModified` and sitemap `lastmod` agree (CLAUDE.md §2).
 *
 * Google uses lastmod only "if it's consistently and verifiably accurate", and
 * asks that a page's visible date and its structured date match. The 6 Oct 2026
 * guideline audit found blog posts saying "Last reviewed: 12 July 2026" while
 * their BlogPosting dateModified and sitemap lastmod said 3–10 June. None of
 * them claimed to be fresher than they were, but the signals disagreed.
 *
 * - Blog posts: the visible "Last reviewed/updated" date, the BlogPosting
 *   dateModified (updatedISO ?? dateISO, as BlogPostLayout emits it) and the
 *   sitemap lastmod must be one date. Today's disagreements are recorded in
 *   test/fixtures/quality/date-exceptions.json and may only be resolved.
 * - Every date that feeds lastmod is a real ISO date, never in the future.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { BLOG_POSTS } from "@/lib/blog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { SITE_URL } from "@/lib/site";
import { explain, ratchetExceptions, readFixture } from "@/scripts/quality/ratchet.mjs";

const FIXTURE = "date-exceptions.json";
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Today in UTC, the latest date any lastmod may claim. */
const today = () => new Date().toISOString().slice(0, 10);

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function iso(year: string, monthName: string, day: string): string {
  const month = MONTHS.findIndex((name) => name.toLowerCase() === monthName.toLowerCase()) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * The page-level review date a post shows its reader: "Last reviewed: 12 July
 * 2026", "Last updated July 12, 2026". Dates attached to something else (a
 * competitor fact "checked 19 July 2026") are not the page's date.
 */
export function visibleReviewDate(source: string): string | null {
  const label = String.raw`Last\s+(?:reviewed|updated)\s*:?\s*`;
  const dayFirst = source.match(new RegExp(`${label}(\\d{1,2})\\s+(${MONTHS.join("|")})\\s+(\\d{4})`, "i"));
  if (dayFirst) return iso(dayFirst[3], dayFirst[2], dayFirst[1]);
  const monthFirst = source.match(new RegExp(`${label}(${MONTHS.join("|")})\\s+(\\d{1,2}),?\\s+(\\d{4})`, "i"));
  if (monthFirst) return iso(monthFirst[3], monthFirst[1], monthFirst[2]);
  return null;
}

export function currentBlogDateDisagreements(): Record<string, Record<string, string>> {
  const lastmod = new Map(sitemap().map((entry) => [entry.url.replace(SITE_URL, ""), String(entry.lastModified)]));
  const out: Record<string, Record<string, string>> = {};
  for (const post of BLOG_POSTS) {
    const file = path.join("app", "blog", post.slug, "page.tsx");
    const visible = fs.existsSync(file) ? visibleReviewDate(fs.readFileSync(file, "utf8")) : null;
    const dates = {
      ...(visible ? { visible } : {}),
      dateModified: post.updatedISO ?? post.dateISO,
      lastmod: lastmod.get(`/blog/${post.slug}/`) ?? "not in sitemap",
    };
    if (new Set(Object.values(dates)).size > 1) out[post.slug] = dates;
  }
  return out;
}

describe("dates agree and never run ahead", () => {
  it("reads both visible date styles", () => {
    expect(visibleReviewDate("<p>Last reviewed: 12 July 2026</p>")).toBe("2026-07-12");
    expect(visibleReviewDate("Last updated July 1, 2026 ·")).toBe("2026-07-01");
    expect(visibleReviewDate("Pricing checked 19 July 2026")).toBeNull();
  });

  it("sitemap section constants in app/sitemap.ts are real dates, not in the future", () => {
    const source = fs.readFileSync(path.join("app", "sitemap.ts"), "utf8");
    const constants = [...source.matchAll(/^const\s+([A-Z_]+_UPDATED)\s*=\s*"([^"]*)"/gm)];
    expect(constants.length, "expected the per-section *_UPDATED constants").toBeGreaterThan(0);
    for (const [, name, value] of constants) {
      expect(isIsoDate(value), `${name} = "${value}" is not a YYYY-MM-DD date`).toBe(true);
      expect(value <= today(), `${name} = ${value} is after today (${today()}): never fake freshness`).toBe(true);
    }
  });

  it("every sitemap lastmod is a real date, not in the future", () => {
    for (const entry of sitemap()) {
      const value = String(entry.lastModified);
      expect(isIsoDate(value), `${entry.url} lastmod "${value}"`).toBe(true);
      expect(value <= today(), `${entry.url} lastmod ${value} is after today`).toBe(true);
    }
  });

  it("blog and spec dates are real, ordered and not in the future", () => {
    for (const post of BLOG_POSTS) {
      expect(isIsoDate(post.dateISO), `${post.slug} dateISO`).toBe(true);
      const [year, month, day] = post.dateISO.split("-");
      expect(post.date, `${post.slug}: the visible publish date must be dateISO`).toBe(
        `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`
      );
      if (post.updatedISO) {
        expect(isIsoDate(post.updatedISO), `${post.slug} updatedISO`).toBe(true);
        expect(post.updatedISO >= post.dateISO, `${post.slug} updated before it was published`).toBe(true);
        expect(post.updatedISO <= today(), `${post.slug} updatedISO is in the future`).toBe(true);
      }
    }
    for (const [id, spec] of Object.entries(PORTAL_PRESETS)) {
      if (!spec.verifiedOn) continue;
      expect(isIsoDate(spec.verifiedOn), `${id} verifiedOn`).toBe(true);
      expect(spec.verifiedOn <= today(), `${id} verifiedOn is in the future`).toBe(true);
    }
  });

  it("a blog post's visible review date, dateModified and lastmod agree (recorded exceptions only shrink)", () => {
    const problems = ratchetExceptions({
      fixture: FIXTURE,
      section: "blogDates",
      what: "blog date disagreement (visible / dateModified / lastmod)",
      current: currentBlogDateDisagreements(),
      allowed: readFixture(FIXTURE).blogDates,
    });
    expect(problems, explain(problems)).toEqual([]);
  });
});
