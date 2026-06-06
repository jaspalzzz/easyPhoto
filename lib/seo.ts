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

/** Absolute URL for a path (canonical/OG need absolute URLs). */
export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
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
  // Only pin images when explicitly given; otherwise the route's generated
  // opengraph-image.tsx (or the layout default) supplies the card.
  const img = image ? absoluteUrl(image) : undefined;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
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
