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
];

describe("public copy keeps authority and acceptance claims bounded", () => {
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
