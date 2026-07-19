import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isAdSenseExcludedPath } from "@/lib/adExclusions";

const expectation = process.env.ADSENSE_EXPORT_EXPECT;
const exportRoot = path.resolve(
  process.env.ADSENSE_EXPORT_DIR || path.join(process.cwd(), "out")
);
const clientId = "ca-pub-8825078307302402";
const scriptUrl =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
  clientId;
const cmpScriptUrl =
  "https://fundingchoicesmessages.google.com/i/pub-8825078307302402?ers=1";
const adsPreconnect = "https://pagead2.googlesyndication.com";
const adsDnsPrefetch = "https://googleads.g.doubleclick.net";

function htmlFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(entryPath);
    return entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

function routeFor(file: string): string {
  const relative = path.relative(exportRoot, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) {
    return `/${relative.slice(0, -"index.html".length)}`;
  }
  return `/${relative.replace(/\.html$/, "/")}`;
}

function adStackReferences(html: string): string[] {
  return html.match(
    /adsbygoogle|googlesyndication|doubleclick|adtrafficquality|fundingchoices|ca-pub-8825078307302402/gi
  ) || [];
}

function scriptTags(html: string): string[] {
  return html.match(/<script\b[^>]*><\/script>/gi) || [];
}

const runExportAssertions = expectation === "on" || expectation === "off";

describe.skipIf(!runExportAssertions)("static AdSense export", () => {
  const pages = htmlFiles(exportRoot).map((file) => ({
    file,
    route: routeFor(file),
    html: fs.readFileSync(file, "utf8"),
  }));

  it("has exported HTML to inspect", () => {
    expect(pages.length).toBeGreaterThan(200);
  });

  if (expectation === "off") {
    it("contains no AdSense reference anywhere when disabled", () => {
      const offenders = pages
        .filter(({ html }) => adStackReferences(html).length > 0)
        .map(({ route }) => route);
      expect(offenders).toEqual([]);
    });
  } else {
    it("keeps every excluded exported route completely AdSense-free", () => {
      const offenders = pages
        .filter(({ route }) => isAdSenseExcludedPath(route))
        .filter(({ html }) => adStackReferences(html).length > 0)
        .map(({ route }) => route);
      expect(offenders).toEqual([]);
    });

    it("writes the CMP before one real asynchronous AdSense tag on every eligible route", () => {
      const failures = pages
        .filter(({ route }) => !isAdSenseExcludedPath(route))
        .flatMap(({ route, html }) => {
          const tags = scriptTags(html);
          const cmpTags = tags.filter((tag) => tag.includes(cmpScriptUrl));
          const adsenseTags = tags.filter((tag) => tag.includes(scriptUrl));
          const valid =
            cmpTags.length === 1 &&
            adsenseTags.length === 1 &&
            /\sasync(?:="")?(?:\s|>)/i.test(cmpTags[0]) &&
            /\sasync(?:="")?(?:\s|>)/i.test(adsenseTags[0]) &&
            /\scrossorigin="anonymous"/i.test(adsenseTags[0]) &&
            html.indexOf(cmpScriptUrl) < html.indexOf(scriptUrl);
          return valid
            ? []
            : [
                `${route}: ${cmpTags.length} CMP, ${adsenseTags.length} AdSense tag(s) in invalid order or form`,
              ];
        });
      expect(failures).toEqual([]);
    });

    it("preserves eligible-only AdSense connection hints", () => {
      const failures = pages
        .filter(({ route }) => !isAdSenseExcludedPath(route))
        .flatMap(({ route, html }) => {
          const links = html.match(/<link\b[^>]*>/gi) || [];
          const hasPreconnect = links.some(
            (tag) =>
              tag.includes(`href="${adsPreconnect}"`) &&
              /rel="preconnect"/i.test(tag) &&
              /crossorigin="anonymous"/i.test(tag)
          );
          const hasDnsPrefetch = links.some(
            (tag) =>
              tag.includes(`href="${adsDnsPrefetch}"`) &&
              /rel="dns-prefetch"/i.test(tag)
          );
          return hasPreconnect && hasDnsPrefetch
            ? []
            : [`${route}: missing an eligible resource hint`];
        });
      expect(failures).toEqual([]);
    });
  }
});
