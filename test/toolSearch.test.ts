/**
 * Site search: every result must be a live, directly loadable URL, and the
 * queries real users type must find their tool.
 *
 * Regression: the KB presets linked to retired /photo-resize-to-Nkb/ routes
 * that only exist as host redirects. Next's client router fetches the literal
 * path's RSC payload, which the redirect doesn't cover, so choosing "Resize
 * Image to 20 KB" rendered the 404 page. Matching was a whole-phrase substring,
 * so "remove background" or "passport size photo" found nothing.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { buildSearchIndex, queryTokens, searchTools } from "@/lib/toolSearch";

const index = buildSearchIndex();
const paths = (q: string, limit = 50) => searchTools(index, q, limit).results.map((r) => r.path);

/** Source paths of every rule in public/_redirects (the retired routes). */
function redirectSources(): Set<string> {
  const text = fs.readFileSync(path.join(process.cwd(), "public", "_redirects"), "utf8");
  const sources = new Set<string>();
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    sources.add(t.split(/\s+/)[0]!);
  }
  return sources;
}

describe("search index", () => {
  it("never links to a retired (host-redirected) route", () => {
    const retired = redirectSources();
    const offenders = index
      .map((i) => i.path.split("?")[0]!.split("#")[0]!)
      .filter((p) => retired.has(p));
    expect(offenders).toEqual([]);
  });

  it("uses no legacy route families", () => {
    for (const item of index) {
      expect(item.path).not.toMatch(/^\/(photo|signature)-resize-to-\d+kb\//);
      expect(item.path).not.toMatch(/^\/tools\/form-resizer\//);
      expect(item.path).not.toMatch(/^\/exam-resizer\//);
    }
  });

  it("KB presets carry their target as a query the tools read", () => {
    expect(paths("20kb")).toContain("/tools/resize-kb/?target=20");
    expect(paths("signature 20kb")).toEqual(["/tools/signature-resize/?target=20"]);
  });
});

describe("queryTokens", () => {
  it("joins spaced sizes, canonicalises misspellings, drops filler", () => {
    expect(queryTokens("20 KB")).toEqual(["20kb"]);
    expect(queryTokens("aadhar")).toEqual(["aadhaar"]);
    expect(queryTokens("passport size photo")).toEqual(["passport", "photo"]);
    expect(queryTokens("photo ka size kam kaise kare")).toEqual(["photo"]);
  });
});

describe("searchTools", () => {
  it.each([
    ["remove background", "/tools/background-removal/"],
    ["background remove", "/tools/background-removal/"],
    ["jpg to pdf", "/tools/jpg-to-pdf/"],
    ["pdf compress", "/tools/pdf-compress/"],
    ["compress pdf", "/tools/pdf-compress/"],
    ["resize photo", "/tools/resize-dimensions/"],
    ["ssc photo", "/exam-requirements/ssc/"],
    ["ssc signature", "/exam-requirements/ssc/"],
    ["upsc photo", "/exam-requirements/upsc/"],
    ["photo 20 kb", "/tools/resize-kb/?target=20"],
  ])("%s → %s", (query, expected) => {
    expect(paths(query)).toContain(expected);
  });

  it("finds Aadhaar tools from the common misspelling", () => {
    expect(paths("aadhar").some((p) => p.includes("aadhaar"))).toBe(true);
  });

  it("finds a passport maker for 'passport size photo'", () => {
    expect(paths("passport size photo").some((p) => p.endsWith("-passport-photo-maker/"))).toBe(true);
  });

  it("keeps short tokens prefix-only ('pan' is the PAN card, not Japan)", () => {
    expect(paths("pan").some((p) => p.includes("japan"))).toBe(false);
  });

  it("an extra word narrows results rather than emptying them", () => {
    const broad = searchTools(index, "signature", 100).total;
    const narrow = searchTools(index, "signature 20kb", 100).total;
    expect(narrow).toBeGreaterThan(0);
    expect(narrow).toBeLessThan(broad);
  });

  it("ranks title matches first", () => {
    expect(searchTools(index, "merge pdf", 5).results[0]!.path).toBe("/tools/pdf-merge/");
  });

  it("returns nothing for a blank query", () => {
    expect(searchTools(index, "   ", 8)).toEqual({ results: [], total: 0 });
  });

  it("a filler-only query searches its own words instead of coming back empty", () => {
    expect(queryTokens("size")).toEqual(["size"]);
    expect(searchTools(index, "size", 8).total).toBeGreaterThan(0);
  });

  it("respects the limit but reports the full total", () => {
    const r = searchTools(index, "photo", 3);
    expect(r.results).toHaveLength(3);
    expect(r.total).toBeGreaterThan(3);
  });
});

describe("searchTools — the queries this site earns traffic for", () => {
  it.each(["photo resizer in kb", "image resizer in kb", "resize image in kb", "photo resize in kb"])(
    "'%s' (top Bing query) finds the KB resizer",
    (q) => {
      expect(paths(q)[0]).toBe("/tools/resize-kb/");
    },
  );

  it("'add signature to photo' offers the signature-on-photo tools", () => {
    expect(paths("add signature to photo", 3)).toEqual(
      expect.arrayContaining(["/tools/sign-image/", "/tools/photo-signature-merge/"]),
    );
  });

  it("'sign on photo' ranks Sign Image first (whole-word title match beats 'signature')", () => {
    expect(paths("sign on photo")[0]).toBe("/tools/sign-image/");
  });

  it.each(["passport size photo", "photo size", "passport"])(
    "'%s' still leads with the India passport maker",
    (q) => {
      expect(paths(q)[0]).toBe("/india-passport-photo-maker/");
    },
  );
});
