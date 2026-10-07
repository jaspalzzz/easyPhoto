/**
 * SupportCard (components/site/SupportCard.tsx) in a DOM: invisible in the
 * static HTML and before a download; the approved pop-up copy after one; one
 * "Help keep it free" button per device — the UPI app on Android, the payment link
 * on iPhone, the QR on a computer; every way to close it; the open/close events
 * other prompts rely on; analytics payloads.
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
const PAY_LINK = "https://razorpay.me/@easyphoto2806";
const QR_SRC = "/upi-qr.png";

const HEADING = "Support easyPhoto with a small tip";
const BODY =
  "easyPhoto is free for everyone, and your photos never leave your device. If it saved you a trip to the cyber café, a small tip helps keep it free for the next person filling a form.";
const SAVED_LINE = "Saved on your device";
const FOOTNOTE = "No pressure. Every little bit helps.";
const SKIP = "Maybe later";
const TIP = "Help keep it free";
const ANDROID_HINT = "Opens your UPI app. You choose the amount.";
const LINK_HINT = "You choose the amount on the next screen.";
const QR_HINT = "Scan with any UPI app on your phone. You choose the amount.";

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
  vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", QR_SRC);
  vi.stubEnv("NEXT_PUBLIC_SUPPORT_LINK", PAY_LINK);
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

  it("on Android shows the approved copy and one button into the UPI app, with no amount set", async () => {
    await mount();
    await download();

    const card = region()!;
    expect(card).not.toBeNull();
    expect(card.hasAttribute("open")).toBe(true);
    const heading = card.querySelector("h2")!;
    expect(heading.textContent).toBe(HEADING);
    expect(card.getAttribute("aria-labelledby")).toBe(heading.id);
    const texts = [...card.querySelectorAll("p")].map((p) => p.textContent);
    expect(texts).toEqual([SAVED_LINE, BODY, ANDROID_HINT, FOOTNOTE]);

    const links = [...card.querySelectorAll("a")];
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toBe(TIP);
    expect(links[0].getAttribute("href")).toBe(QR_LINK);
    expect(links[0].getAttribute("href")).not.toContain("am=");
    expect(links[0].getAttribute("target")).toBeNull();
    expect(links[0].getAttribute("aria-label")).toBe(
      "Help keep it free: opens your UPI app, where you choose the amount"
    );
    const buttons = [...card.querySelectorAll("button")];
    expect(buttons.map((b) => b.textContent || b.getAttribute("aria-label"))).toEqual(["Close", SKIP]);
    for (const b of buttons) expect(b.getAttribute("type")).toBe("button");
    expect(card.querySelector("img")).toBeNull();

    expect(analytics.track).toHaveBeenCalledTimes(1);
    expect(analytics.track).toHaveBeenCalledWith({ name: "support_view", tool: "resize-kb", device: "android" });
  });

  it("opens with focus on the dialog itself, not on the ✕ (no focus ring on phones)", async () => {
    await mount();
    await download();
    expect(document.activeElement).toBe(region());
  });

  it("also opens after a completed Share, without claiming the file was saved", async () => {
    analytics.device = "ios";
    await mount();
    await act(async () => {
      window.dispatchEvent(new CustomEvent("ep:share", { detail: { filename: "photo.jpg", bytes: 20_000 } }));
      await settle();
    });
    const card = region()!;
    expect(card.querySelector("h2")!.textContent).toBe(HEADING);
    expect(card.textContent).not.toContain(SAVED_LINE);
    expect(card.querySelector("a")!.getAttribute("href")).toBe(PAY_LINK);
  });

  it("on iPhone opens the payment link in a new tab", async () => {
    analytics.device = "ios";
    await mount();
    await download();
    const card = region()!;
    expect(card.textContent).toContain(BODY);
    expect(card.textContent).toContain(LINK_HINT);
    const links = [...card.querySelectorAll("a")];
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toBe(TIP);
    expect(links[0].getAttribute("href")).toBe(PAY_LINK);
    expect(links[0].getAttribute("target")).toBe("_blank");
    expect(links[0].getAttribute("rel")).toBe("noopener noreferrer");
    expect(card.querySelector("img")).toBeNull();
  });

  it("on a computer shows the QR to scan, and no button", async () => {
    analytics.device = "desktop";
    await mount();
    await download();
    const card = region()!;
    expect(card.querySelector("h2")!.textContent).toBe(HEADING);
    expect(card.textContent).toContain(BODY);
    expect(card.textContent).toContain(QR_HINT);
    const img = card.querySelector("img")!;
    expect(img.getAttribute("src")).toBe(QR_SRC);
    expect(img.getAttribute("alt")).toBe("UPI QR code to support easyPhoto");
    expect(card.querySelectorAll("a")).toHaveLength(0);
    expect(skipButton(card)).toBeDefined();
    expect(analytics.track).toHaveBeenCalledWith({ name: "support_view", tool: "resize-kb", device: "desktop" });
  });

  it.each([
    ["android", "NEXT_PUBLIC_UPI_LINK"],
    ["desktop", "NEXT_PUBLIC_UPI_QR_SRC"],
  ] as const)("%s falls back to the payment link when %s is unset", async (device, unset) => {
    analytics.device = device;
    vi.stubEnv(unset, "");
    await mount();
    await download();
    const links = [...region()!.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual([PAY_LINK]);
  });

  it("records a tap with its route only, and snoozes the card", async () => {
    await mount("exam-ssc");
    await download();
    const link = region()!.querySelector("a")!;
    // jsdom cannot navigate to upi:// — stop the default action, keep React's handler.
    link.addEventListener("click", (e) => e.preventDefault());
    act(() => link.click());

    expect(analytics.track).toHaveBeenLastCalledWith({ name: "support_tap", tool: "exam-ssc", method: "upi" });
    expect(JSON.stringify(analytics.track.mock.calls)).not.toContain(VPA);
    expect(Number(localStorage.getItem("ep:support-tapped-at"))).toBeGreaterThan(0);

    // The pop-up closes once the click (and the link's own navigation) is done.
    expect(region()).not.toBeNull();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(region()).toBeNull();
  });

  it("records an iPhone tap as the payment-link route", async () => {
    analytics.device = "ios";
    await mount();
    await download();
    const link = region()!.querySelector("a")!;
    link.addEventListener("click", (e) => e.preventDefault());
    act(() => link.click());
    expect(analytics.track).toHaveBeenLastCalledWith({ name: "support_tap", tool: "resize-kb", method: "link" });
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

  it("shows nothing on iPhone when only the UPI link and QR are configured", async () => {
    // upi:// links aren't reliable on iOS and a QR on the same phone can't be scanned.
    analytics.device = "ios";
    vi.stubEnv("NEXT_PUBLIC_SUPPORT_LINK", "");
    await mount();
    await download();
    expect(container.innerHTML).toBe("");
    expect(analytics.track).not.toHaveBeenCalled();
  });

  it.each([
    ["unset", ""],
    ["invalid", "upi://pay?pa=not a vpa"],
  ])("never renders on Android when NEXT_PUBLIC_UPI_LINK is %s and there is no payment link", async (_label, value) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_UPI_LINK", value);
    vi.stubEnv("NEXT_PUBLIC_SUPPORT_LINK", "");
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
