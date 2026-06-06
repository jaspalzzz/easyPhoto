import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LAUNCH_ORDER } from "@/lib/countrySpecs";
import { READY_TOOLS } from "@/lib/toolsCatalog";

export const dynamic = "force-static";

/** Static sitemap.xml generated at build (output: export). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    "/",
    "/tools/",
    "/privacy/",
    "/terms/",
    ...LAUNCH_ORDER.map((id) => `/${id}/`),
    ...READY_TOOLS.map((t) => `/tools/${t.slug}/`),
  ];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/tools/") ? 0.7 : 0.8,
  }));
}
