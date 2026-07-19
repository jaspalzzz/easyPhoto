/**
 * Prevent outcome and authority claims from outrunning the implementation or
 * the registry. Exact-pixel and exact-KB statements remain valid for tools that
 * genuinely deliver a user-selected output; this guard targets only the
 * universal/acceptance wording that turns a measurable capability into a
 * promised application result.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib", "public"];
const SOURCE_EXT = /\.(ts|tsx|txt)$/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return SOURCE_EXT.test(entry.name) ? [path] : [];
  });
}

/**
 * Decode the entity forms used in JSX copy so `official size` and
 * `official&nbsp;size` cannot evade the same rule. Newlines are preserved to
 * keep the reported source line useful.
 */
function normalise(text: string): string {
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
    .replace(/&([a-z]+);/gi, (entity, name: string) => named[name.toLowerCase()] ?? entity)
    .replace(/&#x([0-9a-f]+);/gi, (_entity, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_entity, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/\{\s*["'`]\s+["'`]\s*\}/g, " ")
    .replace(/\r/g, "");
}

const BANNED: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "exact size/dimensions/KB bundle",
    pattern: /exact\s+size\s*(?:,|and|&)\s*dimensions(?:\s*(?:,|and|&)\s*(?:kb|file[- ]?size))?/i,
  },
  {
    label: "exact KB/pixel authority claim",
    pattern: /exact\s+(?:kb\s+(?:and|&)\s+pixel|pixel\s+(?:and|&)\s+kb)\s+(?:figure|limit|preset|spec)s?/i,
  },
  { label: "official-size label", pattern: /\bofficial\s+size\b/i },
  {
    label: "NTA acceptance-format promise",
    pattern: /\bthe\s+exact\s+format\s+the\s+nta\s+portal\s+accepts\b/i,
  },
  {
    label: "universal acceptance promise",
    pattern: /\baccepted\s+(?:in\s+)?(?:everywhere|every\s+application\s+mode)\b/i,
  },
  {
    label: "one-file-for-all promise",
    pattern: /\b(?:one|single)\s+file.{0,80}\b(?:passes|clears)\s+all\b/is,
  },
  {
    label: "clears-all-portals promise",
    pattern: /(?<!rarely\s)(?<!never\s)(?<!not\s)\bclear(?:s|ing)?\s+(?:all\s+state|all\s+three|all\s+of\s+them|every)\s+portals?\b/i,
  },
  {
    label: "guaranteed acceptance",
    pattern: /\b(?:guaranteed\s+acceptance|acceptance\s+(?:is\s+)?guaranteed|will\s+be\s+accepted)\b/i,
  },
  {
    label: "guaranteed rejection outcome",
    pattern: /\b(?:will\s+be\s+rejected|avoids?\s+rejection)\b/i,
  },
  {
    label: "compliant-result promise",
    pattern: /\bcompliant\s+(?:results?|outputs?)\b/i,
  },
  {
    label: "perfect-acceptance promise",
    pattern: /\bperfectly\s+acceptable\b/i,
  },
  {
    label: "non-rejection sizing promise",
    pattern: /\bso\s+it\s+isn['’]?t\s+rejected\b/i,
  },
  {
    label: "non-rejection upload promise",
    pattern: /\bso\s+(?:the\s+)?uploads?\s+(?:isn['’]?t|aren['’]?t)\s+rejected\b/i,
  },
  {
    label: "unlikely-rejection outcome promise",
    pattern: /\brejection\s+becomes\s+(?:very\s+)?unlikely\b/i,
  },
  {
    label: "eliminates-problem promise",
    pattern: /\bremoves?\s+(?:this|the)\s+problem\s+entirely\b/i,
  },
  {
    label: "one-photo acceptance promise",
    pattern: /\b(?:one|same)\s+photo.{0,100}\bis\s+accepted\b/is,
  },
  {
    label: "non-failure promise",
    pattern: /\bso\s+you\s+don['’]?t\s+fail\b/i,
  },
  {
    label: "tool-compliance outcome promise",
    pattern: /\b(?:makes?|creates?|produces?|downloads?|gets?|applies?)\s+(?:a\s+)?compliant.{0,30}\b(?:photo|image|result|output|background|file)\b/i,
  },
  {
    label: "contextual perfect authority claim",
    pattern: /\bperfect(?:ly)?\s+(?:photos?|images?|files?|results?|outputs?|acceptable)\b[^.\n]{0,100}\b(?:passport|visa|portal|exam|application|accepted?|rejected?)\b/i,
  },
  {
    label: "contextual exact acceptance claim",
    pattern: /\bexact\s+(?:photos?\s+)?(?:size|format|dimensions?|kb|pixels?)\b[^.\n]{0,100}\b(?:passport|visa|portal|exam|application)\b[^.\n]{0,50}\baccept(?:s|ed)?\b/i,
  },
  {
    label: "contextual guaranteed authority claim",
    pattern: /\bguaranteed\s+(?:passport|visa|portal|exam|application|acceptance|result|outcome)\b|\b(?:passport|visa|portal|exam|application)\b[^.\n]{0,80}\b(?<!cannot be )(?<!not be )guaranteed\b/i,
  },
  {
    label: "cross-portal pass promise",
    pattern: /\bwill\s+pass\b[^.\n]{0,100}\b(?:portal|exam|application)s?\b/i,
  },
];

describe("public copy keeps authority and acceptance claims bounded", () => {
  it.each([
    "download the compliant result",
    "a 50 KB photo is perfectly acceptable",
    "size it so it isn't rejected",
    "this removes the problem entirely",
    "one photo for every country is accepted",
    "use this background so you don't fail",
    "make a compliant photo",
    "compress it so the upload isn't rejected",
    "fix these issues and rejection becomes very unlikely",
    "Perfect photos for your passport application",
    "The exact size the exam portal accepts",
    "A guaranteed visa result",
    "This file will pass the other portals",
  ])("recognises a prohibited regression: %s", (copy) => {
    const normalised = normalise(copy);
    expect(BANNED.some(({ pattern }) => pattern.test(normalised))).toBe(true);
  });

  it.each([
    "The straighten tool gives a perfect result.",
    "Make a perfect LinkedIn profile picture.",
  ])("does not flatten ordinary non-authority marketing copy: %s", (copy) => {
    const normalised = normalise(copy);
    expect(BANNED.some(({ pattern }) => pattern.test(normalised))).toBe(false);
  });

  it("contains none of the banned phrases, including HTML-entity variants", () => {
    const offenders: string[] = [];

    for (const root of ROOTS) {
      for (const file of sourceFiles(root)) {
        const copy = normalise(readFileSync(file, "utf8"));
        for (const { label, pattern } of BANNED) {
          const match = pattern.exec(copy);
          if (!match || match.index === undefined) continue;
          const line = copy.slice(0, match.index).split("\n").length;
          offenders.push(`${file}:${line} — ${label}: ${JSON.stringify(match[0])}`);
        }
      }
    }

    expect(
      offenders,
      `Bound these claims to measurable tool behaviour and the registry; do not promise an authority's decision:\n  ${offenders.join("\n  ")}`
    ).toEqual([]);
  });
});
