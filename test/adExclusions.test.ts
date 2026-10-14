import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ISOLATED_PATHS,
  isAdSenseExcludedPath,
  isIsolatedPath,
  isPrivateAdFreePath,
} from "@/lib/adExclusions";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
import { MAKER_PAGES } from "@/lib/makerPages";
import { READY_TOOLS, categoryOf } from "@/lib/toolsCatalog";

/**
 * The ad policy (owner decision, 14 Oct 2026, option B): ads may run on
 * articles, guides, exam pages and photo tools; never on private pages (ID
 * documents, PDFs, text recognition, legal pages: the privacy-policy promise),
 * never on the AI pages that send COEP (ad frames can't load there), and never
 * on noindexed duplicates or embeds.
 */

const APP_DIR = path.join(process.cwd(), "app");
const HEADERS = fs.readFileSync(path.join(process.cwd(), "public", "_headers"), "utf8");

/** Paths whose rule in public/_headers sets Cross-Origin-Embedder-Policy. */
function coepRules(): string[] {
  const rules: string[] = [];
  let current: string | null = null;
  for (const line of HEADERS.split("\n")) {
    if (/^\S/.test(line) && !line.startsWith("#")) current = line.trim();
    else if (current && /^\s+Cross-Origin-Embedder-Policy:/.test(line)) rules.push(current);
  }
  return rules;
}

function matches(rule: string, route: string): boolean {
  const re = new RegExp(`^${rule.split("*").map((p) => p.replace(/[.?+^$()[\]{}|\\/]/g, "\\$&")).join(".*")}$`);
  return re.test(route);
}

describe("ad policy: private pages stay ad-free", () => {
  it("covers every PDF, document and text-recognition tool", () => {
    const privateCategories = new Set(["pdf", "document", "ocr"]);
    const missing = READY_TOOLS.filter((t) => privateCategories.has(categoryOf(t.slug)?.slug ?? ""))
      .map((t) => `/tools/${t.slug}/`)
      .filter((route) => !isPrivateAdFreePath(route));
    expect(missing).toEqual([]);
  });

  it("covers ID documents, PAN and the legal pages", () => {
    for (const route of [
      "/unlock-aadhaar-pdf/",
      "/aadhaar-photo/",
      "/exam-requirements/pan/",
      "/privacy/",
      "/terms/",
      "/disclaimer/",
      "/contact/",
      "/about/",
    ]) {
      expect(isPrivateAdFreePath(route), route).toBe(true);
      expect(isAdSenseExcludedPath(route), route).toBe(true);
    }
  });
});

describe("ad policy: AI pages are isolated, and public/_headers agrees", () => {
  it("isolates every page that mounts the background-removal engine or hands a photo to it", () => {
    const AI_IMPORT =
      /@\/components\/(?:tool\/PhotoTool|tools\/(?:BackgroundRemovalTool|WhiteBackgroundTool)|site\/HeroStarter)/;
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(file);
        else if (entry.name === "page.tsx" && AI_IMPORT.test(fs.readFileSync(file, "utf8"))) {
          const rel = path.relative(APP_DIR, file).replace(/\\/g, "/").replace(/\/?page\.tsx$/, "");
          const routes =
            rel === "[maker]" ? MAKER_PAGES.map((m) => `/${m.slug}/`) : [rel ? `/${rel}/` : "/"];
          offenders.push(...routes.filter((r) => !isIsolatedPath(r) && !HINGLISH_SLUGS.includes(r.slice(1, -1))));
        }
      }
    };
    walk(APP_DIR);
    expect(offenders).toEqual([]);
  });

  it("sends COEP on exactly the isolated pages", () => {
    const rules = coepRules();
    expect(rules).not.toContain("/*");
    const uncovered = ISOLATED_PATHS.filter((route) => !rules.some((rule) => matches(rule, route)));
    expect(uncovered).toEqual([]);
    // Every COEP rule must describe an isolated page, so no ad page loses its ads.
    const strays = rules.filter((rule) => !ISOLATED_PATHS.some((route) => matches(rule, route)));
    expect(strays).toEqual([]);
  });

  it("sends no site-wide cross-origin isolation", () => {
    const siteWide = HEADERS.split(/\n(?=\S)/).find((block) => block.startsWith("/*\n"));
    expect(siteWide).toBeDefined();
    expect(siteWide).not.toMatch(/Cross-Origin-(?:Embedder|Opener)-Policy/);
  });
});

describe("ad policy: ads may run where most visitors land", () => {
  it("allows the photo tools, signature tools and exam pages", () => {
    for (const route of [
      "/tools/resize-kb/",
      "/tools/sign-image/",
      "/tools/photo-signature-merge/",
      "/tools/photo-with-name-date/",
      "/tools/signature-resize/",
      "/exam-requirements/ssc/",
      "/exam-requirements/voter-id/",
      "/blog/how-to-take-a-passport-photo-at-home/",
    ]) {
      expect(isAdSenseExcludedPath(route), route).toBe(false);
    }
  });

  it("keeps noindexed duplicates and embeds ad-free", () => {
    for (const slug of HINGLISH_SLUGS) expect(isAdSenseExcludedPath(`/${slug}/`)).toBe(true);
    expect(isAdSenseExcludedPath("/embed/exam-spec/ssc/")).toBe(true);
    expect(isAdSenseExcludedPath("/exam-resizer/ssc-cgl/")).toBe(true);
    expect(isAdSenseExcludedPath("/tools/form-resizer/ssc/")).toBe(true);
  });
});
