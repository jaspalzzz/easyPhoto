import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";
import { SUB_EXAM_SLUGS } from "@/lib/subExamResizers";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
import { MAKER_PAGES } from "@/lib/makerPages";
import { READY_TOOLS } from "@/lib/toolsCatalog";

describe("Sitemap Integrity & SEO Compliance", () => {
  const generatedSitemap = sitemap();

  it("returns a non-empty array of sitemap objects", () => {
    expect(generatedSitemap).toBeDefined();
    expect(Array.isArray(generatedSitemap)).toBe(true);
    expect(generatedSitemap.length).toBeGreaterThan(50); // Should have a large set of routes
  });

  it("verifies all sitemap URLs start with the canonical SITE_URL", () => {
    generatedSitemap.forEach((item) => {
      expect(item.url).toBeDefined();
      expect(item.url.startsWith(SITE_URL)).toBe(true);
    });
  });

  it("ensures all sitemap URLs carry a trailing slash (SEO alignment)", () => {
    generatedSitemap.forEach((item) => {
      // The site uses trailingSlash: true.
      // Every canonical link in the sitemap must end with a trailing slash to prevent duplicate indexing.
      expect(item.url.endsWith("/")).toBe(true);
    });
  });

  it("checks that there are no duplicate URLs in the sitemap", () => {
    const urls = generatedSitemap.map((item) => item.url);
    const uniqueUrls = new Set(urls);
    expect(urls.length).toBe(uniqueUrls.size);
  });

  it("verifies sitemap priorities are set within the correct SEO range [0.1, 1.0]", () => {
    generatedSitemap.forEach((item) => {
      expect(item.priority).toBeDefined();
      expect(item.priority).toBeGreaterThanOrEqual(0.1);
      expect(item.priority).toBeLessThanOrEqual(1.0);
    });
  });

  it("ensures sitemap priorities follow the search priority hierarchy", () => {
    generatedSitemap.forEach((item) => {
      const path = item.url.replace(SITE_URL, "");
      if (path === "/") {
        expect(item.priority).toBe(1.0); // Homepage is priority 1.0
      } else if (path.startsWith("/tools/")) {
        expect(item.priority).toBe(0.7); // Utility tools are secondary search category
      } else {
        expect(item.priority).toBe(0.8); // Spec pages, passport country guides, and sub-exams get 0.8
      }
    });
  });

  it("confirms all dynamic sub-exam resizer pages are registered in the sitemap", () => {
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    SUB_EXAM_SLUGS.forEach((slug) => {
      expect(sitemapPaths).toContain(`/exam-resizer/${slug}/`);
    });
  });

  it("confirms all country maker pages are registered in the sitemap", () => {
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    MAKER_PAGES.forEach((m) => {
      expect(sitemapPaths).toContain(`/${m.slug}/`);
    });
  });

  it("confirms all Hinglish dynamic pages are registered in the sitemap", () => {
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    HINGLISH_SLUGS.forEach((slug) => {
      expect(sitemapPaths).toContain(`/${slug}/`);
    });
  });

  it("confirms all core tools listed in ready tools are registered in the sitemap", () => {
    const sitemapPaths = generatedSitemap.map((item) => item.url.replace(SITE_URL, ""));
    READY_TOOLS.forEach((tool) => {
      expect(sitemapPaths).toContain(`/tools/${tool.slug}/`);
    });
  });
});
