/**
 * "Support easyPhoto" UPI card — config, deep link and show/hide rules
 * (lib/supportCard.ts), plus the collector's validation of the two support
 * events (functions/api/event.ts).
 *
 * The show/hide state includes a once-per-page-load flag held in module scope,
 * so each rule test loads a fresh copy of the module.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SUPPORT_AMOUNTS,
  SUPPORT_SNOOZE_MS,
  SUPPORT_TAPPED_KEY,
  buildUpiLink,
  isValidVpa,
  parseSupportConfig,
  supportVariant,
} from "@/lib/supportCard";
import { onRequestPost } from "@/functions/api/event";

type SupportModule = typeof import("@/lib/supportCard");

async function freshModule(): Promise<SupportModule> {
  vi.resetModules();
  return import("@/lib/supportCard");
}

describe("VPA validation", () => {
  it.each(["easyphoto@ybl", "easy.photo-1_x@okicici", "merchant123@paytm", "shop@axl"])(
    "accepts %s",
    (vpa) => expect(isValidVpa(vpa)).toBe(true)
  );

  it.each([
    "",
    "easyphoto",
    "@ybl",
    "a@ybl", // name part too short
    "easyphoto@",
    "easyphoto@1bank", // handle must start with a letter
    "easy photo@ybl",
    "easyphoto@ybl@x",
    "easyphoto@ybl&am=5000",
    "easyphoto@ybl?x=1",
  ])("rejects %j", (vpa) => expect(isValidVpa(vpa)).toBe(false));
});

describe("parseSupportConfig", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns null when the VPA is unset or blank — the card never renders", () => {
    expect(parseSupportConfig({})).toBeNull();
    expect(parseSupportConfig({ vpa: "" })).toBeNull();
    expect(parseSupportConfig({ vpa: "   ", qrSrc: "/upi-qr.png" })).toBeNull();
  });

  it("ignores an invalid VPA and warns once", async () => {
    const { parseSupportConfig: parse } = await freshModule();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse({ vpa: "not-a-vpa" })).toBeNull();
    expect(parse({ vpa: "still bad" })).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("trims values and defaults the payee name to easyPhoto", () => {
    expect(parseSupportConfig({ vpa: " shop@ybl " })).toEqual({
      vpa: "shop@ybl",
      payee: "easyPhoto",
      qrSrc: null,
    });
    expect(parseSupportConfig({ vpa: "shop@ybl", payee: "  " })?.payee).toBe("easyPhoto");
    expect(parseSupportConfig({ vpa: "shop@ybl", payee: "Easy Photo Studio" })?.payee).toBe(
      "Easy Photo Studio"
    );
  });

  it("accepts only a same-origin QR path", async () => {
    const { parseSupportConfig: parse } = await freshModule();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse({ vpa: "shop@ybl", qrSrc: "/images/upi-qr.png" })?.qrSrc).toBe("/images/upi-qr.png");
    expect(parse({ vpa: "shop@ybl", qrSrc: "https://evil.example/qr.png" })?.qrSrc).toBeNull();
    expect(parse({ vpa: "shop@ybl", qrSrc: "//evil.example/qr.png" })?.qrSrc).toBeNull();
    expect(parse({ vpa: "shop@ybl", qrSrc: "javascript:alert(1)" })?.qrSrc).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe("buildUpiLink (NPCI upi://pay deep link)", () => {
  const config = { vpa: "easyphoto@ybl", payee: "easyPhoto" };

  it("builds the exact link for each approved amount", () => {
    expect(SUPPORT_AMOUNTS).toEqual(["10", "20", "50"]);
    for (const amount of SUPPORT_AMOUNTS) {
      expect(buildUpiLink(config, amount)).toBe(
        `upi://pay?pa=easyphoto%40ybl&pn=easyPhoto&am=${amount}&cu=INR&tn=Support%20easyPhoto`
      );
    }
  });

  it("percent-encodes every parameter so a value cannot add or change parameters", () => {
    const link = buildUpiLink({ vpa: "shop@ybl", payee: "Easy & Co=1 ₹" }, "20");
    expect(link).toBe(
      "upi://pay?pa=shop%40ybl&pn=Easy%20%26%20Co%3D1%20%E2%82%B9&am=20&cu=INR&tn=Support%20easyPhoto"
    );
    const params = new URLSearchParams(link.split("?")[1]);
    expect([...params.keys()]).toEqual(["pa", "pn", "am", "cu", "tn"]);
    expect(params.get("pn")).toBe("Easy & Co=1 ₹");
    expect(params.get("am")).toBe("20");
  });
});

describe("supportVariant", () => {
  const withQr = { vpa: "shop@ybl", payee: "easyPhoto", qrSrc: "/upi-qr.png" };
  const noQr = { ...withQr, qrSrc: null };

  it("uses the deep link on Android, with or without a QR", () => {
    expect(supportVariant("android", withQr)).toBe("deeplink");
    expect(supportVariant("android", noQr)).toBe("deeplink");
  });

  it("uses the QR on desktop and iPhone, and nothing when no QR is configured", () => {
    expect(supportVariant("desktop", withQr)).toBe("qr");
    expect(supportVariant("ios", withQr)).toBe("qr");
    expect(supportVariant("desktop", noQr)).toBeNull();
    expect(supportVariant("ios", noQr)).toBeNull();
  });
});

describe("show/hide rules", () => {
  const NOW = Date.UTC(2026, 9, 22, 6, 0, 0);

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
  afterEach(() => vi.restoreAllMocks());

  it("shows once, then not again in the same session (even after a page reload)", async () => {
    let m = await freshModule();
    expect(m.canShowSupport(NOW)).toBe(true);
    m.markSupportShown();
    expect(m.canShowSupport(NOW)).toBe(false);

    // A reload re-evaluates the module; the session flag still holds.
    m = await freshModule();
    expect(m.canShowSupport(NOW)).toBe(false);
  });

  it("shows again in a new session when nothing was tapped", async () => {
    const m = await freshModule();
    m.markSupportShown();
    sessionStorage.clear(); // new browser session
    const reloaded = await freshModule();
    expect(reloaded.canShowSupport(NOW)).toBe(true);
  });

  it("stays away for 30 days after an amount tap, then may show again", async () => {
    const m = await freshModule();
    m.markSupportTapped(NOW);
    expect(localStorage.getItem(SUPPORT_TAPPED_KEY)).toBe(String(NOW));
    expect(m.canShowSupport(NOW + 1)).toBe(false);
    expect(m.canShowSupport(NOW + SUPPORT_SNOOZE_MS - 1)).toBe(false);
    expect(m.canShowSupport(NOW + SUPPORT_SNOOZE_MS)).toBe(true);
  });

  it("ignores a corrupt or future tap timestamp instead of hiding forever", async () => {
    const m = await freshModule();
    localStorage.setItem(SUPPORT_TAPPED_KEY, "garbage");
    expect(m.canShowSupport(NOW)).toBe(true);
    localStorage.setItem(SUPPORT_TAPPED_KEY, String(NOW + 10 * SUPPORT_SNOOZE_MS));
    expect(m.canShowSupport(NOW)).toBe(true);
  });

  it("falls back to once per page load when storage throws (private mode)", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "QuotaExceededError");
    });
    const m = await freshModule();
    expect(m.canShowSupport(NOW)).toBe(true);
    expect(() => m.markSupportShown()).not.toThrow();
    expect(() => m.markSupportTapped(NOW)).not.toThrow();
    expect(m.canShowSupport(NOW)).toBe(false);
  });
});

describe("collector: support events", () => {
  function post(body: unknown) {
    const writeDataPoint = vi.fn();
    const request = new Request("https://easyphoto.in/api/event", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return onRequestPost({ request, env: { ANALYTICS: { writeDataPoint } } }).then((res) => ({
      res,
      writeDataPoint,
    }));
  }
  const blobs = (fn: ReturnType<typeof vi.fn>) =>
    (fn.mock.calls[0][0] as { blobs: string[] }).blobs;

  it("records support_view with its tool and device", async () => {
    const { res, writeDataPoint } = await post({ name: "support_view", tool: "resize-kb", device: "android" });
    expect(res.status).toBe(204);
    expect(blobs(writeDataPoint).slice(0, 3)).toEqual(["support_view", "resize-kb", "android"]);
  });

  it.each(["10", "20", "50"])("records support_tap amount %s in the variant column", async (amount) => {
    const { writeDataPoint } = await post({ name: "support_tap", tool: "exam-ssc", amount });
    expect(blobs(writeDataPoint)[0]).toBe("support_tap");
    expect(blobs(writeDataPoint)[5]).toBe(amount);
  });

  it("drops a support_tap whose amount is not one of the fixed values", async () => {
    for (const amount of ["5000", "", "25", "20; drop", null, undefined]) {
      const { res, writeDataPoint } = await post({ name: "support_tap", amount });
      expect(res.status).toBe(204);
      expect(writeDataPoint).not.toHaveBeenCalled();
    }
  });

  it("never lets a support_tap smuggle another value into the variant column", async () => {
    const { writeDataPoint } = await post({ name: "support_tap", amount: "10", format: "shop@ybl" });
    expect(blobs(writeDataPoint)[5]).toBe("10");
  });
});
