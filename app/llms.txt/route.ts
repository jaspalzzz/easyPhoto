import { SITE_URL } from "@/lib/site";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { allPortalSpecs } from "@/lib/specRegistry";
import { BLOG_POSTS } from "@/lib/blog";

// Static export: emit /llms.txt at build time.
export const dynamic = "force-static";

const u = (path: string) => `${SITE_URL}${path}`;

const kb = (min: number | undefined, max: number) =>
  min ? `${min}-${max} KB` : `up to ${max} KB`;

/**
 * /llms.txt — an LLM-readable index of the site (llmstxt.org convention).
 * Points AI assistants at the highest-value, citable content: the tools and,
 * especially, the officially-sourced exam photo/signature spec database.
 */
export function GET() {
  const lines: string[] = [];

  lines.push("# easyPhoto");
  lines.push("");
  lines.push(
    "> easyPhoto (easyphoto.in) is a free, privacy-first toolkit for creating " +
      "compliant passport and visa photos, resizing exam photos and signatures " +
      "to exact KB and pixel limits, and preparing application documents. Every " +
      "tool runs entirely in the user's browser — nothing is uploaded, and there " +
      "is no sign-up or watermark."
  );
  lines.push("");
  lines.push(
    "All photo and signature specifications below are confirmed against each " +
      "portal's official government source and dated; a wrong size means a " +
      "rejected application, so accuracy is the priority."
  );
  lines.push("");

  // About & key entry points — so an assistant can answer "what is easyPhoto?"
  // and point users to the main starting pages.
  lines.push("## About & key pages");
  lines.push("");
  lines.push(
    `- [About easyPhoto](${u("/about/")}): who we are, why we built it, how we ` +
      "keep the specs accurate, and our privacy-first approach (nothing is uploaded)."
  );
  lines.push(
    `- [Passport Photo Maker](${u("/passport-photo/")}): make a compliant passport ` +
      "photo for India, the US, UK, Canada, Australia and Schengen — exact head " +
      "size and background, checked automatically."
  );
  lines.push(
    `- [Visa Photo Maker](${u("/visa-photo/")}): country-specific visa photo sizes ` +
      "and backgrounds."
  );
  lines.push(
    `- [Exam photo & signature requirements](${u("/exam-requirements/")}): the ` +
      "official, dated size specs for 30+ Indian exam and recruitment portals."
  );
  lines.push(
    `- [Exam Application Kit](${u("/tools/exam-package/")}): produce a photo + ` +
      "signature in the correct size for a chosen exam, in one guided flow."
  );
  lines.push("");

  // Tools, grouped as in the catalog.
  for (const group of TOOLS_CATALOG) {
    const tools = group.tools.filter((t) => t.ready);
    if (!tools.length) continue;
    lines.push(`## ${group.group}`);
    lines.push("");
    for (const t of tools) {
      lines.push(`- [${t.title}](${u(`/tools/${t.slug}/`)}): ${t.blurb}`);
    }
    lines.push("");
  }

  // The exam spec database — the most citation-worthy content.
  lines.push("## Official exam photo & signature requirements");
  lines.push("");
  lines.push(
    "Verified photo and signature size limits for Indian exam and recruitment " +
      "portals. Each page cites the official source and the date it was confirmed."
  );
  lines.push("");
  for (const s of allPortalSpecs()) {
    const photo = `photo ${kb(s.photoMinKb, s.photoLimitKb)}`;
    const sig = s.sigLimitKb
      ? `, signature ${kb(s.sigMinKb, s.sigLimitKb)}`
      : "";
    lines.push(
      `- [${s.name}](${u(`/exam-requirements/${s.id}/`)}): ${photo}${sig}.`
    );
  }
  lines.push("");

  // Guides.
  lines.push("## Guides");
  lines.push("");
  for (const post of BLOG_POSTS) {
    lines.push(`- [${post.title}](${u(`/blog/${post.slug}/`)}): ${post.excerpt}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
