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
  SUPPORT_SNOOZE_MS,
  SUPPORT_TAPPED_KEY,
  buildUpiLink,
  isValidVpa,
  isValidPaymentLink,
  parseSupportConfig,
  parseUpiLink,
  supportVariant,
  type SupportConfig,
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

/** The payload of the owner's Razorpay multiple-payment QR (decoded 7 Oct 2026). */
const QR_LINK =
  "upi://pay?cu=INR&mc=7338&mode=19&pa=easyphoto641476.rzp@rxairtel&tn=Payment%20To%20Easyphoto&tr=Tkx9z1TtIKezToqrv2";

const PAY_LINK = "https://razorpay.me/@easyphoto2806";

describe("parseUpiLink (merchant QR payload)", () => {
  it("keeps the QR's parameters in order", () => {
    expect(parseUpiLink(QR_LINK)).toEqual([
      ["cu", "INR"],
      ["mc", "7338"],
      ["mode", "19"],
      ["pa", "easyphoto641476.rzp@rxairtel"],
      ["tn", "Payment To Easyphoto"],
      ["tr", "Tkx9z1TtIKezToqrv2"],
    ]);
  });

  it("drops an amount and unknown parameters, and adds INR when absent", () => {
    expect(parseUpiLink("upi://pay?pa=shop@ybl&am=5000&url=https://evil.example&pn=Shop")).toEqual([
      ["pa", "shop@ybl"],
      ["pn", "Shop"],
      ["cu", "INR"],
    ]);
  });

  it.each([
    ["not a upi link", "https://rzp.io/rzp/x?pa=shop@ybl"],
    ["upi but not pay", "upi://mandate?pa=shop@ybl"],
    ["no payee", "upi://pay?tn=hi&cu=INR"],
    ["invalid payee", "upi://pay?pa=not%20a%20vpa"],
    ["foreign currency", "upi://pay?pa=shop@ybl&cu=USD"],
    ["duplicate payee", "upi://pay?pa=shop@ybl&pa=evil@ybl"],
    ["empty", ""],
  ])("rejects %s", (_label, value) => expect(parseUpiLink(value)).toBeNull());
});

describe("parseSupportConfig", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns null when nothing is set — the card never renders", () => {
    expect(parseSupportConfig({})).toBeNull();
    expect(parseSupportConfig({ upiLink: "", qrSrc: "  ", link: "" })).toBeNull();
  });

  it("configures each option independently, trimmed", () => {
    expect(parseSupportConfig({ upiLink: ` ${QR_LINK} ` })).toEqual({
      upi: parseUpiLink(QR_LINK),
      qrSrc: null,
      link: null,
    });
    expect(parseSupportConfig({ qrSrc: "/upi-qr.png" })).toEqual({ upi: null, qrSrc: "/upi-qr.png", link: null });
    expect(parseSupportConfig({ link: ` ${PAY_LINK} ` })).toEqual({ upi: null, qrSrc: null, link: PAY_LINK });
  });

  it("ignores each invalid value and warns once per variable", async () => {
    const { parseSupportConfig: parse } = await freshModule();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse({ upiLink: "upi://pay?pa=bad" })).toBeNull();
    expect(parse({ upiLink: "still bad" })).toBeNull();
    expect(parse({ link: "https://evil.example/pay" })).toBeNull();
    expect(parse({ qrSrc: "https://evil.example/qr.png" })).toBeNull();
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it("accepts only a same-origin QR path", async () => {
    const { parseSupportConfig: parse } = await freshModule();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse({ link: PAY_LINK, qrSrc: "/images/upi-qr.png" })?.qrSrc).toBe("/images/upi-qr.png");
    expect(parse({ link: PAY_LINK, qrSrc: "https://evil.example/qr.png" })?.qrSrc).toBeNull();
    expect(parse({ link: PAY_LINK, qrSrc: "//evil.example/qr.png" })?.qrSrc).toBeNull();
    expect(parse({ link: PAY_LINK, qrSrc: "javascript:alert(1)" })?.qrSrc).toBeNull();
  });
});

