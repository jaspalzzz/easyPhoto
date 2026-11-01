/**
 * /tools/sign-image/: titled for both "sign on photo" and "sign on image"
 * searches, PNG uploads stay PNG, and the FAQ answers e-sign, PNG and app
 * questions (owner-approved 15 Oct 2026).
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SIGN_IMAGE_FAQ } from "@/lib/faqs";

const page = fs.readFileSync(path.join("app", "tools", "sign-image", "page.tsx"), "utf8");

describe("sign on photo / image page", () => {
  it("leads with both search phrasings in the title and heading", () => {
    expect(page).toContain('title: "Sign on Photo or Image Online — Add Signature to Photo"');
    expect(page).toContain('title="Sign on Photo or Image Online"');
  });

  it("answers the digital-signature, PNG and app questions", () => {
    const qs = SIGN_IMAGE_FAQ.map((f) => f.q);
    expect(qs).toEqual(
      expect.arrayContaining([
        "Is this a digital signature?",
        "Will my image stay a PNG?",
        "Do I need an app to sign on a photo?",
      ])
    );
  });

  it("points PDF signers to a PDF reader's Fill & Sign, not the hidden Sign PDF tool", () => {
    // /tools/sign-pdf/ is out of the index; indexed pages don't link it (AdSense, 1 Nov 2026).
    expect(page).toContain("Fill &amp; Sign");
    expect(page).not.toContain('href="/tools/sign-pdf/"');
  });
});
