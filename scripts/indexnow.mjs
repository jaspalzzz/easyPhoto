/**
 * IndexNow submitter — tells Bing, Yandex, Naver and Seznam to (re)crawl URLs
 * fast. Bing's index also feeds Microsoft Copilot citations, so this complements
 * our AI-visibility strategy. Google does NOT use IndexNow (it has its own
 * discovery) — this is for the other engines.
 *
 * This is a STATIC site, so submission is NOT a build step (we don't want every
 * preview/dev build pinging production). Run it MANUALLY once a production deploy
 * is LIVE — the key file must already be reachable at the URL below:
 *
 *     npm run indexnow                                   # submit every sitemap URL
 *     npm run indexnow -- https://easyphoto.in/ssc-photo-resizer/   # only changed URLs (preferred)
 *
 * Ownership is proven by public/<KEY>.txt → https://easyphoto.in/<KEY>.txt
 * (the file's name IS the key, and its contents are the key). If you ever rotate
 * the key, change KEY here AND rename the public/<KEY>.txt file to match.
 */

const KEY = "b98c5aac2f9f36f34a7b042c71d69946";
const SITE = "https://easyphoto.in";
const HOST = "easyphoto.in";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Could not fetch sitemap (${res.status}).`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  // Guard: the key file must be live before submitting, or engines reject the batch.
  const keyCheck = await fetch(KEY_LOCATION).catch(() => null);
  if (!keyCheck || !keyCheck.ok) {
    console.error(
      `Key file not reachable at ${KEY_LOCATION} (got ${keyCheck?.status ?? "no response"}).\n` +
        `Deploy first so the key file is live, then re-run.`
    );
    process.exit(1);
  }

  const args = process.argv.slice(2).filter(Boolean);
  const urlList = args.length ? args : await sitemapUrls();
  if (!urlList.length) {
    console.error("No URLs to submit.");
    process.exit(1);
  }
  // Only ever submit our own host's URLs.
  const offsite = urlList.filter((u) => !u.startsWith(`${SITE}/`));
  if (offsite.length) {
    console.error(`Refusing — these URLs aren't on ${SITE}:\n  ${offsite.join("\n  ")}`);
    process.exit(1);
  }

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow…`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  const body = (await res.text()).trim();
  // 200 OK / 202 Accepted = success. 4xx = key or format problem.
  console.log(`IndexNow: ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`);
  process.exit(res.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
