/**
 * Image format-conversion landing pages.
 * --------------------------------------
 * One indexable page per (from → to) pair, e.g. /convert/heic-to-jpg/. Each page
 * renders the existing FormatConverterTool with the output format pre-selected,
 * so a single tool fans out into many keyword-exact URLs (heic→jpg, webp→jpg,
 * png→jpg …) that users actually search for. The "from" format is informational
 * copy — the tool auto-detects the uploaded file's real format.
 */
import type { FaqItem } from "@/components/site/Faq";

export type ConvertTargetFormat = "image/jpeg" | "image/png" | "image/webp";

export interface ConvertPair {
  /** URL slug under /convert/, e.g. "heic-to-jpg". */
  slug: string;
  /** Display name of the source format, e.g. "HEIC". */
  from: string;
  /** Display name of the target format, e.g. "JPG". */
  to: string;
  /** Output MIME the converter pre-selects. */
  target: ConvertTargetFormat;
  /** One-line "why convert" hook, used in copy + FAQ. */
  reason: string;
  /**
   * 2–3 sentences of format-specific, accurate prose rendered as a unique
   * on-page block — what actually happens in this conversion (lossless vs
   * lossy, transparency, compatibility). Differentiates each pair page from
   * its near-identical siblings. Facts only.
   */
  detail: string;
}

export const CONVERT_PAIRS: ConvertPair[] = [
  {
    slug: "heic-to-jpg",
    from: "HEIC",
    to: "JPG",
    target: "image/jpeg",
    reason:
      "HEIC is the format iPhones save photos in, but most websites, forms and Windows apps only accept JPG.",
    detail:
      "iPhones have saved photos as HEIC by default since iOS 11 because it stores the same quality in roughly half the space. The trade-off is reach: most exam portals, Windows photo viewers and older editors still expect JPG. Converting to JPG makes the photo open everywhere, while you keep the smaller HEIC original on your phone.",
  },
  {
    slug: "heic-to-png",
    from: "HEIC",
    to: "PNG",
    target: "image/png",
    reason:
      "Convert iPhone HEIC photos to widely-supported PNG when you need lossless quality or transparency support.",
    detail:
      "PNG is a lossless format, so converting a HEIC photo to PNG keeps every pixel intact — useful for screenshots, diagrams or images you plan to edit further. The file will be larger than the HEIC original, but it opens in virtually any app and supports a transparent background if you need one later.",
  },
  {
    slug: "webp-to-jpg",
    from: "WebP",
    to: "JPG",
    target: "image/jpeg",
    reason:
      "WebP images saved from the web often won't open in older editors or upload to forms — JPG works everywhere.",
    detail:
      "WebP is built for fast-loading websites, which is why images you save from the web often arrive in this format. Many upload forms, older software and some printers still reject it. Converting to JPG — the most universally accepted photo format — guarantees the image opens and uploads anywhere, with a quality slider to balance sharpness against file size.",
  },
  {
    slug: "webp-to-png",
    from: "WebP",
    to: "PNG",
    target: "image/png",
    reason:
      "Turn a WebP into a PNG to keep transparency and edit it in apps that don't read WebP.",
    detail:
      "Both WebP and PNG support transparency, so a logo or graphic with a see-through background keeps it through the conversion. PNG is lossless and far more widely supported in design and office software, making it the safer choice when you need to drop the image into an app that can't read WebP.",
  },
  {
    slug: "png-to-jpg",
    from: "PNG",
    to: "JPG",
    target: "image/jpeg",
    reason:
      "PNG files are large; converting to JPG shrinks the file size dramatically for email, forms and the web.",
    detail:
      "PNG stores every pixel without compression, so photographs saved as PNG end up several times larger than they need to be. JPG uses smart lossy compression that shrinks a photo dramatically with little visible difference — ideal when a form caps the file size or you're emailing images. Note that any transparent areas become white, since JPG has no transparency.",
  },
  {
    slug: "jpg-to-png",
    from: "JPG",
    to: "PNG",
    target: "image/png",
    reason:
      "Convert a JPG to PNG for lossless editing or to add a transparent background later.",
    detail:
      "Converting a JPG to PNG won't recover detail the JPG already discarded, but it stops any further quality loss from that point on — useful before repeated edits and re-saves. PNG also lets you erase the background to transparency, which a JPG can never hold. Expect a larger file in exchange for the lossless, edit-friendly format.",
  },
  {
    slug: "jpg-to-webp",
    from: "JPG",
    to: "WebP",
    target: "image/webp",
    reason:
      "WebP makes JPG photos noticeably smaller at the same quality — ideal for faster-loading websites.",
    detail:
      "WebP typically produces files around 25–30% smaller than JPG at the same visual quality, which is why it's the go-to format for speeding up websites and improving Core Web Vitals. It's supported by every current browser. Keep a JPG copy too if you also need to upload the image to a form or service that hasn't adopted WebP yet.",
  },
  {
    slug: "png-to-webp",
    from: "PNG",
    to: "WebP",
    target: "image/webp",
    reason:
      "WebP keeps PNG transparency while cutting the file size, perfect for web graphics and logos.",
    detail:
      "WebP supports the same transparency as PNG but compresses far more efficiently, so logos, icons and graphics with a see-through background load faster on the web without losing their alpha channel. It supports both lossless and lossy modes, letting you trade a little quality for an even smaller file when speed matters most.",
  },
  {
    slug: "heic-to-webp",
    from: "HEIC",
    to: "WebP",
    target: "image/webp",
    reason:
      "Convert iPhone HEIC photos straight to compact WebP for the web without a quality drop.",
    detail:
      "HEIC and WebP are both modern, highly-compressed formats — but WebP works in every browser, while HEIC barely renders outside Apple's ecosystem. Converting straight from HEIC to WebP keeps the file small and the quality high, making it the best pick for putting iPhone photos on a website without the bulk of a JPG or PNG.",
  },
];

