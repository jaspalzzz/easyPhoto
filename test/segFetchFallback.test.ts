/**
 * Background-removal model downloads must not hang on a stalled host:
 * - the primary model host (R2) gets a time-to-first-byte limit, so a stall
 *   falls through to the mirror instead of waiting forever (previously the
 *   mirror only kicked in on a network error);
 * - the WebGPU adapter probe is bounded, so a hung requestAdapter() means
 *   "no WebGPU" instead of blocking every run before it starts.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createSegFetch,
  webgpuSupportsF16,
  SEG_PRIMARY_TTFB_MS,
  WEBGPU_PROBE_TIMEOUT_MS,
} from "@/lib/segmentation";

const PRIMARY = "https://models.easyphoto.in/seg/onnx/model_quantized.onnx";
const MIRROR = "https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model_quantized.onnx";

/** A host that accepts the request but never sends headers — until aborted, like real fetch. */
function stalls(_url: string, init?: RequestInit): Promise<Response> {
  return new Promise((_, reject) => {
    const signal = init?.signal;
    signal?.addEventListener("abort", () =>
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"))
    );
  });
}

/** fetch stub: the primary host behaves per `primary`, the mirror answers. */
function network(primary: (url: string, init?: RequestInit) => Promise<Response>) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith("https://models.easyphoto.in/")) return primary(url, init);
    if (url.startsWith("https://huggingface.co/")) return new Response("mirror", { status: 200 });
    return new Response("other", { status: 200 });
  });
}

/** Track a promise's outcome without awaiting it (a hang must not hang the test). */
function outcome<T>(p: Promise<T>) {
  const o: { value?: T; error?: unknown } = {};
  p.then(
    (v) => (o.value = v),
    (e) => (o.error = e)
  );
  return o;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("segmentation model fetch", () => {
  it("falls through to the mirror when the primary host stalls before answering", async () => {
    const fetchFn = network(stalls);
    const run = outcome(createSegFetch(fetchFn)(PRIMARY));

    await vi.advanceTimersByTimeAsync(SEG_PRIMARY_TTFB_MS - 1);
    expect(run.value, "must not give up on the primary before the limit").toBeUndefined();

    await vi.advanceTimersByTimeAsync(1);
    expect(await (run.value as Response).text()).toBe("mirror");
    expect(fetchFn).toHaveBeenLastCalledWith(MIRROR, undefined);
  });

  it("keeps a primary response that starts in time, without cutting its download short", async () => {
    let signal: AbortSignal | undefined;
    const fetchFn = network(async (_url, init) => {
      signal = init?.signal ?? undefined;
      return new Response("primary", { status: 200 });
    });
    const res = await createSegFetch(fetchFn)(PRIMARY);
    await vi.advanceTimersByTimeAsync(SEG_PRIMARY_TTFB_MS * 10);

    expect(await res.text()).toBe("primary");
    expect(signal?.aborted, "the first-byte timer must stop once headers arrive").toBe(false);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("still falls through to the mirror on a network error", async () => {
    const fetchFn = network(() => Promise.reject(new TypeError("Failed to fetch")));
    const res = await createSegFetch(fetchFn)(PRIMARY);
    expect(await res.text()).toBe("mirror");
  });

  it("returns a non-weight 404 from the primary without touching the mirror", async () => {
    const fetchFn = network(async () => new Response("", { status: 404 }));
    const res = await createSegFetch(fetchFn)("https://models.easyphoto.in/seg/config.json");
    expect(res.status).toBe(404);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("honours the caller's abort signal instead of retrying on the mirror", async () => {
    const fetchFn = network(stalls);
    const caller = new AbortController();
    const run = outcome(createSegFetch(fetchFn)(PRIMARY, { signal: caller.signal }));

    caller.abort(new DOMException("Cancelled", "AbortError"));
    await vi.advanceTimersByTimeAsync(0);
    expect((run.error as DOMException)?.name).toBe("AbortError");
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("serves the preprocessor config from code", async () => {
    const fetchFn = network(stalls);
    const res = await createSegFetch(fetchFn)(
      "https://models.easyphoto.in/seg/preprocessor_config.json"
    );
    expect(await res.json()).toMatchObject({ do_normalize: true });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe("WebGPU probe", () => {
  it("treats a requestAdapter() that never answers as no WebGPU", async () => {
    vi.stubGlobal("navigator", { gpu: { requestAdapter: () => new Promise(() => {}) } });
    const run = outcome(webgpuSupportsF16());

    await vi.advanceTimersByTimeAsync(WEBGPU_PROBE_TIMEOUT_MS);
    expect(run.value).toBe(false);
  });

  it("still reports an f16-capable adapter", async () => {
    vi.stubGlobal("navigator", {
      gpu: { requestAdapter: async () => ({ features: new Set(["shader-f16"]) }) },
    });
    await expect(webgpuSupportsF16()).resolves.toBe(true);
  });
});
