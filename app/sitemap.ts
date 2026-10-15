import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { MAKER_PAGES } from "@/lib/makerPages";
import { READY_TOOLS, CATEGORY_SLUGS } from "@/lib/toolsCatalog";
import { isDeindexed } from "@/lib/deindexed";
import { BLOG_POSTS } from "@/lib/blog";
import { examPageLastModified } from "@/lib/examPageDates";
import { PORTAL_KEYS } from "@/lib/portalPresets";

export const dynamic = "force-static";

// Per-section "last significant update". Bumped MANUALLY on real content
// changes — never new Date(), so lastmod reflects actual freshness instead of
// churning on every deploy (which Google distrusts). Blog posts use their own
// date.
//
// These are split by section on purpose. A single site-wide constant meant that
// editing one country record restamped all 194 URLs as freshly updated, which
// is a freshness claim we cannot support for pages that did not change. Bump
// only the section you actually edited.
const LAST_UPDATED = "2026-08-02";
/** Country/visa maker pages — moves when countrySpecs or maker copy changes. */
const MAKERS_UPDATED = "2026-08-02";
/** Tool pages and their category hubs — moves when a tool or its copy changes. */
const TOOLS_UPDATED = "2026-09-08";
/**
 * Tool pages whose own copy changed after TOOLS_UPDATED, so the rest keep
 * their real date (13 Oct 2026: titles, snippets and FAQs in searchers' words).
 */
const TOOL_UPDATED: Record<string, string> = {
  "photo-with-name-date": "2026-10-13",
  "photo-signature-merge": "2026-10-13",
  // 15 Oct 2026: "Sign on Photo or Image" title, type-your-name signature, PNG stays PNG.
  "sign-image": "2026-10-15",
  "dpi-converter": "2026-10-13",
  "signature-crop": "2026-10-14",
  "white-background": "2026-10-14",
  // 14 Oct 2026: how-to steps for the common KB sizes searchers ask for.
  "resize-kb": "2026-10-14",
};
/**
 * Landing pages whose own copy changed after LAST_UPDATED. The page's
 * dateModified must match (test/dateConsistency.test.ts).
 */
const LANDING_UPDATED: Record<string, string> = {
  // 14 Oct 2026: passport size in cm and in pixels at 300 DPI.
  "/passport-photo/": "2026-10-14",
};
const TRUST_PAGES_UPDATED = "2026-07-13";
/** /terms/ — moves only when the terms text changes (7 Oct 2026: support-payment refunds). */
const TERMS_UPDATED = "2026-10-07";
/** /privacy/ — moves only when the policy text changes (8 Oct 2026: ad-cookie disclosure, tips; 14 Oct 2026: where ads run). */
const PRIVACY_UPDATED = "2026-10-14";
/** /tools/ index — moves only when its own content changes (8 Oct 2026: unfinished-tool cards removed). */
const TOOLS_INDEX_UPDATED = "2026-10-08";
/**
 * /exam-requirements/ and /exam-photo-size/ — the overview list and table of
 * every exam. Move when an exam's row or card changes (8 Oct 2026: SSC live
 * photo and signature; 10 Oct 2026: UP Police live photo and signature;
 * 13 Oct 2026: Voter ID photo 2000 KB and the exam-page corrections).
 */
const EXAM_OVERVIEW_UPDATED = "2026-10-13";
/** /exam-calendar/ — moves only when its own content changes (13 Oct 2026: made date-free, links each board's calendar). */
const EXAM_CALENDAR_UPDATED = "2026-10-13";


// Helper: add the page's OG image as an image sitemap entry.
// Next.js 15 renders <image:image>/<image:loc> for each entry in `images`.
// If a page has no opengraph-image route the URL returns 404; Google silently
// ignores missing images so no harm is done, but every page listed here does
// have a dedicated opengraph-image.tsx file.
function ogImg(path: string): string[] {
  return [`${SITE_URL}${path}opengraph-image`];
}

