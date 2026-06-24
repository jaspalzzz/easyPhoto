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

// Only the LSTM-optimised WASM variants — smaller and more accurate than full Tesseract.
const CORE_CDN =
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@7/";

const LANG_CDN =
  "https://cdn.jsdelivr.net/npm/@tesseract.js-data/";

export type OcrLang = "eng" | "hin" | "eng+hin";

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
      const w = await createWorker(lang, undefined, {
        workerPath: "/tessdata/worker.min.js",
        corePath: CORE_CDN,
        langPath: LANG_CDN,
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

export async function recognizeImage(
  source: Blob | HTMLCanvasElement | string,
  lang: OcrLang = "eng",
  onProgress?: (pct: number) => void
): Promise<OcrResult> {
  const { createWorker } = await import("tesseract.js");

  // Spin up a fresh worker for each call so progress events are clean.
  // For batch use cases, callers can use getOcrWorker() directly.
  const w = await createWorker(lang, undefined, {
    workerPath: "/tessdata/worker.min.js",
    corePath: CORE_CDN,
    langPath: LANG_CDN,
    logger: onProgress
      ? (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            onProgress(Math.round(m.progress * 100));
          }
        }
      : undefined,
  });

  try {
    const { data } = await w.recognize(source as Parameters<typeof w.recognize>[0]);
    return { text: data.text.trim(), confidence: Math.round(data.confidence) };
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
