import { isDeindexed } from "@/lib/deindexed";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
import { MAKER_PAGES } from "@/lib/makerPages";

/**
 * Where AdSense may run. Owner decision, 14 Oct 2026 (option B): ads may show
 * on articles, guides, exam pages and photo-tool pages, below the tool and its
 * result. They never run on three kinds of page:
 *
 * 1. PRIVATE pages: ID documents, PDFs, text recognition, form filling and the
 *    legal pages. This is the privacy promise in app/privacy/page.tsx: Google's
 *    advertising and consent scripts are never loaded on them, and AdSenseScript
 *    reloads the page if a visitor arrives from an ad page by an in-site link.
 * 2. ISOLATED pages: the AI pages that run the multi-threaded background model
 *    and so send Cross-Origin-Embedder-Policy (public/_headers). Ad frames
 *    cannot load under COEP. test/adExclusions.test.ts keeps the two in sync.
 * 3. LOW-VALUE pages: every page taken out of the search index
 *    (lib/deindexed.ts), noindexed duplicates and embeddable widgets, which
 *    AdSense reviewers count against a site. An ad request is how Google's ad
 *    crawler finds a page, so a page hidden from search must never make one
 *    (1 Nov 2026 "low value content" review).
 */

/** Tools that handle ID documents, PDFs or extracted text: never any ad script. */
export const PRIVATE_TOOL_SLUGS = [
  "pdf-merge",
  "pdf-split",
  "pdf-compress",
  "unlock-pdf",
  "pdf-reorder",
  "sign-pdf",
  "watermark-pdf",
  "pdf-page-numbers",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "extract-pages",
  "document-scanner",
  "compress-document",
  "mask-aadhaar",
  "form-fill",
  "image-to-text",
  "pdf-to-text",
  "aadhaar-ocr",
  "pan-card-ocr",
] as const;

const PRIVATE_PATHS = new Set<string>([
  "/privacy/",
  "/terms/",
  "/disclaimer/",
  "/contact/",
  "/about/",
  "/unlock-aadhaar-pdf/",
  "/aadhaar-photo/",
  "/exam-requirements/pan/",
  "/pan-card-photo-resizer/",
  "/pan-card-signature-resizer/",
  ...PRIVATE_TOOL_SLUGS.map((slug) => `/tools/${slug}/`),
]);

/**
 * Pages that send COEP (public/_headers) because they run the multi-threaded
 * background model: the passport/visa makers, background removal, white
 * background and the resume photo maker, plus the homepage and the two maker
 * hubs, which hand a chosen photo straight to a maker.
 */
export const ISOLATED_PATHS: readonly string[] = [
  "/",
  "/passport-photo/",
  "/visa-photo/",
  "/baby-passport-photo/",
  "/tools/background-removal/",
  "/tools/white-background/",
  "/tools/resume-photo/",
  ...MAKER_PAGES.map((maker) => `/${maker.slug}/`),
];
const ISOLATED = new Set(ISOLATED_PATHS);

const LOW_VALUE_PATHS = new Set<string>(HINGLISH_SLUGS.map((slug) => `/${slug}/`));
const LOW_VALUE_PREFIXES = ["/embed/", "/exam-resizer/", "/tools/form-resizer/"] as const;

export function normalizeAdPath(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/** ID-document, PDF, text and legal pages: the ad script must never run here. */
export function isPrivateAdFreePath(pathname: string): boolean {
  return PRIVATE_PATHS.has(normalizeAdPath(pathname || "/"));
}

/** AI pages that send COEP, where ad frames can't load. */
export function isIsolatedPath(pathname: string): boolean {
  return ISOLATED.has(normalizeAdPath(pathname || "/"));
}

/** One policy boundary for every page that must not initialise AdSense. */
export function isAdSenseExcludedPath(pathname: string): boolean {
  const normalized = normalizeAdPath(pathname || "/");
  return (
    PRIVATE_PATHS.has(normalized) ||
    ISOLATED.has(normalized) ||
    LOW_VALUE_PATHS.has(normalized) ||
    isDeindexed(normalized) ||
    LOW_VALUE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  );
}
