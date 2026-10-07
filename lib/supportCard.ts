/**
 * "Support easyPhoto" tip pop-up — configuration, UPI deep-link builder and the
 * show/hide rules. The React surface lives in components/site/SupportCard.tsx;
 * everything testable without a DOM lives here.
 *
 * Config is build-time (NEXT_PUBLIC_* is inlined by Next.js, like
 * NEXT_PUBLIC_ADSENSE_ENABLED): with nothing valid set the pop-up never
 * renders, so unsetting the variables and rebuilding is the rollback.
 *
 * Three ways to pay, each optional, picked per device (supportVariant):
 *  - UPI deep link (NEXT_PUBLIC_UPI_LINK): the upi://pay payload of the
 *    merchant's Razorpay multiple-payment QR. On Android each amount button
 *    opens the UPI app with that exact payload plus `am` — no form to fill.
 *  - QR image (NEXT_PUBLIC_UPI_QR_SRC): the same QR, shown on computers to
 *    scan with a phone.
 *  - Hosted payment pages (NEXT_PUBLIC_SUPPORT_PAGE_10/_20/_50): one Razorpay
 *    Payment Page per amount. Works on every device (UPI and cards) but asks
 *    for email and phone, so it is the fallback: iPhone always, and Android or
 *    computers when the UPI options above aren't set.
 */

import type { DeviceClass } from "@/lib/analytics";

/** The three approved tip amounts, in rupees. */
export const SUPPORT_AMOUNTS = ["10", "20", "50"] as const;
export type SupportAmount = (typeof SUPPORT_AMOUNTS)[number];

/** Session flag: the card has been shown in this browser session. */
export const SUPPORT_SEEN_KEY = "ep:support-seen";
/** Local timestamp (epoch ms) of the last amount tap. */
export const SUPPORT_TAPPED_KEY = "ep:support-tapped-at";
/** After an amount tap the card stays away this long. */
export const SUPPORT_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * VPA shape `name@handle`: the NPCI handle is letters (optionally with digits,
 * dots or hyphens after the first letter); the name part allows letters,
 * digits, dot, hyphen and underscore.
 */
const VPA_RE = /^[a-z0-9._-]{2,256}@[a-z][a-z0-9.-]{1,63}$/i;

/**
 * Parameters carried over from the merchant QR's upi://pay payload (NPCI UPI
 * Linking Specification): payee address and name, merchant category code,
 * initiation mode, Razorpay's transaction reference for that QR (how the
 * payment is matched to it), note and currency. Anything else — including
 * an `am` — is dropped; the amount comes only from the tapped button.
 */
const UPI_LINK_KEYS = new Set(["pa", "pn", "mc", "mode", "tr", "tn", "cu"]);

/** A validated upi://pay payload, in its original order, without an amount. */
export type UpiParams = ReadonlyArray<readonly [string, string]>;

export interface SupportConfig {
  /** The merchant QR's UPI payload, or null when not set or invalid. */
  upi: UpiParams | null;
  /** Same-origin path to the merchant QR in public/, or null when not set. */
  qrSrc: string | null;
  /** One hosted payment page per amount, or null unless all three are valid. */
  pages: Record<SupportAmount, string> | null;
}

export interface SupportEnv {
  upiLink?: string;
  qrSrc?: string;
  page10?: string;
  page20?: string;
  page50?: string;
}

/**
 * Payment-page links must be https on Razorpay's own hosts, so a typo in the
 * Cloudflare variable can never send a visitor to someone else's page.
 */
const PAGE_HOSTS = ["rzp.io", "pages.razorpay.com", "razorpay.me"];

export function isValidPaymentPage(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && PAGE_HOSTS.includes(url.hostname) && url.pathname.length > 1;
  } catch {
    return false;
  }
}

export function isValidVpa(value: string): boolean {
  return VPA_RE.test(value);
}

/**
 * Validate a merchant QR payload such as
 * `upi://pay?pa=shop.rzp@bank&mc=7338&tr=…&tn=…&cu=INR`. Returns the kept
 * parameters, or null unless it is a upi://pay link with a valid payee
 * address, at most one of each parameter, and INR (added when absent).
 */
export function parseUpiLink(value: string): UpiParams | null {
  const match = /^upi:\/\/pay\?(.+)$/i.exec(value);
  if (!match) return null;
  const all = [...new URLSearchParams(match[1])];
  const keys = all.map(([k]) => k.toLowerCase());
  if (new Set(keys).size !== keys.length) return null; // no duplicate (smuggled) parameters
  const kept: [string, string][] = all
    .map(([k, v]): [string, string] => [k.toLowerCase(), v.trim()])
    .filter(([k, v]) => UPI_LINK_KEYS.has(k) && v !== "");
  const pa = kept.find(([k]) => k === "pa")?.[1];
  if (!pa || !isValidVpa(pa)) return null;
  const cu = kept.find(([k]) => k === "cu");
  if (cu && cu[1] !== "INR") return null;
  if (!cu) kept.push(["cu", "INR"]);
  return kept;
}

/**
 * Only a site-relative path is accepted: the CSP allows images from 'self',
 * and a merchant QR must never be pulled from a third-party host.
 */
function isSameOriginPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

let warnedUpi = false;
let warnedQr = false;
let warnedPages = false;

function parsePages(env: SupportEnv): Record<SupportAmount, string> | null {
  const raw = { "10": env.page10?.trim() ?? "", "20": env.page20?.trim() ?? "", "50": env.page50?.trim() ?? "" };
  if (!raw["10"] && !raw["20"] && !raw["50"]) return null;
  if (SUPPORT_AMOUNTS.every((a) => isValidPaymentPage(raw[a]))) return raw;
  if (!warnedPages) {
    warnedPages = true;
    console.warn("[support-card] NEXT_PUBLIC_SUPPORT_PAGE_10/_20/_50 must all be https Razorpay payment page links; payment pages are disabled.");
  }
  return null;
}

/** Validate raw env values. Returns null when the card must not render. */
export function parseSupportConfig(env: SupportEnv): SupportConfig | null {
  const pages = parsePages(env);

  const rawUpi = env.upiLink?.trim() ?? "";
  let upi: UpiParams | null = null;
  if (rawUpi) {
    upi = parseUpiLink(rawUpi);
    if (!upi && !warnedUpi) {
      warnedUpi = true;
      console.warn("[support-card] NEXT_PUBLIC_UPI_LINK must be the upi://pay link from the merchant QR; UPI links are disabled.");
    }
  }

  const rawQr = env.qrSrc?.trim() ?? "";
  let qrSrc: string | null = null;
  if (rawQr) {
    if (isSameOriginPath(rawQr)) {
      qrSrc = rawQr;
    } else if (!warnedQr) {
      warnedQr = true;
      console.warn("[support-card] NEXT_PUBLIC_UPI_QR_SRC must be a site path such as /upi-qr.png; the QR is disabled.");
    }
  }

  if (!upi && !qrSrc && !pages) return null;
  return { upi, qrSrc, pages };
}

/** The build's config. Each NEXT_PUBLIC_* reference must stay literal so Next inlines it. */
export function supportConfig(): SupportConfig | null {
  return parseSupportConfig({
    upiLink: process.env.NEXT_PUBLIC_UPI_LINK,
    qrSrc: process.env.NEXT_PUBLIC_UPI_QR_SRC,
    page10: process.env.NEXT_PUBLIC_SUPPORT_PAGE_10,
    page20: process.env.NEXT_PUBLIC_SUPPORT_PAGE_20,
    page50: process.env.NEXT_PUBLIC_SUPPORT_PAGE_50,
  });
}

/** The merchant payload plus the tapped amount, in rupees with two decimals. */
export function buildUpiLink(upi: UpiParams, amount: SupportAmount): string {
  const params: (readonly [string, string])[] = [...upi, ["am", `${amount}.00`]];
  // "@" in the UPI ID stays literal: it's the form UPI apps expect, and some
  // reject a percent-encoded "%40" in `pa`. Everything else is encoded.
  return `upi://pay?${params.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%40/g, "@")}`).join("&")}`;
}

/**
 * What the pop-up offers on this device — the option with the fewest steps
 * that works there:
 *  - Android: the UPI deep link (straight into the UPI app, no form);
 *  - a computer: the QR to scan with a phone (the payer types the amount);
 *  - otherwise, and always on iPhone (upi:// links aren't reliably handled
 *    there, and a QR on the same phone can't be scanned): the payment pages;
 *  - nothing when none of these is configured for the device.
 */
export type SupportVariant = "pages" | "deeplink" | "qr";

export function supportVariant(
  device: DeviceClass,
  config: SupportConfig
): SupportVariant | null {
  if (device === "android" && config.upi) return "deeplink";
  if (device === "desktop" && config.qrSrc) return "qr";
  return config.pages ? "pages" : null;
}

// ── Show/hide rules ─────────────────────────────────────────────────────────
// Storage can throw (Safari private mode, blocked site data). Each access is
// guarded; when storage is unavailable the in-memory flag still limits the card
// to once per page load.

let shownThisPageLoad = false;

function readStorage(kind: "local" | "session", key: string): string | null {
  try {
    return (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(kind: "local" | "session", key: string, value: string): void {
  try {
    (kind === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    /* storage unavailable — the page-load flag still applies */
  }
}

/** Whether a fresh download may reveal the card now. */
export function canShowSupport(now: number = Date.now()): boolean {
  if (shownThisPageLoad) return false;
  if (readStorage("session", SUPPORT_SEEN_KEY)) return false;
  const tappedAt = Number(readStorage("local", SUPPORT_TAPPED_KEY));
  if (Number.isFinite(tappedAt) && tappedAt > 0) {
    const age = now - tappedAt;
    if (age >= 0 && age < SUPPORT_SNOOZE_MS) return false;
  }
  return true;
}

/** Record that the card was shown — it stays away for the rest of the session. */
export function markSupportShown(): void {
  shownThisPageLoad = true;
  writeStorage("session", SUPPORT_SEEN_KEY, "1");
}

/** Record an amount tap — the card stays away for SUPPORT_SNOOZE_MS. */
export function markSupportTapped(now: number = Date.now()): void {
  writeStorage("local", SUPPORT_TAPPED_KEY, String(now));
}
