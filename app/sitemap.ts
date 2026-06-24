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

/** Static sitemap.xml generated at build (output: export). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    "/",
    "/tools/",
    "/passport-photo/",
    "/baby-passport-photo/",
    "/unlock-aadhaar-pdf/",
    "/visa-photo/",
    ...SIGNATURE_KB_TARGETS.map((kb) => sigKbPath(kb)),
    "/ssc-photo-resizer/",
    "/ssc-signature-resizer/",
    "/ssc-photo-with-name-date/",
    "/upsc-photo-resizer/",
    "/upsc-signature-resizer/",
    "/railway-photo-resizer/",
    "/ibps-photo-resizer/",
    "/sbi-po-photo-resizer/",
    "/nda-photo-resizer/",
    "/ctet-photo-resizer/",
    "/nta-photo-resizer/",
    "/gate-photo-resizer/",
    "/nabard-photo-resizer/",
    "/rbi-photo-resizer/",
    "/lic-photo-resizer/",
    "/tnpsc-photo-resizer/",
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
    ...MAKER_PAGES.map((m) => `/${m.slug}/`),
    ...CATEGORY_SLUGS.map((s) => `/tools/${s}/`),
    ...READY_TOOLS.map((t) => `/tools/${t.slug}/`),
    "/exam-requirements/",
    "/exam-photo-size/",
    "/exam-calendar/",
    "/pan-card-photo-resizer/",
    "/voter-id-photo-resizer/",
    "/driving-licence-photo-resizer/",
    "/aadhaar-photo/",
    ...KB_TARGETS.map((kb) => kbPath(kb)),
    ...PDF_KB_TARGETS.map((kb) => pdfKbPath(kb)),
    // Hinglish pages are noindex (thin duplicates) — intentionally not in sitemap.
    "/convert/",
    ...CONVERT_SLUGS.map((slug) => convertPath(slug)),
  ];

  // Site-wide "last significant update". Bump MANUALLY on real content changes —
  // NOT new Date(), so lastmod reflects actual freshness instead of churning on
  // every build/deploy (which Google distrusts). Blog posts use their own date.
  const LAST_UPDATED = "2026-06-24";

  // Exam pages carry the date their spec was last verified against the official
  // source (verifiedOn), so lastmod reflects real freshness per exam instead of
  // a single site-wide date. Falls back to LAST_UPDATED when a spec has no date.
  const examFreshness = (key: string) => PORTAL_PRESETS[key]?.verifiedOn ?? LAST_UPDATED;

  // Google ignores changeFrequency and priority — omit them for a leaner sitemap.
  return [
    ...routes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LAST_UPDATED,
    })),
    // Per-exam spec pages — lastmod = the spec's own verification date.
    ...PORTAL_KEYS.map((key) => ({
      url: `${SITE_URL}/exam-requirements/${key}/`,
      lastModified: examFreshness(key),
    })),
    ...PORTAL_KEYS.map((key) => ({
      url: `${SITE_URL}/tools/form-resizer/${key}/`,
      lastModified: examFreshness(key),
    })),
    // Sub-exam resizers (/exam-resizer/*) are noindex — they duplicate the
    // /exam-requirements/ intent and inherit the parent spec — so they are
    // intentionally omitted from the sitemap (AdSense low-value audit).
    // Blog posts carry their real publish date, or updatedISO if the content
    // was subsequently refreshed (set updatedISO in lib/blog.ts when refreshing).
    ...BLOG_POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: p.updatedISO ?? p.dateISO,
    })),
  ];
}
