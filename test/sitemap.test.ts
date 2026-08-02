import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";
import { SUB_EXAM_SLUGS } from "@/lib/subExamResizers";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
import { MAKER_PAGES } from "@/lib/makerPages";
import { isDeindexed } from "@/lib/deindexed";
import { READY_TOOLS } from "@/lib/toolsCatalog";

describe("Sitemap Integrity & SEO Compliance", () => {
  const generatedSitemap = sitemap();

  it("returns a non-empty array of sitemap objects", () => {
    expect(generatedSitemap).toBeDefined();
    expect(Array.isArray(generatedSitemap)).toBe(true);
    expect(generatedSitemap.length).toBeGreaterThan(50);
  });

  it("verifies all sitemap URLs start with the canonical SITE_URL", () => {
    generatedSitemap.forEach((item) => {
      expect(item.url).toBeDefined();
      expect(item.url.startsWith(SITE_URL)).toBe(true);
    });
  });

  it("ensures all sitemap URLs carry a trailing slash (SEO alignment)", () => {
    // The site uses trailingSlash: true. Every canonical link must end with /
    // to prevent duplicate indexing of /foo and /foo/.
    generatedSitemap.forEach((item) => {
      expect(item.url.endsWith("/")).toBe(true);
    });
  });

  it("checks that there are no duplicate URLs in the sitemap", () => {
    const urls = generatedSitemap.map((item) => item.url);
    const uniqueUrls = new Set(urls);
    expect(urls.length).toBe(uniqueUrls.size);
  });

  // Priority and changeFrequency are deliberately omitted — Google ignores both
  // fields, and omitting them keeps the sitemap lean. These two assertions
  // replace the old "priority hierarchy" tests which expected the removed fields.
  it("sitemap entries do not include priority (intentionally omitted)", () => {
    generatedSitemap.forEach((item) => {
      expect((item as Record<string, unknown>).priority).toBeUndefined();
    });
  });

  it("sitemap entries do not include changeFrequency (intentionally omitted)", () => {
    generatedSitemap.forEach((item) => {
      expect((item as Record<string, unknown>).changeFrequency).toBeUndefined();
    });
  });

  // Sub-exam resizer pages (/exam-resizer/<slug>/) and Hinglish landing pages
  // are noindex — they are intentionally excluded from the sitemap to avoid
  // thin/duplicate content signals. These tests document that decision.
  it("sub-exam resizer pages are excluded from the sitemap (noindex policy)", () => {
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    SUB_EXAM_SLUGS.forEach((slug) => {
      expect(sitemapPaths).not.toContain(`/exam-resizer/${slug}/`);
    });
  });

  it("Hinglish pages are excluded from the sitemap (noindex policy)", () => {
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    HINGLISH_SLUGS.forEach((slug) => {
      expect(sitemapPaths).not.toContain(`/${slug}/`);
    });
  });

  it("confirms all country maker pages are registered in the sitemap", () => {
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    MAKER_PAGES.forEach((m) => {
      expect(sitemapPaths).toContain(`/${m.slug}/`);
    });
  });

  it("registers every ready tool in the sitemap unless it is deliberately deindexed", () => {
    // Previously asserted that EVERY ready tool is listed. 34 thin, no-traffic
    // tools are now intentionally out of the index (see lib/deindexed.ts) while
    // staying live and linked, so the rule is "listed OR deindexed" — a tool
    // that is neither has been dropped by accident.
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    READY_TOOLS.forEach((tool) => {
      const route = `/tools/${tool.slug}/`;
      const listed = sitemapPaths.includes(route);
      expect(
        listed !== isDeindexed(route),
        listed
          ? `${route} is deindexed but still in the sitemap`
          : `${route} vanished from the sitemap without being deindexed`,
      ).toBe(true);
    });
  });
});
