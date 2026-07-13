import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { MAKER_PAGES } from "@/lib/makerPages";
import { READY_TOOLS, CATEGORY_SLUGS } from "@/lib/toolsCatalog";
import {
  KB_TARGETS, kbPath,
  PDF_KB_TARGETS, pdfKbPath,
  SIGNATURE_KB_TARGETS, sigKbPath,
} from "@/lib/kbTargets";
import { BLOG_POSTS } from "@/lib/blog";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { CONVERT_SLUGS, convertPath } from "@/lib/convertPairs";

export const dynamic = "force-static";

// Site-wide "last significant update". Bump MANUALLY on real content changes —
// NOT new Date(), so lastmod reflects actual freshness instead of churning on
// every build/deploy (which Google distrusts). Blog posts use their own date.
const LAST_UPDATED = "2026-06-25";
const TRUST_PAGES_UPDATED = "2026-07-13";

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
  // Exam pages carry the date their spec was last verified against the official
  // source (verifiedOn), so lastmod reflects real freshness per exam instead of
  // a single site-wide date. Falls back to LAST_UPDATED when a spec has no date.
  const examFreshness = (key: string) => PORTAL_PRESETS[key]?.verifiedOn ?? LAST_UPDATED;

  // ── Plain routes (no dedicated OG image) ─────────────────────────────────
  // These pages appear in the sitemap without image entries.
  const simpleRoutes: string[] = [
    "/",
    "/tools/",
    ...SIGNATURE_KB_TARGETS.map((kb) => sigKbPath(kb)),
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
    ...KB_TARGETS.map((kb) => kbPath(kb)),
    ...PDF_KB_TARGETS.map((kb) => pdfKbPath(kb)),
    // Hinglish pages are noindex (thin duplicates) — intentionally not in sitemap.
    "/convert/",
    ...CONVERT_SLUGS.map((slug) => convertPath(slug)),
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
  return [
    // ── Simple pages (no images) ─────────────────────────────────────────────
    ...simpleRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LAST_UPDATED,
    })),

    // ── Indexable trust and methodology pages ───────────────────────────────
    ...trustRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: TRUST_PAGES_UPDATED,
    })),

    // ── Landing pages with OG images ─────────────────────────────────────────
    ...ogRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LAST_UPDATED,
      images: ogImg(path),
    })),

    // ── Country/visa maker pages — all use [maker]/opengraph-image ────────────
    ...MAKER_PAGES.map((m) => ({
      url: `${SITE_URL}/${m.slug}/`,
      lastModified: LAST_UPDATED,
      images: ogImg(`/${m.slug}/`),
    })),

    // ── Tool category landing pages (photo, pdf, signature, document, ocr) ───
    ...CATEGORY_SLUGS.map((s) => ({
      url: `${SITE_URL}/tools/${s}/`,
      lastModified: LAST_UPDATED,
      images: ogImg(`/tools/${s}/`),
    })),

    // ── Individual tool pages — all have opengraph-image.tsx ─────────────────
    ...READY_TOOLS.map((t) => ({
      url: `${SITE_URL}/tools/${t.slug}/`,
      lastModified: LAST_UPDATED,
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
}
