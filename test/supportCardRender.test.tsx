/**
 * SupportCard (components/site/SupportCard.tsx) in a DOM: invisible in the
 * static HTML and before a download; the approved pop-up copy after one; the
 * deep-link branch on Android, the QR branch elsewhere; every way to close it;
 * the open/close events other prompts rely on; analytics payloads.
 */
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DeviceClass } from "@/lib/analytics";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const analytics = vi.hoisted(() => ({
  track: vi.fn(),
  device: "android" as DeviceClass,
}));
vi.mock("@/lib/analytics", () => ({
  track: analytics.track,
  deviceClass: () => analytics.device,
}));

const VPA = "easyphoto641476.rzp@rxairtel";
/** The owner's Razorpay multiple-payment QR payload (decoded 7 Oct 2026). */
const QR_LINK = `upi://pay?cu=INR&mc=7338&mode=19&pa=${VPA}&tn=Payment%20To%20Easyphoto&tr=Tkx9z1TtIKezToqrv2`;
const HEADING = "Glad we could help!";
const BODY =
  "easyPhoto is free for everyone, and your photos never leave your device. If it saved you some time today, a small tip would mean a lot to us.";
const SAVED_LINE = "Saved on your device";
const FOOTNOTE = "No pressure. easyPhoto stays free either way.";
const SKIP = "Maybe later";
const DESKTOP_LINE = "On a computer? Scan the QR with any UPI app.";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

/** Fresh component + rules module: the once-per-page-load flag lives in module scope. */
async function mount(tool = "resize-kb") {
  vi.resetModules();
  const { SupportCard } = await import("@/components/site/SupportCard");
  await act(async () => {
    root.render(<SupportCard tool={tool} />);
  });
  return SupportCard;
}

/** Wait until the on-demand card module has loaded and its callback has run. */
async function settle() {
  await import("@/components/site/SupportCardPanel");
  await new Promise((r) => setTimeout(r, 0));
}

/** Fire a save and let the on-demand card chunk resolve. */
async function download(filename = "photo_20kb.jpg") {
  await act(async () => {
    window.dispatchEvent(new CustomEvent("ep:download", { detail: { filename, bytes: 20_000 } }));
    await settle();
  });
}

