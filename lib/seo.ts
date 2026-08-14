/**
 * SEO utilities — canonical URLs + a reusable page-metadata generator.
 * -------------------------------------------------------------------
 * Every page should build its Next `Metadata` through `pageMetadata()` so that
 * canonical, OpenGraph and Twitter tags stay consistent and correct. The site
 * uses `trailingSlash: true`, so all paths here carry a trailing slash to keep
 * canonicals identical to the rendered URLs (no duplicate-URL signals).
 */

import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./site";
import { isDeindexed } from "@/lib/deindexed";

/** Absolute URL for a path (canonical/OG need absolute URLs). */
export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

/**
 * Longest meta description Google will show before truncating the snippet.
 *
 * Not a ranking factor, but a description cut mid-clause reads as careless in
 * the one place a searcher decides whether to click.
 */
export const META_DESCRIPTION_LIMIT = 160;

/**
 * First sentence of a spec field, without its trailing full stop.
 *
 * Registry prose is written for the page body, where length is free, so it
 * ranges from "White or off-white" to a whole paragraph — Schengen's background
 * description runs 150 characters on its own. Templates that inlined it whole
 * produced a 246-character snippet, and a doubled full stop ("…handling the
 * application.. Make one free…") because the field already ends in one and the
 * template appended another.
 */
export function firstSentence(text: string): string {
  const first = text.trim().split(/(?<=\.)\s+/)[0] ?? text;
  return first.trim().replace(/\.+$/, "");
}

/**
 * Trim to the snippet limit on a word boundary.
 *
 * A safety net, not the primary mechanism: templates should compose copy that
 * already fits. This exists so a future registry entry with unusually long
 * prose cannot silently push a description past the limit again.
 */
export function clampDescription(
  text: string,
  max = META_DESCRIPTION_LIMIT,
): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  // Reserve one character for the ellipsis so the result is never over `max`.
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const body = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(
    /[\s,;:—–-]+$/,
    "",
  );
  return `${body}…`;
}

export interface PageMetaInput {
  /** Page title. By default the layout template appends "— easyPhoto". */
  title: string;
  /** Use the title verbatim (no brand suffix) — for precise SERP control. */
  titleAbsolute?: boolean;
  description: string;
  /** Route path WITH trailing slash, e.g. "/tools/resize-kb/". */
  path: string;
  /**
   * Explicit OG/Twitter image path. Leave unset to let a route's generated
   * `opengraph-image.tsx` card apply (or fall back to the site-wide /og.png
   * from the root layout). Only set this to force a specific static image.
   */
  image?: string;
  /** Set true to keep a page out of the index (e.g. gated content). */
  noIndex?: boolean;
  type?: "website" | "article";
}

/**
 * Production metadata for a page: title, description, canonical, OpenGraph and
 * Twitter — all derived from one input so they never drift apart.
 */
export function pageMetadata({
  title,
  titleAbsolute,
  description,
  path,
  image,
  noIndex,
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  // A deindexed page must carry the instruction in its own HTML. Relying on the
  // _headers X-Robots-Tag alone put the whole reduction at the mercy of edge
  // path matching — and those rules were written without the trailing slash the
  // site canonicalises to, so they would not have matched the served URL at all.
  // Deriving it here means the tag ships with the page and is build-verifiable.
  const excluded = noIndex || isDeindexed(path);
  // Only pin images when explicitly given; otherwise the route's generated
  // opengraph-image.tsx (or the layout default) supplies the card.
  const img = image ? absoluteUrl(image) : undefined;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    // Thin/duplicate tiers are kept live for users but removed from the index;
    // follow:true so link equity still flows to the canonical pages they link to.
    ...(excluded ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      ...(img
        ? { images: [{ url: img, width: 1200, height: 630, alt: SITE_NAME }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(img ? { images: [img] } : {}),
    },
  };
}
