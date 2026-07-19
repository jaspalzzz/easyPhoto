import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_POSTS } from "@/lib/blog";
import {
  EXAM_GUIDE_ROWS,
  EXAM_SIZE_GUIDE_FAQ_ITEMS,
  SIGNATURE_GUIDE_FAQ_ITEMS,
  SIGNATURE_GUIDE_ROWS,
  hasPublishedSignatureTarget,
} from "@/lib/examGuideCopy";
import {
  PORTAL_PRESETS,
  type PortalSpec,
} from "@/lib/portalPresets";
import { faqSchema } from "@/lib/schema";
import { photoDimsPx, sigDimsPx } from "@/lib/specRegistry";

const ROOTS = ["app", "components", "lib", "public"];
const SOURCE_EXT = /\.(ts|tsx|txt)$/;

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(entryPath);
    return SOURCE_EXT.test(entry.name) ? [entryPath] : [];
  });
}

export function normaliseDimensionEntities(text: string): string {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    ndash: "–",
    quot: '"',
    times: "×",
  };

  return text
    .replace(/&([a-z]+);/gi, (entity, name: string) =>
      named[name.toLowerCase()] ?? entity
    )
    .replace(/&#x([0-9a-f]+);/gi, (_entity, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_entity, decimal: string) =>
      String.fromCodePoint(Number.parseInt(decimal, 10))
    )
    .replace(/(\d)\s*[xX*]\s*(\d)/g, "$1×$2")
    .replace(/\r/g, "");
}

const BROAD_EXAM_PIXEL_CLAIM =
  /\b(?:most\s+(?:indian\s+)?exam\s+forms?|all\s+(?:indian\s+)?exams?|every\s+(?:exam\s+)?portal)\b[^.\n]{0,180}\b\d{2,4}\s*×\s*\d{2,4}\s*(?:px|pixels?)\b/i;

export function hasBroadExamPixelClaim(text: string): boolean {
  return BROAD_EXAM_PIXEL_CLAIM.test(normaliseDimensionEntities(text));
}

function claimIsQualified(text: string): boolean {
  return /\b(?:does not|do not|no fixed|not published|unpublished|unconfirmed|not a current|compatibility[- ]only)\b/i.test(
    text
  );
}

