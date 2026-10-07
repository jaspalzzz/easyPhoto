/**
 * SupportCard (components/site/SupportCard.tsx) in a DOM: invisible in the
 * static HTML and before a download; the approved copy after one; the deep-link
 * branch on Android, the QR branch elsewhere; "Not now"; analytics payloads.
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

const VPA = "easyphoto@ybl";
const HEADING = "Saved you a cyber-café trip?";
const BODY = "easyPhoto is free, private and runs on your device. A small UPI tip keeps it that way.";
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

const region = () => container.querySelector('[role="region"]');

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  analytics.track.mockClear();
  analytics.device = "android";
  vi.stubEnv("NEXT_PUBLIC_UPI_VPA", VPA);
  vi.stubEnv("NEXT_PUBLIC_UPI_PAYEE_NAME", "");
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
    const heading = card.querySelector("h2")!;
    expect(heading.textContent).toBe(HEADING);
    expect(card.getAttribute("aria-labelledby")).toBe(heading.id);
    expect(card.querySelector("p")!.textContent).toBe(BODY);

    const links = [...card.querySelectorAll("a")];
    expect(links.map((a) => a.textContent)).toEqual(["₹10", "₹20", "₹50"]);
    expect(links.map((a) => a.getAttribute("aria-label"))).toEqual([
      "Support easyPhoto with ₹10 via UPI",
      "Support easyPhoto with ₹20 via UPI",
      "Support easyPhoto with ₹50 via UPI",
    ]);
    expect(links[1].getAttribute("href")).toBe(
      "upi://pay?pa=easyphoto@ybl&pn=easyPhoto&am=20&cu=INR&tn=Support%20easyPhoto"
    );
    const notNow = card.querySelector("button")!;
    expect(notNow.textContent).toBe("Not now");
    expect(notNow.getAttribute("type")).toBe("button");
    expect(card.querySelector("img")).toBeNull();
    expect(card.textContent).not.toContain(DESKTOP_LINE);
    // The card is an offer, not an alert: it must not grab focus.
    expect(card.contains(document.activeElement)).toBe(false);

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
  });

  it("'Not now' hides the card and it does not return for the session", async () => {
    await mount();
    await download();
    act(() => region()!.querySelector("button")!.click());
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
    expect(card.querySelector("button")!.textContent).toBe("Not now");
    expect(analytics.track).toHaveBeenCalledWith({ name: "support_view", tool: "resize-kb", device: "desktop" });
  });

  it("shows no card on iPhone, even with a QR configured", async () => {
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
      vi.stubEnv("NEXT_PUBLIC_UPI_VPA", "");
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

  it.each([
    ["unset", ""],
    ["invalid", "not a vpa"],
  ])("never renders when NEXT_PUBLIC_UPI_VPA is %s", async (_label, value) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_UPI_VPA", value);
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
    act(() => region()!.querySelector("button")!.click());
    act(() => root.render(<SupportCard tool="resize-kb" key="remount" />));
    await download("again.jpg");
    expect(container.innerHTML).toBe("");
  });
});
