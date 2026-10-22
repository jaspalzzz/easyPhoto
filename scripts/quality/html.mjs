/**
 * Static-export readers for the quality gate. Pure Node (fs, path): the gate
 * must not add a dependency, so this is a deliberately small regex reader for
 * the HTML that `next build` writes — not a general HTML parser. It handles the
 * shapes that export actually produces (React's `<!-- -->` text separators,
 * entity-encoded text, JSON-LD in `<script type="application/ld+json">`).
 */
import fs from "node:fs";
import path from "node:path";

const NAMED_ENTITIES = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "…",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  mdash: "—",
  middot: "·",
  nbsp: " ",
  ndash: "–",
  quot: '"',
  rdquo: "”",
  rsquo: "’",
  times: "×",
};

export function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

/** Elements whose contents are never visible page text. */
const INVISIBLE_BLOCKS = ["script", "style", "noscript", "template", "svg"];
/** Site chrome, dropped when measuring a page's own content. */
const CHROME_BLOCKS = ["nav", "footer"];

function dropBlocks(html, tags) {
  let out = html;
  for (const tag of tags) {
    out = out.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi"), " ");
  }
  return out;
}

/**
 * Visible text of an HTML fragment. Every tag becomes a space (so adjacent
 * elements never fuse into one word); React's empty `<!-- -->` separators are
 * removed without a space because they sit inside a single text run.
 */
export function textOf(fragment, { dropChrome = false } = {}) {
  let html = fragment.replace(/<!--[\s\S]*?-->/g, "");
  html = dropBlocks(html, INVISIBLE_BLOCKS);
  if (dropChrome) html = dropBlocks(html, CHROME_BLOCKS);
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1] : "";
}

function metaContent(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (new RegExp(`\\bname=["']${name}["']`, "i").test(tag)) {
      return decodeEntities(firstMatch(tag, /\bcontent=["']([^"']*)["']/i));
    }
  }
  return "";
}

/** Every JSON-LD node (objects carrying @type), flattened out of @graph/arrays. */
export function jsonLdNodes(html) {
  const nodes = [];
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    if (value["@type"]) nodes.push(value);
    for (const child of Object.values(value)) visit(child);
  };
  for (const [, body] of blocks) {
    try {
      visit(JSON.parse(body));
    } catch (error) {
      throw new Error(`Unparseable JSON-LD block: ${error.message}`);
    }
  }
  return nodes;
}

export function typesOf(node) {
  return [node["@type"]].flat().map(String);
}

/** Parsed view of one exported page. */
export function readPage(exportRoot, route) {
  const file = route === "/" ? path.join(exportRoot, "index.html") : path.join(exportRoot, route, "index.html");
  if (!fs.existsSync(file)) throw new Error(`Sitemap lists ${route} but ${file} does not exist.`);
  const html = fs.readFileSync(file, "utf8");
  const body = firstMatch(html, /<body\b[^>]*>([\s\S]*)<\/body>/i) || html;
  const main = firstMatch(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i) || body;
  return {
    route,
    html,
    title: textOf(firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)),
    description: metaContent(html, "description"),
    h1: textOf(firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)),
    /** The page's own content: <main> without breadcrumbs or other nav. */
    mainText: textOf(main, { dropChrome: true }),
    /** Everything a visitor can read on the page, chrome included. */
    bodyText: textOf(body),
    jsonLd: jsonLdNodes(html),
  };
}

/** Indexed routes and their lastmod, from the exported sitemap. */
export function readSitemap(exportRoot) {
  const xml = fs.readFileSync(path.join(exportRoot, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => {
    const loc = firstMatch(entry, /<loc>([^<]+)<\/loc>/).trim();
    return {
      route: new URL(loc).pathname,
      lastmod: firstMatch(entry, /<lastmod>([^<]+)<\/lastmod>/).trim(),
    };
  });
}

/** Every exported HTML file, for site-wide rules that apply beyond the index. */
export function allHtmlFiles(exportRoot) {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "_next") walk(full);
      } else if (entry.name.endsWith(".html")) {
        files.push(full);
      }
    }
  };
  walk(exportRoot);
  return files;
}
