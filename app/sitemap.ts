import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LAUNCH_ORDER } from "@/lib/countrySpecs";
import { READY_TOOLS, CATEGORY_SLUGS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { BLOG_POSTS } from "@/lib/blog";

export const dynamic = "force-static";

/** Static sitemap.xml generated at build (output: export). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    "/",
    "/tools/",
    "/passport-photo/",
    "/visa-photo/",
    "/signature-resize-to-20kb/",
    "/blog/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
    ...LAUNCH_ORDER.map((id) => `/${id}/`),
    ...CATEGORY_SLUGS.map((s) => `/tools/${s}/`),
    ...READY_TOOLS.map((t) => `/tools/${t.slug}/`),
    ...KB_TARGETS.map((kb) => kbPath(kb)),
    ...BLOG_POSTS.map((p) => `/blog/${p.slug}/`),
  ];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/tools/") ? 0.7 : 0.8,
  }));
}
