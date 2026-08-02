import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { MAKER_PAGES } from "@/lib/makerPages";
import { READY_TOOLS, CATEGORY_SLUGS } from "@/lib/toolsCatalog";
import { isDeindexed } from "@/lib/deindexed";
import { BLOG_POSTS } from "@/lib/blog";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";

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
const TOOLS_UPDATED = "2026-08-02";
const TRUST_PAGES_UPDATED = "2026-07-13";

/**
 * When the exam-requirement template itself last changed, as opposed to when a
 * given exam's specification was last verified. An exam page's lastmod is the
 * later of the two: the spec can be six months old while the page around it
 * gained a read-next block and an above-the-fold action row this week, and
 * Google should be told the page changed without the spec pretending to be
 * newer than it is.
 */
const EXAM_TEMPLATE_UPDATED = "2026-08-02";

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
  // Exam pages carry the later of two dates: when the spec was last verified
  // against the official source (verifiedOn) and when the template around it
  // last changed. Using verifiedOn alone understated pages whose content moved
  // this week; using the template date alone would claim a stale spec is fresh.
  const examFreshness = (key: string) => {
    const verified = PORTAL_PRESETS[key]?.verifiedOn;
    if (!verified) return EXAM_TEMPLATE_UPDATED;
    return verified > EXAM_TEMPLATE_UPDATED ? verified : EXAM_TEMPLATE_UPDATED;
  };

  // ── Plain routes (no dedicated OG image) ─────────────────────────────────
  // These pages appear in the sitemap without image entries.
  const simpleRoutes: string[] = [
    "/",
    "/tools/",
    "/us-passport-photo/",
    "/uk-passport-photo/",
    "/canada-passport-photo/",
    "/schengen-visa-photo/",
    "/blog/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/disclaimer/",
    "/exam-requirements/",
    "/exam-photo-size/",
    "/exam-calendar/",
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

    // ── Indexable trust and methodology pages ───────────────────────────────
    ...trustRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: TRUST_PAGES_UPDATED,
    })),

    // ── Landing pages with OG images ─────────────────────────────────────────
    ...ogRoutes.filter((path) => !isDeindexed(path)).map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LAST_UPDATED,
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
      lastModified: TOOLS_UPDATED,
      images: ogImg(`/tools/${t.slug}/`),
    })),

    // ── Per-exam spec pages — lastmod = the spec's own verification date ──────
    ...PORTAL_KEYS.map((key) => ({
      url: `${SITE_URL}/exam-requirements/${key}/`,
      lastModified: examFreshness(key),
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
