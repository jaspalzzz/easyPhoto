import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const privacy = fs.readFileSync(path.join(root, "app/privacy/page.tsx"), "utf8");
const headers = fs.readFileSync(path.join(root, "public/_headers"), "utf8");
const runtimeSources = [
  fs.readFileSync(path.join(root, "lib/faceDetection.ts"), "utf8"),
  fs.readFileSync(path.join(root, "lib/ocr.ts"), "utf8"),
  fs.readFileSync(path.join(root, "lib/segmentation.ts"), "utf8"),
].join("\n");

const disclosedHosts = [
  "cdn.jsdelivr.net",
  "storage.googleapis.com",
  "models.easyphoto.in",
  "huggingface.co",
] as const;

describe("privacy network-host disclosure", () => {
  it("names every model/runtime host used by the browser and permitted by CSP", () => {
    for (const host of disclosedHosts) {
      expect(runtimeSources, host + " is used by runtime code").toContain(host);
      expect(headers, host + " is permitted by CSP").toContain(host);
    }

    expect(privacy).toContain("jsDelivr");
    expect(privacy).toContain("Google Cloud Storage");
    expect(privacy).toContain("models.easyphoto.in");
    expect(privacy).toContain("Hugging Face");
  });

  it("does not disclose the obsolete staticimgly host", () => {
    expect(headers).not.toContain("staticimgly.com");
    expect(privacy).not.toContain("staticimgly.com");
  });

  // Owner decision, 14 Oct 2026 (option B): ads may run on photo tools, below
  // the result; ID-document and PDF pages never load the ad scripts
  // (lib/adExclusions.ts, test/adExclusions.test.ts).
  it("discloses AdSense cookies, where ads run, and the ad-free document pages", () => {
    expect(privacy).toContain("Google AdSense");
    expect(privacy).toContain("use cookies or similar technologies");
    expect(privacy).toMatch(/never\s+inside\s+the\s+upload,\s+preview\s+or\s+download\s+area/);
    expect(privacy).toMatch(/Pages\s+for\s+ID\s+documents\s+and\s+PDFs/);
    expect(privacy).toMatch(/never\s+load\s+Google&apos;s\s+advertising\s+or\s+consent\s+scripts/);
  });

  it("documents the regional consent flow and keeps its required hosts constrained", () => {
    expect(privacy).toContain("European Economic Area");
    expect(privacy).toContain("United Kingdom");
    expect(privacy).toContain("Switzerland");
    expect(privacy).toContain("Privacy and cookie settings");

    const csp = headers.match(/Content-Security-Policy: ([^\n]+)/)?.[1] || "";
    for (const directive of ["script-src", "frame-src", "connect-src"]) {
      const value = csp.match(new RegExp(`${directive} ([^;]+)`))?.[1] || "";
      expect(value).toContain("https://fundingchoicesmessages.google.com");
      expect(value).not.toContain("*.google.com");
    }
    const imageSources = csp.match(/img-src ([^;]+)/)?.[1] || "";
    expect(imageSources).toContain("https://ep1.adtrafficquality.google");
    expect(imageSources).not.toContain("*.adtrafficquality.google");
    expect(headers).toContain("Referrer-Policy: strict-origin-when-cross-origin");
    expect(headers).not.toContain("Referrer-Policy: no-referrer");
  });
});
