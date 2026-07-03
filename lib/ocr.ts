/**
 * Lazy Tesseract.js wrapper.
 *
 * The worker is initialised once and reused across recognize() calls.
 * All OCR runs in the browser — the user's image never leaves the device.
 * Tesseract's WASM engine + language data are fetched from jsDelivr on first
 * use; the worker script itself is served from /tessdata/worker.min.js so the
 * critical path doesn't depend on an external CDN.
 */

import type { Worker } from "tesseract.js";
import { preprocessForOcr, type PreprocessOptions } from "./ocrPreprocess";

// LSTM-only core from jsDelivr — tesseract.js v7 auto-picks the right SIMD
// variant (relaxedsimd-lstm / simd-lstm / lstm) based on browser capability.
const CORE_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js-core@7/";

// OEM 1 = LSTM_ONLY. Must be explicit — passing `undefined` makes the library
// treat lstmOnly as false, loading the full legacy Tesseract core which does
// not exist at this CDN path, hanging the worker indefinitely.
const OEM_LSTM_ONLY = 1 as const;

export type OcrLang = "eng" | "hin" | "eng+hin";

/**
 * Tesseract page segmentation modes we use. The engine assumes layout based on
 * this, so matching it to the input materially changes accuracy.
 */
export const PSM = {
  /** Fully automatic page segmentation (default) — general documents. */
  AUTO: 3,
  /** A single uniform block of text — a tidy cropped paragraph or card. */
  SINGLE_BLOCK: 6,
  /** A single text line — one extracted field row. */
  SINGLE_LINE: 7,
  /** Sparse text, any order — scattered ID-card labels/values. */
  SPARSE: 11,
} as const;

export type PsmValue = (typeof PSM)[keyof typeof PSM];

export interface OcrParams {
  /** Page segmentation mode. Default AUTO. */
  psm?: PsmValue;
  /** Restrict recognised characters (e.g. "0123456789" for a digit field). */
  charWhitelist?: string;
  /** Hint the engine that input is ~300 DPI (set when upscaling). Default 300. */
  dpi?: number;
  /** Keep spacing between words — helps parse grouped numbers. Default true. */
  preserveInterwordSpaces?: boolean;
}

let workerInstance: Worker | null = null;
let currentLang: OcrLang | null = null;
let workerPromise: Promise<Worker> | null = null;

export async function getOcrWorker(lang: OcrLang = "eng"): Promise<Worker> {
  // Reuse worker if the requested language matches.
  if (workerInstance && currentLang === lang) return workerInstance;

  // Terminate the old worker if the language changed.
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
    currentLang = null;
    workerPromise = null;
  }

  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import("tesseract.js");
      const w = await createWorker(lang, OEM_LSTM_ONLY, {
        workerPath: "/tessdata/worker.min.js",
        corePath: CORE_CDN,
        // langPath omitted → tesseract.js auto-resolves the correct jsDelivr
        // URL for the LSTM-only traineddata (e.g. @tesseract.js-data/eng/4.0.0_best_int)
      });
      workerInstance = w;
      currentLang = lang;
      return w;
    })();
  }

  return workerPromise;
}

export interface OcrResult {
  text: string;
  confidence: number;
}

/** Translate our typed params into Tesseract's string-keyed parameter map. */
function toTesseractParams(params: OcrParams): Record<string, string> {
  const p: Record<string, string> = {
    tessedit_pageseg_mode: String(params.psm ?? PSM.AUTO),
    user_defined_dpi: String(params.dpi ?? 300),
    preserve_interword_spaces: params.preserveInterwordSpaces === false ? "0" : "1",
  };
  // Whitelist must be set every call: passing "" actively clears a prior one.
  p.tessedit_char_whitelist = params.charWhitelist ?? "";
  return p;
}

