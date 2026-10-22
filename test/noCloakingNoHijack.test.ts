/**
 * No cloaking, sneaky redirects or back-button hijacking (Google spam policies;
 * CLAUDE.md §6.9 question 8).
 *
 * The 6 Oct 2026 guideline audit confirmed Googlebot and a browser see the same
 * text on every page, and that the code never touches the history stack:
 * navigation happens only when the user acts. This keeps it that way.
 *
 * - History manipulation, unload traps, script redirects, meta refresh and
 *   crawler-name sniffing are banned outright (zero today, zero allowed).
 * - Reading the user agent is allowed only where it is recorded, with the
 *   reason, in test/fixtures/quality/history-and-ua-allowlist.json — each is a
 *   device workaround or a coarse analytics bucket and none changes what text a
 *   page shows. The per-file count may only fall.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { explain, NEVER_LOOSEN, ratchetCounts, readFixture } from "@/scripts/quality/ratchet.mjs";
import { sourceFiles, stripComments } from "./quality/sourceFiles";

const FIXTURE = "history-and-ua-allowlist.json";
const ROOTS = ["app", "components", "lib", "functions", "store"];
const CODE_EXT = /\.(?:ts|tsx|js|jsx|mjs)$/;

const BANNED: Array<{ label: string; pattern: RegExp }> = [
  { label: "history stack manipulation", pattern: /\bhistory\s*\.\s*(?:pushState|replaceState|go|back|forward)\s*\(/ },
  { label: "router history rewrite", pattern: /\brouter\s*\.\s*(?:replace|back|forward)\s*\(/ },
  { label: "back-button listener", pattern: /["'`]popstate["'`]|\bonpopstate\b/ },
  { label: "leave-page trap", pattern: /["'`]beforeunload["'`]|\bonbeforeunload\b/ },
  { label: "script redirect", pattern: /\blocation\s*\.\s*(?:replace|assign)\s*\(|\blocation(?:\s*\.\s*href)?\s*=(?!=)/ },
  { label: "meta refresh redirect", pattern: /http-equiv\s*=\s*\{?\s*["'`]refresh/i },
  { label: "crawler-name sniffing", pattern: /\b(?:googlebot|bingbot|adsbot|mediapartners)\b/i },
  { label: "server-side user-agent read", pattern: /headers\s*(?:\.\s*get\s*\(|\[)\s*["'`]user-agent["'`]/i },
];

/** Reads of the browser identity; each must be recorded with its reason. */
const USER_AGENT_READ = /\bnavigator\s*\.\s*(?:userAgent(?:Data)?|platform|vendor)\b/g;

/** robots.ts names crawlers by design: it is the crawl policy, not content. */
const EXEMPT_FILES = new Set([path.join("app", "robots.ts")]);

export function bannedUses(source: string): string[] {
  const code = stripComments(source);
  return BANNED.filter(({ pattern }) => pattern.test(code)).map(({ label }) => label);
}

export function currentUserAgentReads(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const file of sourceFiles(ROOTS, CODE_EXT)) {
    const count = (stripComments(fs.readFileSync(file, "utf8")).match(USER_AGENT_READ) ?? []).length;
    if (count > 0) out[file] = count;
  }
  return out;
}

describe("no cloaking, sneaky redirects or history hijacking", () => {
  it.each([
    ["window.history.pushState({}, '', '/x')", "history stack manipulation"],
    ["router.replace('/tools/')", "router history rewrite"],
    ["window.addEventListener('popstate', trap)", "back-button listener"],
    ["window.addEventListener(\"beforeunload\", stay)", "leave-page trap"],
    ["window.location.href = '/offer/'", "script redirect"],
    ["if (/Googlebot/i.test(ua)) return seoCopy", "crawler-name sniffing"],
    ["const ua = request.headers.get('user-agent')", "server-side user-agent read"],
  ])("recognises %s", (code, label) => {
    expect(bannedUses(code)).toContain(label);
  });

  it("ignores the same words inside comments and comparisons", () => {
    expect(bannedUses("// never call history.pushState here\nif (location.href === next) {}")).toEqual([]);
  });

  it("app, components, lib, functions and store contain none of the banned patterns", () => {
    const offenders = sourceFiles(ROOTS, CODE_EXT)
      .filter((file) => !EXEMPT_FILES.has(file))
      .flatMap((file) => bannedUses(fs.readFileSync(file, "utf8")).map((label) => `${file} — ${label}`));
    expect(offenders, `${offenders.join("\n")}\nThese are spam-policy patterns, not style. ${NEVER_LOOSEN}`).toEqual([]);
  });

  it("user-agent reads stay where they are recorded with a reason", () => {
    const fixture = readFixture(FIXTURE);
    const problems = ratchetCounts({
      fixture: FIXTURE,
      section: "userAgentReads",
      what: "navigator.userAgent/platform/vendor reads",
      current: currentUserAgentReads(),
      allowed: fixture.userAgentReads,
    });
    const unexplained = Object.keys(fixture.userAgentReads).filter((file) => !fixture.why?.[file]);
    expect(unexplained, "every allowlisted file needs a 'why' entry").toEqual([]);
    const staleReasons = Object.keys(fixture.why ?? {}).filter((file) => !(file in fixture.userAgentReads));
    expect(staleReasons, "delete the 'why' entry of a file that is no longer allowlisted").toEqual([]);
    expect(problems, explain(problems)).toEqual([]);
  });
});
