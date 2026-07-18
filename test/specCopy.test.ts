/**
 * Guards a bug class rather than a single bug.
 *
 * photoWidthPx/photoHeightPx/sigWidthPx/sigHeightPx are optional: several
 * portals (UPSC, SSC, RRB) publish a KB band and no pixel requirement. Pages
 * that interpolated them directly rendered "undefined×undefinedpx" in body copy
 * and meta descriptions the moment a spec was re-verified and its unpublished
 * dimensions removed. That is not hypothetical — it shipped to five live pages.
 *
 * Re-verifying specs against their official sources is routine, so any page may
 * lose its dimensions at any time. Build copy from photoDimsPx()/sigDimsPx(),
 * which return null when the authority publishes nothing.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { allPortalSpecs, photoDimsPx, sigDimsPx } from "@/lib/specRegistry";
import { resizerMetaDescription, portalFaqItems } from "@/lib/faqs";
import { SUB_EXAM_RESIZERS } from "@/lib/subExamResizers";

const ROOTS = ["app", "components", "lib"];
const SOURCE_EXT = /\.(ts|tsx)$/;

/** The px fields used inside a `${...}` interpolation or JSX `{...}` expression. */
const DIRECT_USE = /\$\{[^}]*\.(?:photo|sig)(?:Width|Height)Px[^}]*\}/;

/** lib/specRegistry.ts owns the only legitimate read of these fields. */
const OWNER = join("lib", "specRegistry.ts");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return SOURCE_EXT.test(entry.name) ? [path] : [];
  });
}

describe("spec copy — pixel dimensions are never interpolated unguarded", () => {
  it("routes every px read through photoDimsPx/sigDimsPx", () => {
    const offenders: string[] = [];

    for (const root of ROOTS) {
      for (const file of sourceFiles(root)) {
        if (file === OWNER || file.endsWith(".test.ts")) continue;
        readFileSync(file, "utf8").split("\n").forEach((line, i) => {
          if (DIRECT_USE.test(line)) offenders.push(`${file}:${i + 1}`);
        });
      }
    }

    expect(
      offenders,
      `Interpolate photoDimsPx(spec)/sigDimsPx(spec) instead — these fields are ` +
        `undefined for portals that publish no pixel spec:\n  ${offenders.join("\n  ")}`
    ).toEqual([]);
  });
});

describe("spec copy — renders cleanly for every portal in the registry", () => {
  const specs = allPortalSpecs();

  it("covers portals that publish no pixel dimensions", () => {
    // If this ever hits zero the suite below stops testing the absent-px path,
    // which is the path that broke.
    expect(specs.filter((s) => photoDimsPx(s) === null).length).toBeGreaterThan(0);
  });

  it.each(specs.map((s) => [s.id, s] as const))(
    "%s: meta description and FAQs contain no undefined",
    (_id, spec) => {
      const copy = [
        resizerMetaDescription(spec, spec.name),
        ...portalFaqItems(spec).flatMap((f) => [f.q, f.a]),
      ].join("\n");
      expect(copy).not.toMatch(/undefined|null|NaN/);
    }
  );

  it("describes SSC's current live-photo workflow instead of a file-upload requirement", () => {
    const ssc = specs.find((s) => s.id === "ssc")!;
    const answers = portalFaqItems(ssc).map((f) => f.a).join("\n");
    expect(answers).toMatch(/live (?:photograph|capture)|live camera/i);
    expect(answers).toMatch(/rather than an ordinary prepared-photo upload/i);
    expect(answers).not.toMatch(/photo should be 20[–-]50 KB/i);
  });

  const liveCaptureIds = ["ssc", "rrb", "bpsc", "rpsc"];

  it("marks only the source-confirmed replacement live-photo workflows", () => {
    expect(
      specs
        .filter((spec) => spec.isLiveCapture)
        .map((spec) => spec.id)
        .sort()
    ).toEqual([...liveCaptureIds].sort());
  });

  it.each(liveCaptureIds)(
    "%s: live-photo FAQs never tell the candidate to upload a photo for the tool to resize",
    (id) => {
      const spec = specs.find((candidate) => candidate.id === id)!;
      const answers = portalFaqItems(spec).map((item) => item.a).join("\n");
      expect(answers).toMatch(/live[- ](?:photo|photograph)|live capture/i);
      expect(answers).not.toMatch(/upload your photo and the tool/i);
      expect(answers).not.toMatch(/upload(?:ing)?[^.]{0,80}photo[^.]{0,80}(?:resize|compress)/i);
    }
  );

  it("keeps every SSC sub-exam note on the live-photo workflow", () => {
    const notes = SUB_EXAM_RESIZERS.filter((item) => item.parentId === "ssc")
      .map((item) => item.note)
      .join("\n");
    expect(notes).toMatch(/live photograph capture/i);
    expect(notes).not.toMatch(/photo and signature are uploaded|photo.*uploaded once/i);
  });

  it("does not invent black ink when a portal has no stored signature-ink rule", () => {
    const withoutInk = specs.find((s) => s.sigLimitKb && !s.signatureInk)!;
    const signatureAnswer = portalFaqItems(withoutInk).find((f) =>
      /signature size/i.test(f.q)
    )!.a;
    expect(signatureAnswer).not.toMatch(/black ink/i);
    expect(signatureAnswer).toMatch(/current notice/i);
  });

  it.each(["kpsc", "oci"])(
    "%s: signature FAQ stays neutral when its source publishes no ink rule",
    (id) => {
      const spec = specs.find((candidate) => candidate.id === id)!;
      expect(spec.signatureInk).toBeUndefined();
      const signatureAnswer = portalFaqItems(spec).find((item) =>
        /signature size/i.test(item.q)
      )!.a;
      expect(signatureAnswer).not.toMatch(/black|blue/i);
      expect(signatureAnswer).toMatch(/current notice/i);
    }
  );

  it("uses RRB's stored black-ink instruction in its signature FAQ", () => {
    const rrb = specs.find((spec) => spec.id === "rrb")!;
    const signatureAnswer = portalFaqItems(rrb).find((item) =>
      /signature size/i.test(item.q)
    )!.a;
    expect(signatureAnswer).toContain(rrb.signatureInk);
  });

  // A portal that publishes neither pixels nor an aspect ratio constrains nothing
  // but file size. Promising we keep "the correct dimensions", or blaming the wrong
  // ones for rejection, invents a requirement — the same class of error as a wrong
  // KB band, and the reason four "official" specs turned out to be wrong.
  const noGeometry = specs.filter(
    (s) => photoDimsPx(s) === null && s.photoAspectRatio === undefined
  );

  it("still covers portals that constrain nothing but file size", () => {
    expect(noGeometry.length).toBeGreaterThan(0);
  });

  it.each(noGeometry.map((s) => [s.id, s] as const))(
    "%s: claims no dimension requirement the authority never published",
    (_id, spec) => {
      const answers = portalFaqItems(spec)
        .map((f) => f.a)
        .join("\n");
      expect(answers).not.toMatch(/pixel dimensions|correct dimensions/i);
    }
  );

  it.each(specs.map((s) => [s.id, s] as const))(
    "%s: dimension helpers return a clean phrase or null",
    (_id, spec) => {
      for (const dims of [photoDimsPx(spec), sigDimsPx(spec)]) {
        if (dims !== null) expect(dims).toMatch(/^\d+×\d+(px| px)$/);
      }
    }
  );
});