export const CONVERT_SLUGS = CONVERT_PAIRS.map((p) => p.slug);

export function getConvertPair(slug: string): ConvertPair | undefined {
  return CONVERT_PAIRS.find((p) => p.slug === slug);
}

export const convertPath = (slug: string) => `/convert/${slug}/`;

/** Other pairs sharing the same source format — for on-page cross-links. */
export function relatedConvertPairs(slug: string, limit = 4): ConvertPair[] {
  const current = getConvertPair(slug);
  if (!current) return [];
  const sameSource = CONVERT_PAIRS.filter(
    (p) => p.slug !== slug && p.from === current.from
  );
  const rest = CONVERT_PAIRS.filter(
    (p) => p.slug !== slug && p.from !== current.from
  );
  return [...sameSource, ...rest].slice(0, limit);
}

/** Search-intent FAQ for a conversion pair (also emits FAQPage JSON-LD via ToolPage). */
export function convertPairFaqs(p: ConvertPair): FaqItem[] {
  return [
    {
      q: `How do I convert ${p.from} to ${p.to}?`,
      a: `Select your ${p.from} file (or drop several at once), and the tool converts it to ${p.to} right here. The output format is already set to ${p.to} — just press Convert All and download. Everything runs in your browser.`,
    },
    {
      q: `Is this ${p.from} to ${p.to} converter free, and are my files uploaded?`,
      a: `It's completely free with no watermark and no sign-up. Your images are never uploaded — the conversion happens entirely on your own device, so even private photos and documents stay with you.`,
    },
    {
      q: `Can I convert many ${p.from} files to ${p.to} at once?`,
      a: `Yes. Add multiple ${p.from} files and convert the whole batch in one go, then download them individually or as a single ZIP.`,
    },
    {
      q: `Will converting to ${p.to} reduce the quality?`,
      a:
        p.target === "image/png"
          ? `PNG is lossless, so no visible quality is lost when converting to ${p.to}.`
          : `${p.to} uses adjustable quality. The tool defaults to a high setting that keeps photos looking sharp, and you can raise or lower it with the quality slider.`,
    },
    {
      q: `Why convert ${p.from} to ${p.to}?`,
      a: p.reason,
    },
  ];
}
