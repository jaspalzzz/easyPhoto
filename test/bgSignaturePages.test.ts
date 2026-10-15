/**
 * Background and signature pages, each with its own job (owner-approved
 * 15 Oct 2026). The two signature pages load the same tool, so their wording
 * decides which searches each one answers.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BACKGROUND_REMOVER_FAQ, SIGNATURE_BG_REMOVAL_FAQ } from "@/lib/faqs";

const read = (slug: string) => fs.readFileSync(path.join("app", "tools", slug, "page.tsx"), "utf8");
const bg = read("background-removal");
const sigBg = read("signature-background-removal");
const cleaner = read("signature-cleaner");
const depth = fs.readFileSync(path.join("components", "tools", "ToolDepth.tsx"), "utf8");

describe("remove background from photo or image", () => {
  it("uses searchers' words in the title and heading", () => {
    expect(bg).toContain('title: "Remove Background from Image or Photo — Free, No Upload"');
    expect(bg).toContain('title="Remove Background from Photo or Image"');
  });

  it("sends white-background and signature jobs to the right tools, once", () => {
    expect(bg).toContain('href="/tools/white-background/"');
    expect(bg).toContain('href="/tools/signature-background-removal/"');
    const qs = BACKGROUND_REMOVER_FAQ.map((f) => f.q);
    expect(qs).not.toContain("How do I add a white background to a photo?");
    expect(qs).not.toContain("How do I remove the background from a signature?");
  });
});

describe("remove background from signature", () => {
  it("leads with the search and both outputs", () => {
    expect(sigBg).toContain('title: "Remove Background from Signature — White or Transparent"');
    expect(sigBg).toContain('title="Remove Background from Signature"');
    expect(sigBg).toMatch(/Solid White JPG[\s\S]*Transparent PNG/);
  });

  it("no longer sends white-JPG users to another tool, since this one makes it", () => {
    const entry = depth.slice(depth.indexOf('"signature-background-removal": {'), depth.indexOf('"transparent-signature": {'));
    expect(entry).not.toContain("flattened JPEG on white");
    const a = SIGNATURE_BG_REMOVAL_FAQ.find((f) => f.q === "How do I remove the background from a signature?")!.a;
    expect(a).toContain("white or transparent background");
  });
});

describe("signature cleaner", () => {
  it("is about a phone photo becoming a form signature, and links background-only jobs away", () => {
    expect(cleaner).toContain("phone photo of your signature");
    expect(cleaner).not.toMatch(/remove the paper background|white-background JPG or transparent PNG/);
    expect(cleaner).toContain('href="/tools/signature-background-removal/"');
  });
});
