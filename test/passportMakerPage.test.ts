/**
 * /passport-photo/ answers "passport size photo maker" (a 35×45 mm photo for
 * any form) instead of opening with "you don't need a photo" (owner-approved
 * 15 Oct 2026). The Passport Seva fact stays in the FAQ, said once.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PASSPORT_FAQ } from "@/lib/faqs";

const page = fs.readFileSync(path.join("app", "passport-photo", "page.tsx"), "utf8");
const nameDate = fs.readFileSync(path.join("app", "tools", "photo-with-name-date", "page.tsx"), "utf8");

describe("passport size photo maker page", () => {
  it("is titled and headed in searchers' words", () => {
    expect(page).toContain('title: "Passport Size Photo Maker Online — 35×45 mm, White Background"');
    expect(page).toContain('h1="Passport Size Photo Maker"');
  });

  it("opens with making the photo, not with Passport Seva's centre capture", () => {
    const intro = page.match(/intro="([^"]+)"/)![1];
    expect(intro).toMatch(/^Make a passport size photo/);
    expect(intro).not.toMatch(/PSK|POPSK|biometrics/);
    expect(PASSPORT_FAQ.some((f) => /PSK\/POPSK/.test(f.a))).toBe(true);
  });

  it("links the print sheet, KB and name & date tools", () => {
    for (const href of ["/tools/print-sheet/", "/tools/resize-kb/", "/tools/photo-with-name-date/"]) {
      expect(page).toContain(`href="${href}"`);
    }
  });

  it("is linked from the name & date page, where Google sends plain passport searches today", () => {
    expect(nameDate).toContain('href="/passport-photo/"');
  });
});