function numericBand(text: string): [number, number] | null {
  const match = text.match(/\b(\d+)\s*[–-]\s*(\d+)\s*KB\b/i);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function fixedDimensions(text: string): [number, number] | null {
  const match = normaliseDimensionEntities(text).match(
    /\b(\d{2,4})\s*×\s*(\d{2,4})\s*(?:px|pixels?)\b/i
  );
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function expectedDimensions(
  spec: PortalSpec,
  kind: "photo" | "signature"
): [number, number] | null {
  const dimensions = kind === "photo" ? photoDimsPx(spec) : sigDimsPx(spec);
  if (!dimensions) return null;
  const match = dimensions.match(/(\d+)×(\d+)/);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

/** Compare an assertive portal claim with the current registry, not a duplicate list. */
export function contradictsPortalSpec(
  spec: PortalSpec,
  kind: "photo" | "signature",
  rawClaim: string
): boolean {
  const claim = normaliseDimensionEntities(rawClaim);
  if (claimIsQualified(claim)) return false;

  const dimensions = fixedDimensions(claim);
  const expected = expectedDimensions(spec, kind);
  if (dimensions) {
    if (kind === "photo" && spec.isLiveCapture) return true;
    if (!expected) return true;
    if (dimensions[0] !== expected[0] || dimensions[1] !== expected[1]) return true;
  }

  if (
    kind === "photo" &&
    /\b(?:pixel specs?|fixed pixels?|pixel dimensions?)\b/i.test(claim) &&
    !expected
  ) {
    return true;
  }

  if (kind === "signature") {
    const published = hasPublishedSignatureTarget(spec);
    if (!published && /\b(?:KB|JPE?G|PNG|pixels?)\b/i.test(claim)) return true;

    const band = numericBand(claim);
    if (
      band &&
      (band[0] !== spec.sigMinKb || band[1] !== spec.sigLimitKb)
    ) {
      return true;
    }

    if (
      /transparent\s+PNG/i.test(claim) &&
      !spec.sigFormat?.toUpperCase().includes("PNG")
    ) {
      return true;
    }
  }

  return false;
}

const DISPUTED_SPECS = [
  PORTAL_PRESETS.ssc,
  PORTAL_PRESETS.rrb,
  PORTAL_PRESETS["army-agniveer"],
  PORTAL_PRESETS.nda,
];

function aliases(spec: PortalSpec): string[] {
  return [
    spec.id.replaceAll("-", " "),
    spec.name.split(" (")[0].toLowerCase(),
  ];
}

function containsPortalName(text: string, spec: PortalSpec): boolean {
  const lower = text.toLowerCase();
  return aliases(spec).some((alias) => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i").test(lower);
  });
}

function sourceClaimOffenders(file: string): string[] {
  const lines = normaliseDimensionEntities(fs.readFileSync(file, "utf8")).split("\n");
  const signatureContext = file.endsWith(
    "app/blog/how-to-sign-exam-application-forms-india/page.tsx"
  );
  const offenders: string[] = [];

  lines.forEach((claim, index) => {
    for (const spec of DISPUTED_SPECS) {
      if (!containsPortalName(claim, spec)) continue;
      const kinds: Array<"photo" | "signature"> = signatureContext
        ? ["signature"]
        : [
            ...(claim.match(/photo|photograph/i) ? (["photo"] as const) : []),
            ...(claim.match(/sign(?:ature)?/i) ? (["signature"] as const) : []),
          ];
      for (const kind of kinds) {
        if (contradictsPortalSpec(spec, kind, claim)) {
          offenders.push(`${file}:${index + 1} — ${spec.id}/${kind}`);
        }
      }
    }
  });

  return [...new Set(offenders)];
}

describe("registry-driven exam guide copy", () => {
  it("proves the registry has no universal 413×531 exam canvas", () => {
    const published = new Set(
      Object.values(PORTAL_PRESETS)
        .map((spec) => photoDimsPx(spec))
        .filter((value): value is string => value !== null)
    );
    const presetsWithPublishedPixels = Object.values(PORTAL_PRESETS).filter(
      (spec) => photoDimsPx(spec) !== null
    );

    expect(presetsWithPublishedPixels).toHaveLength(18);
    expect(published.size).toBeGreaterThan(1);
    expect(published.has("413×531px")).toBe(false);
  });

  it.each([
    '["Most Indian exam forms", "35×45 mm", "413×531 px"]',
    "Most Indian exam forms use 413&#215;531 px",
    "Most Indian exam forms use 413&times;531 px",
    "All Indian exams use 413&#xD7;531 px",
    "Every portal requires 413x531 px",
    "Every exam portal requires 413*531 pixels",
  ])("fails the broad-dimension guard on reintroduction: %s", (mutation) => {
    expect(hasBroadExamPixelClaim(mutation)).toBe(true);
  });

  it.each([
    "A 35×45 mm print reference is approximately 413×531 px at 300 DPI.",
    "At 300 DPI, a 35×45 mm layout is about 413&#215;531 pixels.",
  ])("does not flag a bounded print calculation: %s", (copy) => {
    expect(hasBroadExamPixelClaim(copy)).toBe(false);
  });

  it("contains no broad photo-pixel claim in public source strings", () => {
    const offenders = ROOTS.flatMap((root) =>
      sourceFiles(root)
        .filter((file) => !file.includes(`${path.sep}test${path.sep}`))
        .flatMap((file) => {
          const text = fs.readFileSync(file, "utf8");
          return hasBroadExamPixelClaim(text) ? [file] : [];
        })
    );
    expect(offenders).toEqual([]);
  });

  it.each([
    [PORTAL_PRESETS.ssc, "photo", "SSC CGL is listed at 275&#215;354 px"],
    [PORTAL_PRESETS.rrb, "signature", "RRB signature: 10–20 KB at 140x60 px, JPG"],
    [
      PORTAL_PRESETS["army-agniveer"],
      "signature",
      "Army Agniveer signature: 10–20 KB at 140*60 px, JPG or transparent PNG",
    ],
    [PORTAL_PRESETS.nda, "signature", "NDA portals accept a transparent PNG signature"],
  ] as const)(
    "fails the portal guard on reintroduction for %s",
    (spec, kind, mutation) => {
      expect(contradictsPortalSpec(spec, kind, mutation)).toBe(true);
    }
  );

  it("finds no disputed portal claim in visible, metadata or FAQ source strings", () => {
    const files = [
      path.join(process.cwd(), "app/blog/exam-photo-signature-size-guide/page.tsx"),
      path.join(process.cwd(), "app/blog/how-to-sign-exam-application-forms-india/page.tsx"),
      path.join(process.cwd(), "lib/kbTargets.ts"),
      path.join(process.cwd(), "lib/blog.ts"),
    ];
    expect(files.flatMap(sourceClaimOffenders)).toEqual([]);
  });

  it("keeps generated guide rows aligned with each preset's published fields", () => {
    for (const row of [...EXAM_GUIDE_ROWS, ...SIGNATURE_GUIDE_ROWS]) {
      const spec = PORTAL_PRESETS[row.id];
      if (spec.isLiveCapture) expect(row.photo).toBe("Live capture");
      if (!photoDimsPx(spec)) {
        expect(row.photoDimensions).not.toMatch(/\d+×\d+\s*px/i);
      }
      if (!hasPublishedSignatureTarget(spec)) {
        expect(row.signature).toBe("Not published in cited source");
        expect(row.signatureDimensions).toBe("Not published in cited source");
      }
    }
  });

  it("puts the corrected FAQ answers into unchanged FAQPage schema", () => {
    const schema = faqSchema(EXAM_SIZE_GUIDE_FAQ_ITEMS);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(EXAM_SIZE_GUIDE_FAQ_ITEMS.length);
    const json = JSON.stringify(schema);
    expect(json).toMatch(/capture the photograph live/i);
    expect(json).not.toMatch(/275\s*×\s*354/i);

    const signatureSchema = faqSchema(SIGNATURE_GUIDE_FAQ_ITEMS);
    expect(signatureSchema["@type"]).toBe("FAQPage");
    expect(signatureSchema.mainEntity).toHaveLength(SIGNATURE_GUIDE_FAQ_ITEMS.length);
    expect(JSON.stringify(signatureSchema)).not.toMatch(/SSC requires[^.]*140×60/i);
  });

  it("keeps blog metadata free of the corrected disputed claims", () => {
    const posts = BLOG_POSTS.filter((post) =>
      [
        "exam-photo-signature-size-guide",
        "how-to-sign-exam-application-forms-india",
      ].includes(post.slug)
    );
    const copy = posts.flatMap((post) => [post.description, post.excerpt]).join("\n");
    expect(copy).not.toMatch(/exact photo and signature limits for every major/i);
    expect(copy).not.toMatch(/under 10[–-]20 KB[^.]*RRB/i);
    expect(copy).not.toMatch(/Army[^.]*transparent background/i);
  });
});
