/**
 * The OCR engine start must be bounded: a stalled or failed engine/language
 * download has to end in a clear error, never leave the tools on
 * "Loading OCR engine… 0%" forever.
 *
 * tesseract.js is stubbed: the real one needs a Web Worker and CDN downloads.
 * The stub mirrors its real behaviour — when a language download fails,
 * createWorker() never settles its promise and only calls `errorHandler`.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const createWorker = vi.hoisted(() => vi.fn());
vi.mock("tesseract.js", () => ({ createWorker }));

import {
  getOcrWorker,
  recognizeImage,
  terminateOcrWorker,
  OCR_ENGINE_LOAD_ERROR,
  OCR_ENGINE_LOAD_TIMEOUT_MS,
} from "@/lib/ocr";

type Options = { errorHandler?: (e: unknown) => void };

function fakeWorker() {
  return {
    setParameters: vi.fn(async () => ({})),
    recognize: vi.fn(async () => ({ data: { text: " HELLO 123 \n", confidence: 91.6 } })),
    terminate: vi.fn(async () => ({})),
  };
}

/** createWorker stand-in whose language download fails (reported via errorHandler). */
function downloadFails() {
  return (_lang: string, _oem: number, opts: Options) => {
    queueMicrotask(() =>
      opts.errorHandler?.("Network error while fetching eng.traineddata.gz")
    );
    return new Promise(() => {});
  };
}

/** Track a promise's outcome without awaiting it (a hang must not hang the test). */
function outcome<T>(p: Promise<T>) {
  const o: { value?: T; error?: Error } = {};
  p.then(
    (v) => (o.value = v),
    (e) => (o.error = e)
  );
  return o;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  terminateOcrWorker();
});

afterEach(() => {
  createWorker.mockReset();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("OCR engine start", () => {
  it("rejects with a clear error when the engine download stalls", async () => {
    createWorker.mockReturnValue(new Promise(() => {}));
    const run = outcome(recognizeImage("card.png", "eng"));

    await vi.advanceTimersByTimeAsync(OCR_ENGINE_LOAD_TIMEOUT_MS - 1);
    expect(run.error, "must not give up before the limit").toBeUndefined();

    await vi.advanceTimersByTimeAsync(1);
    expect(run.error?.message).toBe(OCR_ENGINE_LOAD_ERROR);
  });

  it("terminates a worker that finishes loading after the time limit", async () => {
    const late = fakeWorker();
    let finish: (w: unknown) => void = () => {};
    createWorker.mockReturnValue(new Promise((r) => (finish = r)));
    const run = outcome(recognizeImage("card.png", "eng"));
    await vi.advanceTimersByTimeAsync(OCR_ENGINE_LOAD_TIMEOUT_MS);
    expect(run.error?.message).toBe(OCR_ENGINE_LOAD_ERROR);

    finish(late);
    await vi.advanceTimersByTimeAsync(0);
    expect(late.terminate).toHaveBeenCalled();
    expect(late.recognize, "a late worker must not run the abandoned job").not.toHaveBeenCalled();
  });

  it("fails fast with the same error when a language download fails", async () => {
    createWorker.mockImplementation(downloadFails());
    const run = outcome(recognizeImage("card.png", "eng+hin"));

    await vi.advanceTimersByTimeAsync(0);
    expect(run.error?.message).toBe(OCR_ENGINE_LOAD_ERROR);
  });

  it("still recognises normally when the engine loads", async () => {
    createWorker.mockImplementation(async () => fakeWorker());
    await expect(recognizeImage("card.png", "eng")).resolves.toEqual({
      text: "HELLO 123",
      confidence: 92,
    });
  });

  it("does not cache a failed shared worker: the next call retries", async () => {
    createWorker.mockImplementationOnce(downloadFails());
    const first = outcome(getOcrWorker("eng"));
    await vi.advanceTimersByTimeAsync(0);
    expect(first.error?.message).toBe(OCR_ENGINE_LOAD_ERROR);

    createWorker.mockImplementationOnce(async () => fakeWorker());
    await expect(getOcrWorker("eng")).resolves.toBeDefined();
    expect(createWorker).toHaveBeenCalledTimes(2);
  });
});
