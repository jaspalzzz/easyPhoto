import http from "node:http";
import https from "node:https";
import fs from "node:fs";

const SITE = "https://easyphoto.in";
const UA = "EasyPhotoAuditBot/1.0";

function request(url, method = "GET") {
  return new Promise((resolve) => {
    const client = url.startsWith("http://") ? http : https;
    const req = client.request(url, { method, headers: { "user-agent": UA } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({ url, status: res.statusCode, headers: res.headers, body });
      });
    });

    req.on("error", (error) => {
      resolve({ url, error: String(error), headers: {}, body: "" });
    });
    req.end();
  });
}

function cleanText(value) {
  return (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function match(html, pattern) {
  const found = html.match(pattern);
  return found ? found[1].trim() : "";
}

function metaDescription(html) {
  return (
    match(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
    match(html, /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i)
  );
}

function canonical(html) {
  return match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
}

function robots(html) {
  return match(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
}

function heading(html, tag) {
  return cleanText(match(html, new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")));
}

function visibleWordCount(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function count(html, pattern) {
  return (html.match(pattern) || []).length;
}

const sampleUrls = [
  "/",
  "/tools/",
  "/passport-photo/",
  "/india-passport-photo-maker/",
  "/us-passport-photo-maker/",
  "/visa-photo/",
  "/tools/exam-package/",
  "/exam-requirements/ssc/",
  "/exam-requirements/army-agniveer/",
  "/blog/",
  "/blog/indian-government-id-photo-requirements/",
  "/privacy/",
  "/terms/",
  "/disclaimer/",
  "/contact/",
].map((path) => `${SITE}${path}`);

const statusTestUrls = [
  "https://www.easyphoto.in/",
  "http://easyphoto.in/",
  `${SITE}/india/`,
  `${SITE}/tools/form-resizer/ssc/`,
  `${SITE}/exam-resizer/ssc-cpo/`,
  `${SITE}/photo-ka-size-50kb-kaise-kare/`,
  `${SITE}/_next/static/test.js`,
];

const sitemap = await request(`${SITE}/sitemap.xml`);
const locs = [...sitemap.body.matchAll(/<loc>(https:\/\/easyphoto\.in\/[^<]*)<\/loc>/g)].map(
  (item) => item[1],
);
const pageUrls = locs.filter((url) => !url.includes("opengraph-image"));
const imageLocs = [
  ...sitemap.body.matchAll(/<image:loc>(https:\/\/easyphoto\.in\/[^<]*)<\/image:loc>/g),
].map((item) => item[1]);
const lastmods = [...sitemap.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((item) => item[1]);

const sample = [];
for (const url of sampleUrls) {
  const result = await request(url);
  const html = result.body || "";
  sample.push({
    url,
    status: result.status,
    title: cleanText(match(html, /<title[^>]*>([\s\S]*?)<\/title>/i)),
    description: metaDescription(html),
    canonical: canonical(html),
    robots: robots(html),
    h1: heading(html, "h1"),
    h2Count: count(html, /<h2\b/gi),
    schemaBlocks: count(html, /application\/ld\+json/gi),
    wordCount: visibleWordCount(html),
    images: count(html, /<img\b/gi),
    links: count(html, /<a\b/gi),
  });
}

const statusTests = [];
for (const url of statusTestUrls) {
  const result = await request(url);
  statusTests.push({
    url,
    status: result.status,
    location: result.headers.location || "",
    canonical: canonical(result.body || ""),
    robots: robots(result.body || ""),
    title: cleanText(match(result.body || "", /<title[^>]*>([\s\S]*?)<\/title>/i)),
  });
}

const headResults = [];
for (const url of pageUrls) {
  const result = await request(url, "HEAD");
  headResults.push({
    url,
    status: result.status,
    location: result.headers.location || "",
    xRobots: result.headers["x-robots-tag"] || "",
  });
}

const statusCounts = headResults.reduce((memo, result) => {
  memo[result.status] = (memo[result.status] || 0) + 1;
  return memo;
}, {});

const payload = {
  crawledAt: new Date().toISOString(),
  sitemap: {
    totalLocs: locs.length,
    pageUrls: pageUrls.length,
    imageLocs: imageLocs.length,
    uniquePageUrls: new Set(pageUrls).size,
    firstLastmod: lastmods[0],
    newestLastmod: [...lastmods].sort().at(-1),
    oldestLastmod: [...lastmods].sort()[0],
  },
  pageUrls,
  sample,
  statusTests,
  headResults,
  headStatusCounts: statusCounts,
  headNon200: headResults.filter((result) => result.status !== 200),
};

const outIndex = process.argv.indexOf("--out");
if (outIndex !== -1 && process.argv[outIndex + 1]) {
  fs.writeFileSync(process.argv[outIndex + 1], JSON.stringify(payload, null, 2));
}

const inventoryIndex = process.argv.indexOf("--inventory");
if (inventoryIndex !== -1 && process.argv[inventoryIndex + 1]) {
  const rows = [
    "| # | URL | Status | Indexing | Sitemap | Notes |",
    "|---:|---|---:|---|---|---|",
    ...headResults.map((result, index) => {
      const path = result.url.replace(SITE, "") || "/";
      let type = "Indexable";
      let notes = "Canonical sitemap URL";
      if (path.startsWith("/blog/")) notes = "Blog/editorial";
      else if (path.startsWith("/exam-requirements/")) notes = "Official-source exam requirement page";
      else if (path.startsWith("/tools/")) notes = "Utility/tool page";
      else if (path.includes("-passport-photo-maker") || path.includes("-visa-photo-maker")) {
        notes = "Country document-photo maker page";
      } else if (path.includes("resize-to") || path.includes("compress-pdf-to")) {
        notes = "KB-target landing page";
      }
      return `| ${index + 1} | ${result.url} | ${result.status ?? ""} | ${type} | Included | ${notes} |`;
    }),
  ];
  fs.writeFileSync(process.argv[inventoryIndex + 1], `${rows.join("\n")}\n`);
}

console.log(JSON.stringify(payload, null, 2));
