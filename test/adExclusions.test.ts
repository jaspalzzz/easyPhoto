import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isAdSenseExcludedPath } from "@/lib/adExclusions";
import { CONVERT_SLUGS } from "@/lib/convertPairs";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
import { MAKER_PAGES } from "@/lib/makerPages";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { SUB_EXAM_SLUGS } from "@/lib/subExamResizers";

const APP_DIR = path.join(process.cwd(), "app");
const WORKSPACE_IMPORT =
  /@\/components\/(?:tool\/(?:PhotoTool|Uploader)|tools\/(?:[A-Za-z]+Tool|ExamResizerSteps|PortalResizer|DocPhotoResizerPage)|site\/(?:DocPhotoLanding|HeroStarter))/;

function pageFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return pageFiles(absolute);
    return entry.name === "page.tsx" ? [absolute] : [];
  });
}

function routeForPage(file: string): string {
  const relative = path.relative(APP_DIR, file).replace(/\\/g, "/");
  const route = relative.replace(/\/page\.tsx$/, "");
  return route ? `/${route}/` : "/";
}

function concreteRoutes(file: string): string[] {
  const route = routeForPage(file);
  if (!route.includes("[")) return [route];
  if (route === "/[maker]/") {
    return MAKER_PAGES.map((maker) => `/${maker.slug}/`);
  }
  if (route === "/convert/[pair]/") {
    return CONVERT_SLUGS.map((slug) => `/convert/${slug}/`);
  }
  if (route === "/exam-requirements/[exam]/") {
    return PORTAL_KEYS.map((portalId) => `/exam-requirements/${portalId}/`);
  }
  if (route === "/exam-resizer/[exam]/") {
    return SUB_EXAM_SLUGS.map((slug) => `/exam-resizer/${slug}/`);
  }
  // Dynamic tool routes are covered by the /tools/ policy boundary.
  if (route.startsWith("/tools/")) return [route.replace(/\[[^/]+\]/g, "fixture")];
  throw new Error(`Add a concrete route expansion for upload page ${route}`);
}

describe("AdSense upload/result exclusions", () => {
  it("excludes every source page that directly mounts a file workspace", () => {
    const workspacePages = pageFiles(APP_DIR).filter((file) =>
      WORKSPACE_IMPORT.test(fs.readFileSync(file, "utf8"))
    );
    const uncovered = workspacePages.flatMap((file) =>
      concreteRoutes(file)
        .filter((route) => !isAdSenseExcludedPath(route))
        .map((route) => `${path.relative(process.cwd(), file)} -> ${route}`)
    );

    expect(workspacePages.length).toBeGreaterThan(0);
    expect(uncovered).toEqual([]);
  });

  it("derives generated maker, Hinglish, convert, exam and sub-exam exclusions", () => {
    for (const maker of MAKER_PAGES) {
      expect(isAdSenseExcludedPath(`/${maker.slug}/`)).toBe(true);
    }
    for (const slug of HINGLISH_SLUGS) {
      expect(isAdSenseExcludedPath(`/${slug}/`)).toBe(true);
    }
    for (const slug of CONVERT_SLUGS) {
      expect(isAdSenseExcludedPath(`/convert/${slug}/`)).toBe(true);
    }
    for (const portalId of PORTAL_KEYS) {
      expect(isAdSenseExcludedPath(`/exam-requirements/${portalId}/`)).toBe(true);
      expect(isAdSenseExcludedPath(`/${portalId}-photo-resizer/`)).toBe(true);
      expect(isAdSenseExcludedPath(`/${portalId}-signature-resizer/`)).toBe(true);
    }
    for (const slug of SUB_EXAM_SLUGS) {
      expect(isAdSenseExcludedPath(`/exam-resizer/${slug}/`)).toBe(true);
    }
  });

  it("keeps existing tool and embed family exclusions intact", () => {
    expect(isAdSenseExcludedPath("/tools/resize-kb/")).toBe(true);
    expect(isAdSenseExcludedPath("/embed/exam-spec/ssc/")).toBe(true);
    expect(isAdSenseExcludedPath("/exam-resizer/ssc-cgl/")).toBe(true);
    expect(isAdSenseExcludedPath("/blog/how-to-take-a-passport-photo-at-home/")).toBe(false);
  });
});
