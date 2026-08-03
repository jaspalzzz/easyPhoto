/**
 * Pages that stay live and linked but leave the search index.
 *
 * Selected on evidence, not word count alone: each of these is under 500
 * visible words AND drew fewer than 100 impressions in the 90 days to
 * 2026-08-02. Together they account for 15 clicks and 465 impressions — 1.7% of
 * site impressions — while making up a third of the indexed inventory, which is
 * what the "low value content" rejections keep pointing at.
 *
 * Word count alone would have been the wrong rule. /tools/sign-image/ is 405
 * words and earns 178 clicks and 4,973 impressions, more than half of all tool
 * clicks; it stays indexed. Intent match, not length, predicts what earns here.
 *
 * These tools remain fully usable and linked from /tools/, and the headers use
 * `noindex, follow` so internal links still pass. Kept in sync with
 * public/_headers by test/deindexed.test.ts.
 */
export const DEINDEXED_PATHS: readonly string[] = [
  // Zero impressions in the 55 days of Search Console history this property
  // holds, and among the least differentiated pages on the site (70-99 words of
  // their own inside 530-755 visible). Deindexed rather than padded, per the
  // review guidance that filler on a cookie-cutter page makes it worse.
  //
  // REVERSIBLE AND EXPECTED TO BE REVERSED for the exam pages: recruitment
  // traffic is seasonal and 55 days cannot show a notification cycle. When one
  // of these boards publishes and demand appears, write its notice-sourced
  // applicationNotes and take it back out of this list.
  "/exam-requirements/nabard/",
  "/exam-requirements/cisf/",
  "/exam-requirements/irdai/",
  "/exam-requirements/appsc/",
  "/exam-requirements/dsssb/",
  "/qatar-visa-photo-maker/",
  "/bahrain-visa-photo-maker/",
  // Country makers whose pages are almost entirely shared template. At a
  // two-page sharing threshold these hold 37, 39 and 42 unshared words inside
  // ~500 visible ones, and they earn 0, 0 and 2 clicks in 90 days. Spain and
  // Portugal restate the same EU Visa Code figures as the Schengen page;
  // Kuwait's own figures are recorded as disputed. The tools stay live.
  "/spain-visa-photo-maker/",
  "/portugal-visa-photo-maker/",
  "/kuwait-visa-photo-maker/",
  // Not a tool page: a 372-word guide with zero clicks and zero impressions in
  // 90 days, whose schema pointed at the deindexed /tools/unlock-pdf/.
  "/unlock-aadhaar-pdf/",
  "/tools/auto-crop/",
  "/tools/camera-capture/",
  "/tools/compliance-checker/",
  "/tools/compress-document/",
  "/tools/document/",
  "/tools/extract-pages/",
  "/tools/form-fill/",
  "/tools/format-converter/",
  "/tools/image-crop/",
  "/tools/image-to-text/",
  "/tools/jpg-to-pdf/",
  "/tools/linkedin-photo/",
  "/tools/mask-aadhaar/",
  "/tools/ocr/",
  "/tools/pdf/",
  "/tools/pdf-compress/",
  "/tools/pdf-merge/",
  "/tools/pdf-page-numbers/",
  "/tools/pdf-reorder/",
  "/tools/pdf-split/",
  "/tools/pdf-to-jpg/",
  "/tools/pdf-to-text/",
  "/tools/photo/",
  "/tools/photo-rejection-check/",
  "/tools/photo-validator/",
  "/tools/print-sheet/",
  "/tools/red-eye-removal/",
  "/tools/resize-dimensions/",
  "/tools/sign-pdf/",
  "/tools/signature/",
  "/tools/straighten-photo/",
  "/tools/transparent-signature/",
  "/tools/unlock-pdf/",
  "/tools/watermark-pdf/",
] as const;

const DEINDEXED = new Set(DEINDEXED_PATHS);

/** True when the path must be kept out of the sitemap and marked noindex. */
export function isDeindexed(path: string): boolean {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return DEINDEXED.has(normalized);
}