describe("buildUpiLink (NPCI upi://pay deep link)", () => {
  it("is the merchant QR's payload with no amount, so the payer chooses it", () => {
    expect(buildUpiLink(parseUpiLink(QR_LINK)!)).toBe(QR_LINK);
  });

  it("percent-encodes every value so it cannot add or change parameters", () => {
    const link = buildUpiLink(parseUpiLink("upi://pay?pa=shop@ybl&pn=Easy%20%26%20Co%3D1%20%E2%82%B9")!);
    expect(link).toBe("upi://pay?pa=shop@ybl&pn=Easy%20%26%20Co%3D1%20%E2%82%B9&cu=INR");
    const params = new URLSearchParams(link.split("?")[1]);
    expect([...params.keys()]).toEqual(["pa", "pn", "cu"]);
    expect(params.get("pn")).toBe("Easy & Co=1 ₹");
  });
});

describe("supportVariant — the fewest steps that work on the device", () => {
  const all: SupportConfig = { upi: parseUpiLink(QR_LINK), qrSrc: "/upi-qr.png", link: PAY_LINK };

  it("Android opens the UPI app; a computer shows the QR; iPhone gets the payment link", () => {
    expect(supportVariant("android", all)).toBe("deeplink");
    expect(supportVariant("desktop", all)).toBe("qr");
    expect(supportVariant("ios", all)).toBe("link");
  });

  it("falls back to the payment link when the UPI option for the device is missing", () => {
    const linkOnly: SupportConfig = { upi: null, qrSrc: null, link: PAY_LINK };
    for (const device of ["android", "ios", "desktop"] as const) {
      expect(supportVariant(device, linkOnly)).toBe("link");
    }
  });

  it("shows nothing where no option fits the device", () => {
    const upiOnly: SupportConfig = { upi: parseUpiLink(QR_LINK), qrSrc: null, link: null };
    expect(supportVariant("desktop", upiOnly)).toBeNull();
    expect(supportVariant("ios", upiOnly)).toBeNull();
    const qrOnly: SupportConfig = { upi: null, qrSrc: "/upi-qr.png", link: null };
    expect(supportVariant("android", qrOnly)).toBeNull(); // a QR on the same phone can't be scanned
    expect(supportVariant("ios", qrOnly)).toBeNull();
  });
});

describe("payment link (Razorpay)", () => {
  it("accepts only https links on Razorpay's own hosts", () => {
    expect(isValidPaymentLink(PAY_LINK)).toBe(true);
    expect(isValidPaymentLink("https://rzp.io/rzp/abc")).toBe(true);
    expect(isValidPaymentLink("https://pages.razorpay.com/support")).toBe(true);
    expect(isValidPaymentLink("http://razorpay.me/@easyphoto")).toBe(false);
    expect(isValidPaymentLink("https://razorpay.me/")).toBe(false);
    expect(isValidPaymentLink("https://razorpay.me.evil.example/@x")).toBe(false);
    expect(isValidPaymentLink("https://evil.example/razorpay.me/@x")).toBe(false);
    expect(isValidPaymentLink("not a url")).toBe(false);
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

  it("stays away for 30 days after a tap, then may show again", async () => {
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

  it.each(["upi", "link"])("records support_tap route %s in the variant column", async (method) => {
    const { writeDataPoint } = await post({ name: "support_tap", tool: "exam-ssc", method });
    expect(blobs(writeDataPoint)[0]).toBe("support_tap");
    expect(blobs(writeDataPoint)[5]).toBe(method);
  });

  it("drops a support_tap without a known route", async () => {
    for (const method of ["qr", "", "native", "upi; drop", null, undefined]) {
      const { res, writeDataPoint } = await post({ name: "support_tap", method });
      expect(res.status).toBe(204);
      expect(writeDataPoint).not.toHaveBeenCalled();
    }
    // The old fixed-amount shape is no longer a valid tap.
    const { writeDataPoint } = await post({ name: "support_tap", amount: "10" });
    expect(writeDataPoint).not.toHaveBeenCalled();
  });

  it("never lets a support_tap smuggle another value into the variant column", async () => {
    const { writeDataPoint } = await post({ name: "support_tap", method: "upi", format: "shop@ybl" });
    expect(blobs(writeDataPoint)[5]).toBe("upi");
  });
});
