/**
 * One prompt at a time after a download. When the support pop-up opens
 * (lib/supportEvents.ts SUPPORT_OPEN_EVENT), the "Saved …" toast steps aside
 * (the pop-up carries its own "Saved on your device" line) and the
 * "Keep easyPhoto one tap away" install hint waits for the next download.
 * Without the support pop-up both behave exactly as before.
 */
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DownloadToast } from "@/components/site/DownloadToast";
import { PwaInstallHint } from "@/components/site/PwaInstallHint";
import { SUPPORT_CLOSE_EVENT, SUPPORT_OPEN_EVENT } from "@/lib/supportEvents";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const HINT_DELAY_MS = 5000;

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

const fire = (type: string) => act(() => window.dispatchEvent(new Event(type)));
const download = () =>
  act(() => {
    window.dispatchEvent(
      new CustomEvent("ep:download", { detail: { filename: "photo.jpg", bytes: 20_000 } })
    );
  });
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  // jsdom has no matchMedia; report a normal browser tab (not installed).
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("DownloadToast", () => {
  it("confirms a save, then steps aside when the support pop-up opens", () => {
    act(() => root.render(<DownloadToast />));
    download();
    expect(container.querySelector('[role="status"]')?.textContent).toContain("photo.jpg");

    fire(SUPPORT_OPEN_EVENT);
    expect(container.querySelector('[role="status"]')).toBeNull();

    // The next save is confirmed as usual.
    download();
    expect(container.querySelector('[role="status"]')).not.toBeNull();
  });
});

describe("PwaInstallHint", () => {
  /** Chrome's install event, which the hint keeps for its "Add" button. */
  const offerInstall = () =>
    act(() => {
      const e = new Event("beforeinstallprompt");
      Object.assign(e, { prompt: () => Promise.resolve() });
      window.dispatchEvent(e);
    });
  const hint = () => container.querySelector('[role="dialog"]');

  beforeEach(() => {
    act(() => root.render(<PwaInstallHint />));
    offerInstall();
  });

  it("still appears after a download when there is no support pop-up", () => {
    download();
    advance(HINT_DELAY_MS);
    expect(hint()?.textContent).toContain("Keep easyPhoto one tap away");
  });

  it("does not appear on the download that opened the support pop-up", () => {
    download();
    fire(SUPPORT_OPEN_EVENT);
    advance(HINT_DELAY_MS);
    expect(hint()).toBeNull();

    // Closing the pop-up does not bring it back for that same download.
    fire(SUPPORT_CLOSE_EVENT);
    advance(HINT_DELAY_MS);
    expect(hint()).toBeNull();
    expect(localStorage.getItem("ep:pwa-hint-dismissed")).toBeNull();
  });

  it("appears on the next download after the support pop-up closes", () => {
    download();
    fire(SUPPORT_OPEN_EVENT);
    fire(SUPPORT_CLOSE_EVENT);

    download();
    advance(HINT_DELAY_MS);
    expect(hint()).not.toBeNull();
  });

  it("waits while the support pop-up is still open", () => {
    download();
    fire(SUPPORT_OPEN_EVENT);
    download(); // a second save with the pop-up still on screen
    advance(HINT_DELAY_MS);
    expect(hint()).toBeNull();
  });
});