export async function recognizeImage(
  source: Blob | HTMLCanvasElement | string,
  lang: OcrLang = "eng",
  onProgress?: (pct: number) => void,
  params: OcrParams = {}
): Promise<OcrResult> {
  const { createWorker } = await import("tesseract.js");

  // Spin up a fresh worker for each call so progress events are clean.
  // For batch use cases, callers can use getOcrWorker() directly.
  const w = await createWorker(lang, OEM_LSTM_ONLY, {
    workerPath: "/tessdata/worker.min.js",
    corePath: CORE_CDN,
    // langPath omitted → auto-resolves correct jsDelivr URL for LSTM traineddata
    logger: onProgress
      ? (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            onProgress(Math.round(m.progress * 100));
          }
        }
      : undefined,
  });

  try {
    await w.setParameters(toTesseractParams(params));
    const { data } = await w.recognize(source as Parameters<typeof w.recognize>[0]);
    return { text: data.text.trim(), confidence: Math.round(data.confidence) };
  } finally {
    await w.terminate();
  }
}

export interface RecognizeFileOptions {
  lang?: OcrLang;
  params?: OcrParams;
  preprocess?: PreprocessOptions | false;
  onProgress?: (pct: number) => void;
}

/**
 * High-level helper: preprocess a user-selected file (grayscale + upscale +
 * contrast, see {@link preprocessForOcr}) then run OCR on the cleaned image.
 * This is the recommended entry point for tools — it is what lifts real phone
 * photos to a resolution the engine can actually read. Pass `preprocess: false`
 * to recognise the original bytes unchanged.
 */
export async function recognizeFile(
  file: File,
  { lang = "eng", params = {}, preprocess = {}, onProgress }: RecognizeFileOptions = {}
): Promise<OcrResult> {
  const source: Blob | HTMLCanvasElement =
    preprocess === false ? file : await preprocessForOcr(file, preprocess);
  return recognizeImage(source, lang, onProgress, params);
}

export interface DualPassResult {
  /** Full-text pass: all characters, language-aware. Use for name/address. */
  primary: OcrResult;
  /** Whitelist pass: restricted character set. Use for number/ID field extraction. */
  numeric: OcrResult;
}

export interface RecognizeFileDualPassOptions {
  lang?: OcrLang;
  onProgress?: (pct: number) => void;
  preprocess?: PreprocessOptions | false;
  /**
   * Characters allowed in the second (whitelist) pass.
   * Default: digits + space — sufficient for Aadhaar (12-digit number).
   * For PAN, pass "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 " to cover the mixed format.
   */
  secondPassWhitelist?: string;
  /**
   * Extra quarter-turn rotations (90 | 180 | 270, degrees clockwise) for the
   * whitelist pass. Aadhaar prints its number VERTICALLY along the card edge
   * on several layouts — unreadable in the normal orientation, clean once the
   * canvas is turned. Each rotation's output is appended to `numeric.text`;
   * downstream parsers checksum-gate every candidate, so text read from a
   * "wrong" orientation costs nothing but the extra pass time.
   * Requires preprocessing (source must be a canvas); ignored otherwise.
   */
  numericRotations?: Array<90 | 180 | 270>;
}

/** Confidence (0–100) below which the full-text pass is retried with a
 *  different segmentation mode. SPARSE suits scattered ID-card layouts, but
 *  on some cards SINGLE_BLOCK reads far better — when SPARSE comes back this
 *  weak, the retry is usually the difference between fields and mush. */
const RETRY_CONFIDENCE = 55;

/** Rotate a canvas by a quarter-turn multiple (degrees clockwise). */
function rotateQuarter(src: HTMLCanvasElement, deg: 90 | 180 | 270): HTMLCanvasElement {
  const out = document.createElement("canvas");
  const swap = deg !== 180;
  out.width = swap ? src.height : src.width;
  out.height = swap ? src.width : src.height;
  const ctx = out.getContext("2d");
  if (!ctx) return src;
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return out;
}

