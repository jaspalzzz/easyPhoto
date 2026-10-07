/**
 * SupportInline (components/site/SupportInline.tsx): the tip offer that stays
 * under the Download button after a save, for anyone who closed or missed the
 * pop-up. Same ask as the pop-up; hidden while a tap snoozes the offer.
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

const QR_LINK =
  "upi://pay?cu=INR&mc=7338&mode=19&pa=easyphoto641476.rzp@rxairtel&tn=Payment%20To%20Easyphoto&tr=Tkx9z1TtIKezToqrv2";
const PAY_LINK = "https://razorpay.me/@easyphoto2806";
const BODY =
  "easyPhoto is free for everyone, and your photos never leave your device. If it saved you a trip to the cyber café, a small tip helps keep it free for the next person filling a form.";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

async function mount() {
  vi.resetModules();
  const { SupportInline } = await import("@/components/site/SupportInline");
  await act(async () => {
    root.render(<SupportInline className="mt-5" />);
  });
}

async function download(filename = "photo.jpg") {
  await act(async () => {
    window.dispatchEvent(new CustomEvent("ep:download", { detail: { filename, bytes: 20_000 } }));
    await import("@/components/site/SupportOffer");
    await new Promise((r) => setTimeout(r, 0));
  });
}

const offer = () => container.querySelector("section");

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  analytics.track.mockClear();
  analytics.device = "android";
  vi.stubEnv("NEXT_PUBLIC_UPI_LINK", QR_LINK);
  vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", "/upi-qr.png");
  vi.stubEnv("NEXT_PUBLIC_SUPPORT_LINK", PAY_LINK);
  window.history.replaceState(null, "", "/tools/resize-kb/");
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

describe("SupportInline", () => {
  it("is absent from the server-rendered HTML", async () => {
    vi.resetModules();
    const { SupportInline } = await import("@/components/site/SupportInline");
    expect(renderToStaticMarkup(<SupportInline />)).toBe("");
  });

  it("appears after a download with the pop-up's ask, as a quiet card that takes no focus", async () => {
    await mount();
    expect(container.innerHTML).toBe("");
    await download();

    const card = offer()!;
    expect(card).not.toBeNull();
    expect(card.className).toContain("mt-5");
    const heading = card.querySelector("p")!;
    expect(heading.textContent).toBe("Glad we could help!");
    expect(card.getAttribute("aria-labelledby")).toBe(heading.id);
    expect(card.textContent).toContain(BODY);
    const link = card.querySelector("a")!;
    expect(link.textContent).toBe("Help keep it free");
    expect(link.getAttribute("href")).toBe(QR_LINK);
    expect(card.querySelector("button")).toBeNull(); // nothing to dismiss: it covers nothing
    expect(card.contains(document.activeElement)).toBe(false);
  });

  it("also appears after a completed Share (how most iPhone users keep a photo)", async () => {
    analytics.device = "ios";
    await mount();
    await act(async () => {
      window.dispatchEvent(new CustomEvent("ep:share", { detail: { filename: "photo.jpg", bytes: 20_000 } }));
      await import("@/components/site/SupportOffer");
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(offer()!.querySelector("a")!.getAttribute("href")).toBe(PAY_LINK);
  });

  it("keeps showing on later downloads — it is not limited to once per session", async () => {
    sessionStorage.setItem("ep:support-seen", "1"); // the pop-up already showed this session
    await mount();
    await download();
    expect(offer()).not.toBeNull();
  });

  it("a tap records the route and page, hides the card and snoozes it for 7 days", async () => {
    await mount();
    await download();
    const link = offer()!.querySelector("a")!;
    link.addEventListener("click", (e) => e.preventDefault()); // jsdom can't open upi://
    act(() => link.click());
    expect(analytics.track).toHaveBeenLastCalledWith({ name: "support_tap", tool: "resize-kb", method: "upi" });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(offer()).toBeNull();

    await download("again.jpg");
    expect(offer()).toBeNull();
  });

  it("hides when the pop-up closes after a tap there", async () => {
    await mount();
    await download();
    expect(offer()).not.toBeNull();
    // The pop-up's tap stores the snooze, then the pop-up closes.
    localStorage.setItem("ep:support-tapped-at", String(Date.now()));
    act(() => window.dispatchEvent(new Event("ep:support-close")));
    expect(offer()).toBeNull();
  });

  it("stays when the pop-up is closed without a tap", async () => {
    await mount();
    await download();
    act(() => window.dispatchEvent(new Event("ep:support-close")));
    expect(offer()).not.toBeNull();
  });

  it("does not appear while snoozed, and appears again after 7 days", async () => {
    localStorage.setItem("ep:support-tapped-at", String(Date.now() - 6 * 24 * 60 * 60 * 1000));
    await mount();
    await download();
    expect(offer()).toBeNull();

    localStorage.setItem("ep:support-tapped-at", String(Date.now() - 8 * 24 * 60 * 60 * 1000));
    await download("later.jpg");
    expect(offer()).not.toBeNull();
  });

  it("shows the QR beside the text on a computer, and the payment link on iPhone", async () => {
    analytics.device = "desktop";
    await mount();
    await download();
    expect(offer()!.querySelector("img")!.getAttribute("src")).toBe("/upi-qr.png");

    act(() => root.unmount());
    root = createRoot(container);
    analytics.device = "ios";
    await mount();
    await download();
    expect(offer()!.querySelector("a")!.getAttribute("href")).toBe(PAY_LINK);
  });

  it("never renders when nothing is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_UPI_LINK", "");
    vi.stubEnv("NEXT_PUBLIC_UPI_QR_SRC", "");
    vi.stubEnv("NEXT_PUBLIC_SUPPORT_LINK", "");
    await mount();
    await download();
    expect(container.innerHTML).toBe("");
  });
});
