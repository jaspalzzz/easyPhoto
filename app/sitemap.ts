import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { MAKER_PAGES } from "@/lib/makerPages";
import { SUB_EXAM_SLUGS } from "@/lib/subExamResizers";
import { READY_TOOLS, CATEGORY_SLUGS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath, PDF_KB_TARGETS, pdfKbPath } from "@/lib/kbTargets";
import { BLOG_POSTS } from "@/lib/blog";
import { PORTAL_KEYS } from "@/lib/portalPresets";
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
    ...PORTAL_KEYS.map((key) => `/tools/form-resizer/${key}/`),
    "/exam-requirements/",
    "/exam-photo-size/",
    "/exam-calendar/",
    "/pan-card-photo-resizer/",
    "/voter-id-photo-resizer/",
    "/driving-licence-photo-resizer/",
    "/aadhaar-photo/",
    ...SUB_EXAM_SLUGS.map((s) => `/exam-resizer/${s}/`),
    ...PORTAL_KEYS.map((key) => `/exam-requirements/${key}/`),
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

  return [
    ...routes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: LAST_UPDATED,
      changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : path.startsWith("/tools/") ? 0.7 : 0.8,
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