/**
 * Two-pass OCR on a single worker.
 *
 * Pass 1 — full-language, no whitelist, PSM_SPARSE: reads everything on the
 * card including name, DOB, address, and Hindi Devanagari.
 *
 * Pass 2 — restricted whitelist, PSM_SPARSE: the constrained character set
 * means Tesseract can't swap O↔0 or I↔1 across classes, so structured fields
 * (Aadhaar number, VID, PAN) come through cleaner. Parsers prefer Pass 2 text
 * for those fields and fall back to Pass 1 for prose fields.
 *
 * Using one worker for both passes avoids a second model-load (~600 ms) and
 * keeps total wall-clock time close to a single pass.
 */
export async function recognizeFileDualPass(
  file: File,
  {
    lang = "eng",
    onProgress,
    preprocess = {},
    secondPassWhitelist = "0123456789 ",
    numericRotations = [],
  }: RecognizeFileDualPassOptions = {}
): Promise<DualPassResult> {
  const { createWorker } = await import("tesseract.js");

  const source: Blob | HTMLCanvasElement =
    preprocess === false
      ? file
      : await preprocessForOcr(file, preprocess as PreprocessOptions);

  // Rotations need a canvas to turn; silently skip them for raw-file input.
  const rotations = source instanceof HTMLCanvasElement ? numericRotations : [];

  // Progress budget: 55% for the full-text pass (a low-confidence retry
  // re-runs inside the same slice), the rest split across the whitelist
  // pass and its rotations.
  const numericPasses = 1 + rotations.length;
  const numericScale = 0.45 / numericPasses;
  const ps = { offset: 0, scale: 0.55 };

  const w = await createWorker(lang, OEM_LSTM_ONLY, {
    workerPath: "/tessdata/worker.min.js",
    corePath: CORE_CDN,
    logger: onProgress
      ? (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            onProgress(
              Math.min(99, Math.round(ps.offset + m.progress * ps.scale * 100))
            );
          }
        }
      : undefined,
  });

  try {
    // ── Pass 1: full text (SPARSE, retry as SINGLE_BLOCK when weak) ────────
    await w.setParameters(
      toTesseractParams({ psm: PSM.SPARSE, preserveInterwordSpaces: true })
    );
    const r1 = await w.recognize(source as Parameters<typeof w.recognize>[0]);
    let primary: OcrResult = {
      text: r1.data.text.trim(),
      confidence: Math.round(r1.data.confidence),
    };

    if (primary.confidence < RETRY_CONFIDENCE) {
      await w.setParameters(
        toTesseractParams({ psm: PSM.SINGLE_BLOCK, preserveInterwordSpaces: true })
      );
      const retry = await w.recognize(source as Parameters<typeof w.recognize>[0]);
      const retried: OcrResult = {
        text: retry.data.text.trim(),
        confidence: Math.round(retry.data.confidence),
      };
      if (retried.confidence > primary.confidence) primary = retried;
    }

    // ── Pass 2: whitelist pass (+ optional quarter-turn rotations) ─────────
    await w.setParameters(
      toTesseractParams({
        psm: PSM.SPARSE,
        charWhitelist: secondPassWhitelist,
        preserveInterwordSpaces: true,
      })
    );

    ps.offset = 55;
    ps.scale = numericScale;
    const r2 = await w.recognize(source as Parameters<typeof w.recognize>[0]);
    const numericTexts = [r2.data.text.trim()];
    const numericConfidence = Math.round(r2.data.confidence);

    for (const deg of rotations) {
      ps.offset += numericScale * 100;
      const rotated = rotateQuarter(source as HTMLCanvasElement, deg);
      const rr = await w.recognize(rotated as Parameters<typeof w.recognize>[0]);
      numericTexts.push(rr.data.text.trim());
    }

    const numeric: OcrResult = {
      text: numericTexts.filter(Boolean).join("\n"),
      confidence: numericConfidence,
    };

    onProgress?.(100);
    return { primary, numeric };
  } finally {
    await w.terminate();
  }
}

export function terminateOcrWorker(): void {
  workerInstance?.terminate();
  workerInstance = null;
  currentLang = null;
  workerPromise = null;
}
