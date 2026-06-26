import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** Static robots.txt generated at build (output: export). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicitly allow AI search crawlers — they power ChatGPT web search,
      // Claude, Perplexity and Google AI Overviews citations.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      // Default: allow all other bots. Do not block /_next/ assets: Google
      // needs CSS and JavaScript access to render pages correctly.
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
