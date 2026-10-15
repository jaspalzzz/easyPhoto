/**
 * Keyword map, batch 2 (owner-approved 15 Oct 2026): each page answers the
 * searches Google already sends it, in searchers' words.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SIGNATURE_FAQ } from "@/lib/faqs";

const read = (slug: string) => fs.readFileSync(path.join("app", "tools", slug, "page.tsx"), "utf8");

describe("aadhaar-ocr", () => {
  const page = read("aadhaar-ocr");
  it("answers the photo / JPG searches with the existing tools, in order", () => {
    expect(page).toContain("Need the photo from your Aadhaar card, or the card as a JPG?");
    expect(page).toMatch(/\/unlock-aadhaar-pdf\/[\s\S]*\/tools\/pdf-to-jpg\/[\s\S]*\/tools\/image-crop\//);
  });
});

describe("face-centering", () => {
  const page = read("face-centering");
  it("is titled for the messages forms show", () => {
    expect(page).toContain('title: "Center Your Face in a Photo — Check Position & Head Tilt"');
    expect(page).toContain('title="Center Your Face in the Photo"');
    expect(page).toMatch(/Face is tilted[\s\S]*Position your face in the center/);
  });
});

describe("resume-photo", () => {
  it("uses resume, CV and biodata searchers' words", () => {
    const page = read("resume-photo");
    expect(page).toContain('title: "Resume Photo Maker — Passport Size Photo for CV & Biodata"');
    expect(page).toContain('title="Resume & CV Photo Maker"');
  });
});

describe("signature-resize", () => {
  const page = read("signature-resize");
  it("has its own how-to and an H1 in searchers' words", () => {
    expect(page).toContain('title="Resize Signature Online"');
    expect(page).toContain("Make your signature fit the form&apos;s KB or pixel limit");
  });

  it("leaves background removal and cropping to their own pages, and drops a retired-tool answer", () => {
    const qs = SIGNATURE_FAQ.map((f) => f.q);
    expect(qs).not.toContain("How do I remove the background from a signature?");
    expect(qs).not.toContain("How do I crop my signature?");
    expect(SIGNATURE_FAQ.some((f) => /signature-to-20KB tool/.test(f.a))).toBe(false);
  });
});
