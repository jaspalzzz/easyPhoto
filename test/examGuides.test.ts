/**
 * Guards the exam-page → blog-guide map.
 *
 * These links are emitted on all 52 exam-requirement pages, so a slug that
 * drifts out of the blog registry becomes 52 dead internal links at once —
 * exactly what happened in reverse when a merged post left stale references
 * behind. The map is also an accuracy surface: offering a "cross-exam" guide on
 * a passport or voter-ID page would tell the reader something untrue, so the
 * category scoping is asserted here rather than left to review.
 */
import { describe, it, expect } from "vitest";
import { BLOG_POSTS } from "@/lib/blog";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { portalCategory } from "@/lib/specRegistry";
import { examGuideLinks } from "@/lib/examGuides";

const SLUGS = new Set(BLOG_POSTS.map((p) => p.slug));

describe("exam guide links", () => {
  it("every guide slug exists in the blog registry", () => {
    const missing = PORTAL_KEYS.flatMap((exam) =>
      examGuideLinks(exam)
        .filter((g) => !SLUGS.has(g.slug))
        .map((g) => `${exam} → ${g.slug}`)
    );
    expect(missing).toEqual([]);
  });

  it("never offers the cross-exam guide on a non-exam document page", () => {
    const wrong = PORTAL_KEYS.filter(
      (exam) =>
        portalCategory(exam) === "visa" &&
        examGuideLinks(exam).some((g) => g.slug === "exam-photo-signature-size-guide")
    );
    expect(wrong).toEqual([]);
  });

  it("only offers the name/date guide when the spec records that requirement", () => {
    const wrong = PORTAL_KEYS.filter((exam) => {
      const spec = PORTAL_PRESETS[exam];
      const offered = examGuideLinks(exam).some(
        (g) => g.slug === "add-name-date-on-exam-photo"
      );
      const required = Boolean(spec?.requiresNameDate || spec?.requiresSlateNameDate);
      return offered !== required;
    });
    expect(wrong).toEqual([]);
  });

  it("emits no duplicate slug on a single page", () => {
    const dupes = PORTAL_KEYS.filter((exam) => {
      const slugs = examGuideLinks(exam).map((g) => g.slug);
      return new Set(slugs).size !== slugs.length;
    });
    expect(dupes).toEqual([]);
  });

  it("covers the overwhelming majority of exam pages (guard is not vacuous)", () => {
    const withGuides = PORTAL_KEYS.filter((exam) => examGuideLinks(exam).length > 0);
    expect(withGuides.length).toBeGreaterThan(PORTAL_KEYS.length * 0.9);
  });
});
