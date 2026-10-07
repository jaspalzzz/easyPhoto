/**
 * "Support easyPhoto" tip pop-up — configuration, UPI deep-link builder and the
 * show/hide rules. The React surface lives in components/site/SupportCard.tsx;
 * everything testable without a DOM lives here.
 *
 * One button, any amount: the visitor decides what to give, and the route is
 * the one with the fewest steps on their device (supportVariant).
 *
 * Config is build-time (NEXT_PUBLIC_* is inlined by Next.js, like
 * NEXT_PUBLIC_ADSENSE_ENABLED): with nothing valid set the pop-up never
 * renders, so unsetting the variables and rebuilding is the rollback.
 *  - UPI deep link (NEXT_PUBLIC_UPI_LINK): the upi://pay payload of the
 *    merchant's Razorpay multiple-payment QR, used as-is on Android — the UPI
 *    app opens and the payer types the amount. No form.
 *  - QR image (NEXT_PUBLIC_UPI_QR_SRC): the same QR, shown on computers to
 *    scan with a phone.
 *  - Payment link (NEXT_PUBLIC_SUPPORT_LINK): the merchant's Razorpay link
 *    (razorpay.me/@handle), where the payer types the amount; Razorpay then
 *    asks for a phone number. The fallback: iPhone always, and Android or
 *    computers when their UPI option isn't set.
 */

import type { DeviceClass } from "@/lib/analytics";

/** Session flag: the card has been shown in this browser session. */
export const SUPPORT_SEEN_KEY = "ep:support-seen";
/** Local timestamp (epoch ms) of the last tap on the tip button. */
export const SUPPORT_TAPPED_KEY = "ep:support-tapped-at";
/** After a tap the card stays away this long. */
export const SUPPORT_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

/** How a tap left the pop-up — the only detail a support_tap records. */
export type SupportMethod = "upi" | "link";

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
 * an `am` — is dropped, so the payer always chooses the amount.
 */
const UPI_LINK_KEYS = new Set(["pa", "pn", "mc", "mode", "tr", "tn", "cu"]);

/** A validated upi://pay payload, in its original order, without an amount. */
export type UpiParams = ReadonlyArray<readonly [string, string]>;

export interface SupportConfig {
  /** The merchant QR's UPI payload, or null when not set or invalid. */
  upi: UpiParams | null;
  /** Same-origin path to the merchant QR in public/, or null when not set. */
  qrSrc: string | null;
  /** The merchant's hosted payment link, or null when not set or invalid. */
  link: string | null;
}

export interface SupportEnv {
  upiLink?: string;
  qrSrc?: string;
  link?: string;
}

/**
 * Payment links must be https on Razorpay's own hosts, so a typo in the
 * Cloudflare variable can never send a visitor to someone else's page.
 */
const LINK_HOSTS = ["razorpay.me", "rzp.io", "pages.razorpay.com"];

export function isValidPaymentLink(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && LINK_HOSTS.includes(url.hostname) && url.pathname.length > 1;
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

const warned = new Set<string>();
function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[support-card] ${message}`);
}

/** Validate raw env values. Returns null when the card must not render. */
export function parseSupportConfig(env: SupportEnv): SupportConfig | null {
  const rawUpi = env.upiLink?.trim() ?? "";
  const upi = rawUpi ? parseUpiLink(rawUpi) : null;
  if (rawUpi && !upi) {
    warnOnce("upi", "NEXT_PUBLIC_UPI_LINK must be the upi://pay link from the merchant QR; UPI links are disabled.");
  }

  const rawQr = env.qrSrc?.trim() ?? "";
  const qrSrc = rawQr && isSameOriginPath(rawQr) ? rawQr : null;
  if (rawQr && !qrSrc) {
    warnOnce("qr", "NEXT_PUBLIC_UPI_QR_SRC must be a site path such as /upi-qr.png; the QR is disabled.");
  }

  const rawLink = env.link?.trim() ?? "";
  const link = rawLink && isValidPaymentLink(rawLink) ? rawLink : null;
  if (rawLink && !link) {
    warnOnce("link", "NEXT_PUBLIC_SUPPORT_LINK must be an https Razorpay link such as https://razorpay.me/@name; it is disabled.");
  }

  if (!upi && !qrSrc && !link) return null;
  return { upi, qrSrc, link };
}

/** The build's config. Each NEXT_PUBLIC_* reference must stay literal so Next inlines it. */
export function supportConfig(): SupportConfig | null {
  return parseSupportConfig({
    upiLink: process.env.NEXT_PUBLIC_UPI_LINK,
    qrSrc: process.env.NEXT_PUBLIC_UPI_QR_SRC,
    link: process.env.NEXT_PUBLIC_SUPPORT_LINK,
  });
}

/** The merchant payload as a upi://pay link; the payer enters the amount. */
export function buildUpiLink(upi: UpiParams): string {
  // "@" in the UPI ID stays literal: it's the form UPI apps expect, and some
  // reject a percent-encoded "%40" in `pa`. Everything else is encoded.
  return `upi://pay?${upi.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%40/g, "@")}`).join("&")}`;
}

/**
 * What the pop-up offers on this device — the route with the fewest steps
 * that works there:
 *  - Android: the UPI deep link (straight into the UPI app, no form);
 *  - a computer: the QR to scan with a phone;
 *  - otherwise, and always on iPhone (upi:// links aren't reliably handled
 *    there, and a QR on the same phone can't be scanned): the payment link;
 *  - nothing when none of these is configured for the device.
 */
export type SupportVariant = "deeplink" | "qr" | "link";

export function supportVariant(
  device: DeviceClass,
  config: SupportConfig
): SupportVariant | null {
  if (device === "android" && config.upi) return "deeplink";
  if (device === "desktop" && config.qrSrc) return "qr";
  return config.link ? "link" : null;
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

/** Record a tap on the tip button — the card stays away for SUPPORT_SNOOZE_MS. */
export function markSupportTapped(now: number = Date.now()): void {
  writeStorage("local", SUPPORT_TAPPED_KEY, String(now));
}
