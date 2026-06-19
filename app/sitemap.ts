import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { MAKER_PAGES } from "@/lib/makerPages";
import { READY_TOOLS, CATEGORY_SLUGS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath, PDF_KB_TARGETS, pdfKbPath } from "@/lib/kbTargets";
import { BLOG_POSTS } from "@/lib/blog";
import { PORTAL_KEYS, PORTAL_PRESETS } from "@/lib/portalPresets";
import { SUB_EXAM_RESIZERS } from "@/lib/subExamResizers";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
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
    "/signature-resize-to-10kb/",
    "/signature-resize-to-20kb/",
    "/signature-resize-to-50kb/",
    "/signature-resize-to-100kb/",
    "/ssc-photo-resizer/",
    "/ssc-signature-resizer/",
    "/ssc-photo-with-name-date/",
    "/upsc-photo-resizer/",
    "/upsc-signature-resizer/",
    "/railway-photo-resizer/",
    "/ibps-photo-resizer/",
    "/sbi-po-photo-resizer/",
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
    ...HINGLISH_SLUGS.map((s) => `/${s}/`),
    "/convert/",
    ...CONVERT_SLUGS.map((slug) => convertPath(slug)),
  ];

  // Site-wide "last significant update". Bump MANUALLY on real content changes —
  // NOT new Date(), so lastmod reflects actual freshness instead of churning on
  // every build/deploy (which Google distrusts). Blog posts use their own date.
  const LAST_UPDATED = "2026-06-18";

  // Exam pages carry the date their spec was last verified against the official
  // source (verifiedOn), so lastmod reflects real freshness per exam instead of
  // a single site-wide date. Falls back to LAST_UPDATED when a spec has no date.
  const examFreshness = (key: string) => PORTAL_PRESETS[key]?.verifiedOn ?? LAST_UPDATED;

  // Low-churn legal / company pages: rarely change and shouldn't compete with
  // tool/content pages for crawl priority.
  const LEGAL = new Set([
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/disclaimer/",
  ]);

  return [
    ...routes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LAST_UPDATED,
      changeFrequency: (LEGAL.has(path)
        ? "yearly"
        : path === "/"
        ? "weekly"
        : "monthly") as "yearly" | "weekly" | "monthly",
      priority: LEGAL.has(path)
        ? 0.3
        : path === "/"
        ? 1
        : path.startsWith("/tools/")
        ? 0.7
        : 0.8,
    })),
    // Per-exam spec pages — lastmod = the spec's own verification date.
    ...PORTAL_KEYS.map((key) => ({
      url: `${SITE_URL}/exam-requirements/${key}/`,
      lastModified: examFreshness(key),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...PORTAL_KEYS.map((key) => ({
      url: `${SITE_URL}/tools/form-resizer/${key}/`,
      lastModified: examFreshness(key),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Sub-exam resizers inherit their parent spec's verification date.
    ...SUB_EXAM_RESIZERS.map((e) => ({
      url: `${SITE_URL}/exam-resizer/${e.slug}/`,
      lastModified: examFreshness(e.parentId),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Blog posts carry their real publish date, or updatedISO if the content
    // was subsequently refreshed (set updatedISO in lib/blog.ts when refreshing).
    ...BLOG_POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: p.updatedISO ?? p.dateISO,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