const region = () => container.querySelector("dialog");
/** The text-labelled skip control (the ✕ is the icon-only "Close" button). */
const skipButton = (card: Element) =>
  [...card.querySelectorAll("button")].find((b) => b.textContent === SKIP)!;

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  analytics.track.mockClear();
  analytics.device = "android";
  vi.stubEnv("NEXT_PUBLIC_UPI_LINK", QR_LINK);
  vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", "");
  vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_10", "");
  vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_20", "");
  vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_50", "");
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("SupportCard", () => {
  it("is absent from the server-rendered HTML even when configured", async () => {
    vi.resetModules();
    const { SupportCard } = await import("@/components/site/SupportCard");
    expect(renderToStaticMarkup(<SupportCard tool="resize-kb" />)).toBe("");
  });

  it("renders nothing before a download", async () => {
    await mount();
    expect(container.innerHTML).toBe("");
    expect(analytics.track).not.toHaveBeenCalled();
  });

  it("ignores an ep:download event without a filename", async () => {
    await mount();
    await act(async () => {
      window.dispatchEvent(new CustomEvent("ep:download", { detail: {} }));
      await settle();
    });
    expect(container.innerHTML).toBe("");
  });

  it("on Android shows the approved copy and three UPI deep links after a download", async () => {
    await mount();
    await download();

    const card = region()!;
    expect(card).not.toBeNull();
    expect(card.hasAttribute("open")).toBe(true);
    const heading = card.querySelector("h2")!;
    expect(heading.textContent).toBe(HEADING);
    expect(card.getAttribute("aria-labelledby")).toBe(heading.id);
    const texts = [...card.querySelectorAll("p")].map((p) => p.textContent);
    expect(texts).toEqual([SAVED_LINE, BODY, FOOTNOTE]);

    const links = [...card.querySelectorAll("a")];
    expect(links.map((a) => a.textContent)).toEqual(["₹10", "₹20", "₹50"]);
    expect(links.map((a) => a.getAttribute("aria-label"))).toEqual([
      "Support easyPhoto with ₹10 via UPI",
      "Support easyPhoto with ₹20 via UPI",
      "Support easyPhoto with ₹50 via UPI",
    ]);
    expect(links[1].getAttribute("href")).toBe(
      `${QR_LINK}&am=20.00`
    );
    const buttons = [...card.querySelectorAll("button")];
    expect(buttons.map((b) => b.textContent || b.getAttribute("aria-label"))).toEqual(["Close", SKIP]);
    for (const b of buttons) expect(b.getAttribute("type")).toBe("button");
    expect(card.querySelector("img")).toBeNull();
    expect(card.textContent).not.toContain(DESKTOP_LINE);

    expect(analytics.track).toHaveBeenCalledTimes(1);
    expect(analytics.track).toHaveBeenCalledWith({ name: "support_view", tool: "resize-kb", device: "android" });
  });

  it("records the tapped amount, with no VPA in the event, and snoozes the card", async () => {
    await mount("exam-ssc");
    await download();
    const link = [...region()!.querySelectorAll("a")][2];
    // jsdom cannot navigate to upi:// — stop the default action, keep React's handler.
    link.addEventListener("click", (e) => e.preventDefault());
    act(() => link.click());

    expect(analytics.track).toHaveBeenLastCalledWith({ name: "support_tap", tool: "exam-ssc", amount: "50" });
    expect(JSON.stringify(analytics.track.mock.calls)).not.toContain(VPA);
    expect(Number(localStorage.getItem("ep:support-tapped-at"))).toBeGreaterThan(0);

    // The pop-up closes once the click (and the link's own navigation) is done.
    expect(region()).not.toBeNull();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(region()).toBeNull();
  });

  it.each([
    ["the ✕ button", (card: Element) => (card.querySelector('button[aria-label="Close"]') as HTMLElement).click()],
    ["'Maybe later'", (card: Element) => skipButton(card).click()],
    ["Esc", (card: Element) => card.dispatchEvent(new Event("cancel", { cancelable: true }))],
    ["a click on the backdrop", (card: Element) => (card as HTMLElement).click()],
  ])("%s closes the pop-up", async (_label, close) => {
    await mount();
    await download();
    act(() => close(region()!));
    expect(region()).toBeNull();
  });

  it("a click inside the pop-up does not close it", async () => {
    await mount();
    await download();
    act(() => region()!.querySelector("h2")!.click());
    expect(region()).not.toBeNull();
  });

  it("announces opening and closing so other prompts can step aside", async () => {
    const events: string[] = [];
    const log = (e: Event) => events.push(e.type);
    window.addEventListener("ep:support-open", log);
    window.addEventListener("ep:support-close", log);
    try {
      await mount();
      await download();
      expect(events).toEqual(["ep:support-open"]);
      act(() => skipButton(region()!).click());
      expect(events).toEqual(["ep:support-open", "ep:support-close"]);
    } finally {
      window.removeEventListener("ep:support-open", log);
      window.removeEventListener("ep:support-close", log);
    }
  });

  it("'Maybe later' hides the pop-up and it does not return for the session", async () => {
    await mount();
    await download();
    act(() => skipButton(region()!).click());
    expect(container.innerHTML).toBe("");

    await download("second.jpg");
    expect(container.innerHTML).toBe("");

    // Another page in the same session (fresh module, same sessionStorage).
    act(() => root.unmount());
    root = createRoot(container);
    await mount("pdf-compress");
    await download();
    expect(container.innerHTML).toBe("");
    expect(analytics.track).toHaveBeenCalledTimes(1);
  });

  it("on desktop with a QR configured shows the QR and the desktop line, no amounts", async () => {
    analytics.device = "desktop";
    vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", "/upi-qr.png");
    await mount();
    await download();

    const card = region()!;
    expect(card.querySelector("h2")!.textContent).toBe(HEADING);
    expect(card.textContent).toContain(BODY);
    expect(card.textContent).toContain(DESKTOP_LINE);
    const img = card.querySelector("img")!;
    expect(img.getAttribute("src")).toBe("/upi-qr.png");
    expect(img.getAttribute("alt")).toBe("UPI QR code to support easyPhoto");
    expect(card.querySelectorAll("a")).toHaveLength(0);
    expect(skipButton(card)).toBeDefined();
    expect(analytics.track).toHaveBeenCalledWith({ name: "support_view", tool: "resize-kb", device: "desktop" });
  });

  it("shows no card on iPhone when only the UPI link and QR are configured", async () => {
    // upi:// links aren't reliable on iOS and a QR on the same phone can't be scanned.
    analytics.device = "ios";
    vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", "/upi-qr.png");
    await mount();
    await download();
    expect(container.innerHTML).toBe("");
    expect(analytics.track).not.toHaveBeenCalled();
  });

  it.each(["ios", "desktop", "android"] as const)(
    "with Razorpay payment pages, %s gets three amount links that open in a new tab",
    async (device) => {
      analytics.device = device;
      vi.stubEnv("NEXT_PUBLIC_UPI_LINK", "");
      vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_10", "https://rzp.io/rzp/support10");
      vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_20", "https://rzp.io/rzp/support20");
      vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_50", "https://rzp.io/rzp/support50");
      await mount();
      await download();
      const card = region()!;
      expect(card.textContent).toContain(HEADING);
      expect(card.textContent).toContain(BODY);
      expect(card.textContent).not.toContain(DESKTOP_LINE);
      const links = [...card.querySelectorAll("a")];
      expect(links.map((a) => a.getAttribute("href"))).toEqual([
        "https://rzp.io/rzp/support10",
        "https://rzp.io/rzp/support20",
        "https://rzp.io/rzp/support50",
      ]);
      expect(links.map((a) => a.textContent)).toEqual(["₹10", "₹20", "₹50"]);
      for (const a of links) {
        expect(a.getAttribute("target")).toBe("_blank");
        expect(a.getAttribute("rel")).toBe("noopener noreferrer");
      }
    }
  );

  it("shows no card on desktop when no QR is configured", async () => {
    analytics.device = "desktop";
    await mount();
    await download();
    expect(container.innerHTML).toBe("");
    expect(analytics.track).not.toHaveBeenCalled();
  });

  it("with every option configured, Android, iPhone and desktop each get theirs", async () => {
    vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", "/upi-qr.png");
    vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_10", "https://rzp.io/rzp/support10");
    vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_20", "https://rzp.io/rzp/support20");
    vi.stubEnv("NEXT_PUBLIC_SUPPORT_PAGE_50", "https://rzp.io/rzp/support50");
    const seen: Record<string, string> = {};
    for (const device of ["android", "ios", "desktop"] as const) {
      sessionStorage.clear();
      analytics.device = device;
      act(() => root.unmount());
      root = createRoot(container);
      await mount();
      await download();
      const card = region()!;
      seen[device] = card.querySelector("img")
        ? `qr:${card.querySelector("img")!.getAttribute("src")}`
        : (card.querySelector("a")!.getAttribute("href") ?? "");
    }
    expect(seen).toEqual({
      android: `${QR_LINK}&am=10.00`,
      ios: "https://rzp.io/rzp/support10",
      desktop: "qr:/upi-qr.png",
    });
  });

  it.each([
    ["unset", ""],
    ["invalid", "upi://pay?pa=not a vpa"],
  ])("never renders on Android when NEXT_PUBLIC_UPI_LINK is %s and nothing else is set", async (_label, value) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_UPI_LINK", value);
    vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", "/upi-qr.png");
    await mount();
    await download();
    expect(container.innerHTML).toBe("");
    expect(analytics.track).not.toHaveBeenCalled();
  });

  it("still shows once per page load when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const SupportCard = await mount();
    await download();
    expect(region()).not.toBeNull();

    // Dismiss, then a later download on the same page load stays quiet.
    act(() => skipButton(region()!).click());
    act(() => root.render(<SupportCard tool="resize-kb" key="remount" />));
    await download("again.jpg");
    expect(container.innerHTML).toBe("");
  });
});
