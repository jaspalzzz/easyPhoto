/**
 * Catalog of standalone utility tools.
 * ------------------------------------
 * ORDER MATTERS: groups and tools are arranged by search demand (highest-volume
 * queries first) so the most-trafficked tools surface first on the hub, the
 * featured row, and in internal links. `popular` flags the headline tools.
 * `icon` is a lucide icon name resolved in the UI.
 */

export interface ToolEntry {
  slug: string;
  title: string;
  blurb: string;
  ready: boolean;
  popular?: boolean;
  icon: string;
}

export interface ToolGroup {
  group: string;
  /** URL slug for the category landing page: /tools/<slug>/ */
  slug: string;
  /** One-line description for the category page + menu. */
  tagline: string;
  tools: ToolEntry[];
}

export const TOOLS_CATALOG: ToolGroup[] = [
  {
    group: "Photo Tools",
    slug: "photo",
    tagline:
      "Free photo utilities. Remove backgrounds, compress to a KB target, and resize, all in your browser.",
    tools: [
      {
        slug: "background-removal",
        title: "Background Remover",
        blurb: "Remove the background from any photo and download a transparent PNG.",
        ready: true,
        popular: true,
        icon: "Eraser",
      },
      {
        slug: "resize-kb",
        title: "Compress Image to KB",
        blurb: "Shrink a JPG or PNG to an exact file-size target, e.g. under 200 KB.",
        ready: true,
        popular: true,
        icon: "FileDown",
      },
      {
        slug: "resize-dimensions",
        title: "Resize Image (Pixels)",
        blurb: "Resize a photo to exact pixel width and height with crisp quality.",
        ready: true,
        popular: true,
        icon: "Scaling",
      },
      {
        slug: "white-background",
        title: "White Background Maker",
        blurb: "Replace any background with clean white (or any solid colour).",
        ready: true,
        icon: "PaintBucket",
      },
    ],
  },
  {
    group: "PDF Tools",
    slug: "pdf",
    tagline:
      "Free PDF utilities. Combine images into a PDF and export PDF pages back to images, privately.",
    tools: [
      {
        slug: "jpg-to-pdf",
        title: "JPG to PDF",
        blurb: "Combine images into a single PDF, one image per page.",
        ready: true,
        popular: true,
        icon: "FileStack",
      },
      {
        slug: "pdf-to-jpg",
        title: "PDF to JPG",
        blurb: "Export every page of a PDF as a high-quality JPG image.",
        ready: true,
        popular: true,
        icon: "FileImage",
      },
    ],
  },
  {
    group: "Signature Tools",
    slug: "signature",
    tagline:
      "Free signature utilities: crop, resize, remove the paper background and make a transparent PNG.",
    tools: [
      {
        slug: "transparent-signature",
        title: "Transparent Signature PNG",
        blurb: "Turn a signature scan into a clean, cropped, transparent PNG.",
        ready: true,
        icon: "PenLine",
      },
      {
        slug: "signature-background-removal",
        title: "Signature Background Removal",
        blurb: "Remove the paper background from a signature, keep the ink.",
        ready: true,
        icon: "Eraser",
      },
      {
        slug: "signature-crop",
        title: "Signature Crop",
        blurb: "Auto-trim a signature scan tight to the ink.",
        ready: true,
        icon: "Crop",
      },
      {
        slug: "signature-resize",
        title: "Signature Resize",
        blurb: "Resize a signature to the exact dimensions a form needs.",
        ready: true,
        icon: "Scaling",
      },
    ],
  },
];

const ALL = TOOLS_CATALOG.flatMap((g) => g.tools);

export const READY_TOOLS = ALL.filter((t) => t.ready);
export const POPULAR_TOOLS = ALL.filter((t) => t.popular && t.ready);

export function getTool(slug: string): ToolEntry | undefined {
  return ALL.find((t) => t.slug === slug);
}

export const CATEGORY_SLUGS = TOOLS_CATALOG.map((g) => g.slug);

export function getCategory(slug: string): ToolGroup | undefined {
  return TOOLS_CATALOG.find((g) => g.slug === slug);
}

/** The category group that contains a given tool slug. */
export function categoryOf(toolSlug: string): ToolGroup | undefined {
  return TOOLS_CATALOG.find((g) => g.tools.some((t) => t.slug === toolSlug));
}

/** Other ready tools from the same group — for on-page "related" cross-links. */
export function relatedTools(slug: string, limit = 3): ToolEntry[] {
  const group = TOOLS_CATALOG.find((g) => g.tools.some((t) => t.slug === slug));
  const pool = (group?.tools ?? []).filter((t) => t.ready && t.slug !== slug);
  if (pool.length >= limit) return pool.slice(0, limit);
  // Top up from other popular tools to keep the cross-link row full.
  const extra = POPULAR_TOOLS.filter(
    (t) => t.slug !== slug && !pool.some((p) => p.slug === t.slug)
  );
  return [...pool, ...extra].slice(0, limit);
}
