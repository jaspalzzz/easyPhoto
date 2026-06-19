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
        slug: "exam-package",
        title: "Exam Application Kit",
        blurb: "Get a photo + signature in the correct size for any exam, in one guided flow.",
        ready: true,
        popular: true,
        icon: "FileStack",
      },
      {
        slug: "compliance-checker",
        title: "Exam Photo & Signature Checker",
        blurb: "Check if your exam photo or signature will be rejected — size, dimensions & format vs the official spec.",
        ready: true,
        icon: "BadgeCheck",
      },
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
        slug: "linkedin-photo",
        title: "LinkedIn Photo Maker",
        blurb: "Crop any photo to a square LinkedIn profile picture, centred on your face.",
        ready: true,
        popular: true,
        icon: "UserSquare",
      },
      {
        slug: "resume-photo",
        title: "Resume / CV Photo Maker",
        blurb: "Make a professional passport-size photo for your resume, CV or bio-data.",
        ready: true,
        icon: "IdCard",
      },
      {
        slug: "white-background",
        title: "White Background Maker",
        blurb: "Replace any background with clean white (or any solid colour).",
        ready: true,
        icon: "PaintBucket",
      },
      {
        slug: "format-converter",
        title: "Image Format Converter",
        blurb: "Convert images between JPG, PNG, WebP, and HEIC offline.",
        ready: true,
        icon: "RefreshCw",
      },
      {
        slug: "photo-with-name-date",
        title: "Photo with Name and Date",
        blurb: "Add a custom name and date text strip at the bottom of your passport photo.",
        ready: true,
        popular: true,
        icon: "Calendar",
      },
      {
        slug: "mask-aadhaar",
        title: "Mask Aadhaar / Document",
        blurb: "Hide the first 8 digits of your Aadhaar (or any sensitive detail) with a permanent black redaction — fully in your browser.",
        ready: true,
        icon: "EyeOff",
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
      {
        slug: "pdf-merge",
        title: "Merge PDF",
        blurb: "Combine multiple PDF documents into a single document privately.",
        ready: true,
        popular: true,
        icon: "FileText",
      },
      {
        slug: "pdf-split",
        title: "Split PDF",
        blurb: "Extract selected pages or split PDF pages into a new document.",
        ready: true,
        popular: true,
        icon: "Scissors",
      },
      {
        slug: "pdf-compress",
        title: "Compress PDF to KB",
        blurb: "Shrink a PDF to fit form upload limits (100 KB, 200 KB, 500 KB).",
        ready: true,
        popular: true,
        icon: "FileDown",
      },
      {
        slug: "unlock-pdf",
        title: "Unlock PDF (Remove Password)",
        blurb: "Remove the password from a protected PDF — like the e-Aadhaar — and download an unprotected copy.",
        ready: true,
        popular: true,
        icon: "LockOpen",
      },
      {
        slug: "pdf-reorder",
        title: "Reorder & Rotate PDF",
        blurb: "Rearrange, rotate, or delete pages of a PDF visually.",
        ready: true,
        popular: true,
        icon: "ArrowUpDown",
      },
      {
        slug: "sign-pdf",
        title: "Sign PDF Document",
        blurb: "Draw or place a signature image on any page of a PDF.",
        ready: true,
        popular: true,
        icon: "PenLine",
      },
      {
        slug: "watermark-pdf",
        title: "Watermark PDF",
        blurb: "Stamp a text watermark (CONFIDENTIAL, DRAFT…) across every page.",
        ready: true,
        icon: "Stamp",
      },
      {
        slug: "pdf-page-numbers",
        title: "Add Page Numbers to PDF",
        blurb: "Number every page — choose the position, format and start value.",
        ready: true,
        icon: "Hash",
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
        blurb: "Crop a signature tight to the ink — drag the box or auto-detect.",
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
      {
        slug: "signature-cleaner",
        title: "Signature Cleaner",
        blurb: "Clean scan background, crop tightly, and optimize file size.",
        ready: true,
        popular: true,
        icon: "PenLine",
      },
      {
        slug: "sign-image",
        title: "Sign Image / Photo",
        blurb: "Draw or overlay a transparent signature on any photo or image.",
        ready: true,
        popular: true,
        icon: "PenLine",
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

/**
 * Color category for a tool — drives the vibrant icon-tile wayfinding colors.
 * Maps the 3 catalog groups (photo/pdf/signature) plus a few semantic overrides
 * so privacy / convert / exam tools get their own hue.
 */
export type ToolColorCategory =
  | "photo"
  | "pdf"
  | "signature"
  | "privacy"
  | "convert"
  | "exam";

const COLOR_OVERRIDE: Record<string, ToolColorCategory> = {
  "mask-aadhaar": "privacy",
  "unlock-pdf": "privacy",
  "format-converter": "convert",
  "exam-package": "exam",
  "compliance-checker": "exam",
};

export function toolColorCategory(toolSlug: string): ToolColorCategory {
  const override = COLOR_OVERRIDE[toolSlug];
  if (override) return override;
  const g = categoryOf(toolSlug)?.slug;
  if (g === "pdf") return "pdf";
  if (g === "signature") return "signature";
  return "photo";
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
