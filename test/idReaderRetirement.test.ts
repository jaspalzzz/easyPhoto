/**
 * 24 Nov 2026: the two ID-card readers, the photo-to-scanned-copy tool and the
 * Aadhaar masking post left the site after AdSense's 14th rejection (23 Nov,
 * "We found some policy violations", no policy named). Owner approved in chat
 * on 24 Nov ("Yes, prepare it").
 *
 * A retired page must be gone from every place a visitor or a crawler can find
 * it: the sitemap, the tool lists and counts, the menus and the articles. Its
 * address must still land somewhere useful in one hop. On the code before this
 * change every assertion below fails.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { BLOG_POSTS } from "@/lib/blog";
import { DEINDEXED_PATHS, isDeindexed } from "@/lib/deindexed";
import { SITE_URL } from "@/lib/site";
import { buildSearchIndex } from "@/lib/toolSearch";
import { LISTED_CATALOG, LISTED_TOOLS, getTool } from "@/lib/toolsCatalog";

const RETIRED_TOOLS = ["aadhaar-ocr", "pan-card-ocr", "document-scanner"] as const;
const RETIRED_POST = "how-to-mask-aadhaar-before-sharing";
const RETIRED_PATHS = [
  ...RETIRED_TOOLS.map((slug) => `/tools/${slug}/`),
  `/blog/${RETIRED_POST}/`,
];

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

/** Every rule in public/_redirects as source -> target. */
function redirects(): Map<string, string> {
  const rules = new Map<string, string>();
  for (const line of read("public/_redirects").split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts.length === 3 && parts[0]!.startsWith("/")) rules.set(parts[0]!, parts[1]!);
  }
  return rules;
}

/** Source files under a folder, for the link scan. */
function sourceFiles(dir: string): string[] {
  return fs.readdirSync(path.join(process.cwd(), dir), { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return /\.(ts|tsx|txt)$/.test(entry.name) ? [file] : [];
  });
}

describe("retired ID-reader pages", () => {
  it("are not in the sitemap", () => {
    const listed = new Set(sitemap().map((entry) => entry.url.replace(SITE_URL, "")));
    for (const p of RETIRED_PATHS) expect(listed.has(p), p).toBe(false);
  });

  it("are not offered in any tool list, and the post is not in the blog", () => {
    const listedSlugs = new Set(LISTED_TOOLS.map((tool) => tool.slug));
    for (const slug of RETIRED_TOOLS) {
      expect(isDeindexed(`/tools/${slug}/`), slug).toBe(true);
      expect(listedSlugs.has(slug), slug).toBe(false);
    }
    expect(BLOG_POSTS.some((post) => post.slug === RETIRED_POST)).toBe(false);
  });

  it("leave no empty tool group behind", () => {
    // /tools/ renders one section per listed group; the menus must not point
    // at a section that no longer exists.
    const groups = new Set(LISTED_CATALOG.map((group) => group.slug));
    expect(groups.has("document")).toBe(false);
    expect(groups.has("ocr")).toBe(false);
    for (const file of ["lib/toolMenu.ts", "components/site/FeaturedTools.tsx", "app/tools/page.tsx"]) {
      expect(read(file), file).not.toMatch(/#(document|ocr)\b/);
    }
  });

  it("land on an indexed page in one hop", () => {
    const rules = redirects();
    for (const p of RETIRED_PATHS) {
      const target = rules.get(p);
      expect(target, `${p} has no redirect`).toBeDefined();
      expect(isDeindexed(target!), `${p} lands on a hidden page`).toBe(false);
      expect(rules.has(target!), `${p} lands on another redirect`).toBe(false);
    }
  });

  it("are the target of no other redirect", () => {
    const retired = new Set<string>(RETIRED_PATHS);
    for (const [source, target] of redirects()) {
      expect(retired.has(target), `${source} still lands on ${target}`).toBe(false);
    }
  });

  it("are not linked from any page, menu or article that stays", () => {
    // The pages' own folders and the tool components stay in the repository so
    // the change is reversible; nothing a visitor can still open may link them.
    const own = RETIRED_TOOLS.map((slug) => path.join("app", "tools", slug) + path.sep);
    const link = new RegExp(
      `/(?:tools/(?:${RETIRED_TOOLS.join("|")})|blog/${RETIRED_POST})(?![\\w-])`,
    );
    const offenders = [...sourceFiles("app"), ...sourceFiles("components/site"), ...sourceFiles("components/blog"), "lib/toolMenu.ts", "public/llms.txt"]
      .filter((file) => !own.some((dir) => file.startsWith(dir)))
      // A page's own metadata path is not a link to it.
      .filter((file) => link.test(read(file).replace(/path:\s*"[^"]+"/g, "")));
    expect(offenders).toEqual([]);
  });
});

describe("hidden pages on the same topic", () => {
  // Hidden from search since August and unlinked since 1 Nov 2026, but still
  // served until 24 Nov: the PDF password remover and the Aadhaar masking tool.
  // The other 24 went the same day (owner: "remove the other 24 hidden tool
  // pages too").
  const HIDDEN_RETIRED = [
    "unlock-pdf", "mask-aadhaar",
    "auto-crop", "camera-capture", "compress-document", "extract-pages",
    "form-fill", "format-converter", "image-crop", "image-to-text",
    "jpg-to-pdf", "linkedin-photo", "pdf-compress", "pdf-merge",
    "pdf-page-numbers", "pdf-reorder", "pdf-split", "pdf-to-jpg",
    "pdf-to-text", "print-sheet", "red-eye-removal", "resize-dimensions",
    "sign-pdf", "straighten-photo", "transparent-signature", "watermark-pdf",
  ] as const;

  it("every hidden tool page is a redirect: none is served any more", () => {
    const rules = redirects();
    const served = DEINDEXED_PATHS.filter((p) => p.startsWith("/tools/") && !rules.has(p));
    expect(served).toEqual([]);
  });


  it("redirect in one hop to a page that is listed", () => {
    const rules = redirects();
    for (const slug of HIDDEN_RETIRED) {
      const target = rules.get(`/tools/${slug}/`);
      expect(target, `${slug} has no redirect`).toBeDefined();
      expect(isDeindexed(target!), `${slug} lands on a hidden page`).toBe(false);
      expect(rules.has(target!), `${slug} lands on another redirect`).toBe(false);
    }
  });

  it("are not offered by site search or recent tools", () => {
    const searchable = new Set(buildSearchIndex().map((item) => item.path));
    for (const slug of [...HIDDEN_RETIRED, ...RETIRED_TOOLS]) {
      expect(searchable.has(`/tools/${slug}/`), slug).toBe(false);
      expect(getTool(slug)?.ready, slug).toBe(false);
    }
  });

  it("leave Aadhaar findable in site search", () => {
    expect(buildSearchIndex().some((item) => item.path === "/aadhaar-photo/")).toBe(true);
  });

  it("no tool message sends a visitor to the retired password remover", () => {
    for (const file of ["components/tools/EncryptedPdfNotice.tsx", "lib/pdfCompress.ts", "lib/pdfToImages.ts", "lib/pdfToText.ts"]) {
      expect(read(file), file).not.toMatch(/Unlock PDF tool|\/tools\/unlock-pdf/);
    }
  });
});