/** Static sitemap.xml generated at build (output: export). */
export default function sitemap(): MetadataRoute.Sitemap {
  // Exam pages: the later of the spec's verification and the template change
  // (lib/examPageDates.ts, shared with the page's JSON-LD dateModified).

  // ── Plain routes (no dedicated OG image) ─────────────────────────────────
  // These pages appear in the sitemap without image entries.
  const simpleRoutes: string[] = [
    "/",
    "/us-passport-photo/",
    "/uk-passport-photo/",
    "/canada-passport-photo/",
    "/schengen-visa-photo/",
    "/blog/",
    "/about/",
    "/contact/",
    "/disclaimer/",
    "/aadhaar-photo/",
    // Hinglish pages are noindex (thin duplicates) — intentionally not in sitemap.
    "/convert/",
  ];

  const trustRoutes: string[] = [
    "/editorial-policy/",
    "/corrections-policy/",
    "/source-methodology/",
    "/authors/jaspal-kumar/",
    "/how-photo-checking-works/",
  ];

  // ── Routes WITH dedicated opengraph-image.tsx ─────────────────────────────
  const ogRoutes: string[] = [
    "/passport-photo/",
    "/baby-passport-photo/",
    "/unlock-aadhaar-pdf/",
    "/visa-photo/",
    "/ssc-photo-with-name-date/",
  ];

  // Google ignores changeFrequency and priority — omit them for a leaner sitemap.
  //
  // The per-group filters below are belt; this final pass is braces. Claiming
  // "every group filters" was wrong — maker, trust, exam and blog groups did
  // not, and a deindexed path in any of them would have been published. One
  // filter over the assembled list is the invariant that cannot be forgotten
  // when a new group is added.
  const entries = [
    // ── Simple pages (no images) ─────────────────────────────────────────────
    ...simpleRoutes.filter((path) => !isDeindexed(path)).map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LAST_UPDATED,
    })),

    // ── Pages with their own date, so editing one doesn't restamp the others ─
    ...(
      [
        ["/tools/", TOOLS_INDEX_UPDATED],
        ["/exam-requirements/", EXAM_OVERVIEW_UPDATED],
        ["/exam-photo-size/", EXAM_OVERVIEW_UPDATED],
        ["/exam-calendar/", EXAM_CALENDAR_UPDATED],
        ["/privacy/", PRIVACY_UPDATED],
        ["/terms/", TERMS_UPDATED],
      ] as const
    )
      .filter(([path]) => !isDeindexed(path))
      .map(([path, lastModified]) => ({ url: `${SITE_URL}${path}`, lastModified })),

    // ── Indexable trust and methodology pages ───────────────────────────────
    ...trustRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: TRUST_PAGES_UPDATED,
    })),

    // ── Landing pages with OG images ─────────────────────────────────────────
    ...ogRoutes.filter((path) => !isDeindexed(path)).map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LANDING_UPDATED[path] ?? LAST_UPDATED,
      images: ogImg(path),
    })),

    // ── Country/visa maker pages — all use [maker]/opengraph-image ────────────
    ...MAKER_PAGES.map((m) => ({
      url: `${SITE_URL}/${m.slug}/`,
      lastModified: MAKERS_UPDATED,
      images: ogImg(`/${m.slug}/`),
    })),

    // ── Tool category landing pages (photo, pdf, signature, document, ocr) ───
    ...CATEGORY_SLUGS.filter((s) => !isDeindexed(`/tools/${s}/`)).map((s) => ({
      url: `${SITE_URL}/tools/${s}/`,
      lastModified: TOOLS_UPDATED,
      images: ogImg(`/tools/${s}/`),
    })),

    // ── Individual tool pages — all have opengraph-image.tsx ─────────────────
    ...READY_TOOLS.filter((t) => !isDeindexed(`/tools/${t.slug}/`)).map((t) => ({
      url: `${SITE_URL}/tools/${t.slug}/`,
      lastModified: TOOL_UPDATED[t.slug] ?? TOOLS_UPDATED,
      images: ogImg(`/tools/${t.slug}/`),
    })),

    // ── Per-exam spec pages — lastmod = the spec's own verification date ──────
    ...PORTAL_KEYS.map((key) => ({
      url: `${SITE_URL}/exam-requirements/${key}/`,
      lastModified: examPageLastModified(key),
    })),
    // ── Blog posts — all have opengraph-image.tsx; use their own publish date ─
    // Portal form resizers (/tools/form-resizer/*) and sub-exam resizers
    // (/exam-resizer/*) are noindex — they duplicate the /exam-requirements/
    // intent and inherit the parent spec — so they are intentionally omitted
    // from the sitemap. Legacy *-photo-resizer URLs 301 to the indexable
    // /exam-requirements/ authority pages, so they are also omitted: sitemaps
    // must list final, indexable canonical URLs only.
    ...BLOG_POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: p.updatedISO ?? p.dateISO,
      images: ogImg(`/blog/${p.slug}/`),
    })),
  ];

  return entries.filter(
    (entry) => !isDeindexed(entry.url.replace(SITE_URL, "")),
  );
}
