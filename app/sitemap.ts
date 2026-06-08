import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { MAKER_PAGES } from "@/lib/makerPages";
import { READY_TOOLS, CATEGORY_SLUGS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { BLOG_POSTS } from "@/lib/blog";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";

export const dynamic = "force-static";

/** Static sitemap.xml generated at build (output: export). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    "/",
    "/tools/",
    "/passport-photo/",
    "/baby-passport-photo/",
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
    ...MAKER_PAGES.map((m) => `/${m.slug}/`),
    ...CATEGORY_SLUGS.map((s) => `/tools/${s}/`),
    ...READY_TOOLS.map((t) => `/tools/${t.slug}/`),
    ...PORTAL_KEYS.map((key) => `/tools/form-resizer/${key}/`),
    ...KB_TARGETS.map((kb) => kbPath(kb)),
    ...HINGLISH_SLUGS.map((s) => `/${s}/`),
    ...BLOG_POSTS.map((p) => `/blog/${p.slug}/`),
  ];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/tools/") ? 0.7 : 0.8,
  }));
}
