/**
 * shareFile (lib/download.ts) announces a completed share with "ep:share", so
 * the support pop-up and card also follow Share → "Save Image" — how most
 * iPhone users keep a photo. A cancelled or unsupported share announces
 * nothing.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { shareFile } from "@/lib/download";

function listen() {
  const seen: unknown[] = [];
  const on = (e: Event) => seen.push((e as CustomEvent).detail);
  window.addEventListener("ep:share", on);
  return { seen, stop: () => window.removeEventListener("ep:share", on) };
}

afterEach(() => vi.unstubAllGlobals());

describe("shareFile", () => {
  it("dispatches ep:share with the filename and size after a completed share", async () => {
    vi.stubGlobal("navigator", { ...navigator, share: vi.fn().mockResolvedValue(undefined) });
    const { seen, stop } = listen();
    const ok = await shareFile(new Blob(["abc"], { type: "image/jpeg" }), "photo.jpg", "Photo");
    stop();
    expect(ok).toBe(true);
    expect(seen).toEqual([{ filename: "photo.jpg", bytes: 3 }]);
  });

  it("dispatches nothing when the user cancels the share sheet", async () => {
    const abort = Object.assign(new Error("cancelled"), { name: "AbortError" });
    vi.stubGlobal("navigator", { ...navigator, share: vi.fn().mockRejectedValue(abort) });
    const { seen, stop } = listen();
    expect(await shareFile(new Blob(["abc"]), "photo.jpg")).toBe(false);
    stop();
    expect(seen).toEqual([]);
  });

  it("dispatches nothing when the browser cannot share", async () => {
    const { seen, stop } = listen();
    expect(await shareFile(new Blob(["abc"]), "photo.jpg")).toBe(false); // jsdom has no navigator.share
    stop();
    expect(seen).toEqual([]);
  });
});
