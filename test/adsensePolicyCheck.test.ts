import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Findings of the 2 Nov 2026 check of the site against Google's AdSense
// Program policies and Publisher Policies.
const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("AdSense policy check", () => {
  // "Enabling dishonest behaviour": a tool that sets any typed name in a
  // handwriting font and stamps it on an image can be read as forging a
  // signature. Forms also need the applicant's real handwriting.
  it("offers no typed-name signature", () => {
    expect(fs.existsSync(path.join(root, "components/tools/TypedSignature.tsx"))).toBe(false);
    const pad = read("components/tools/SignaturePad.tsx");
    expect(pad).not.toContain('setActiveTab("type")');
    expect(pad).not.toContain("Type Name");

    const copy = [
      read("app/tools/sign-image/page.tsx"),
      read("lib/faqs.ts"),
      read("lib/toolsCatalog.ts"),
    ].join("\n");
    expect(copy).not.toMatch(/type your name in a handwriting style|draw, type or upload/i);
  });

  // AdSense privacy disclosures: cookies, web beacons and IP addresses, plus
  // Google's page on how it uses data from partner sites.
  it("privacy policy names web beacons, IP addresses and Google's partner-sites page", () => {
    const privacy = read("app/privacy/page.tsx");
    expect(privacy).toContain("web beacons");
    expect(privacy).toContain("IP address");
    expect(privacy).toContain("https://policies.google.com/technologies/partner-sites");
  });
});
