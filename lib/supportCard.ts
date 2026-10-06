/**
 * "Support easyPhoto" UPI card — configuration, deep-link builder and the
 * show/hide rules. The React surface lives in components/site/SupportCard.tsx;
 * everything testable without a DOM lives here.
 *
 * Config is build-time (NEXT_PUBLIC_* is inlined by Next.js, like
 * NEXT_PUBLIC_ADSENSE_ENABLED): with no valid merchant VPA the card never
 * renders, so unsetting the variable and rebuilding is the rollback.
 *
 * Deep link: NPCI "UPI Linking Specification" — upi://pay with pa (payee VPA),
 * pn (payee name), am (amount), cu (currency, INR only) and tn (note). Every
 * value is percent-encoded.
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

const DEFAULT_PAYEE = "easyPhoto";
const PAYEE_MAX = 50;
const TRANSACTION_NOTE = "Support easyPhoto";

/**
 * VPA shape `name@handle`: the NPCI handle is letters (optionally with digits,
 * dots or hyphens after the first letter); the name part allows letters,
 * digits, dot, hyphen and underscore.
 */
const VPA_RE = /^[a-z0-9._-]{2,256}@[a-z][a-z0-9.-]{1,63}$/i;

export interface SupportConfig {
  vpa: string;
  payee: string;
  /** Same-origin path to the merchant QR in public/, or null when not set. */
  qrSrc: string | null;
}

export interface SupportEnv {
  vpa?: string;
  payee?: string;
  qrSrc?: string;
}

export function isValidVpa(value: string): boolean {
  return VPA_RE.test(value);
}

/**
 * Only a site-relative path is accepted: the CSP allows images from 'self',
 * and a merchant QR must never be pulled from a third-party host.
 */
function isSameOriginPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

let warnedVpa = false;
let warnedQr = false;

/** Validate raw env values. Returns null when the card must not render. */
export function parseSupportConfig(env: SupportEnv): SupportConfig | null {
  const vpa = env.vpa?.trim() ?? "";
  if (!vpa) return null;
  if (!isValidVpa(vpa)) {
    if (!warnedVpa) {
      warnedVpa = true;
      console.warn("[support-card] NEXT_PUBLIC_UPI_VPA is not a valid UPI ID; the card is disabled.");
    }
    return null;
  }

  const payee = env.payee?.trim().slice(0, PAYEE_MAX) || DEFAULT_PAYEE;

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

  return { vpa, payee, qrSrc };
}

/** The build's config. Each NEXT_PUBLIC_* reference must stay literal so Next inlines it. */
export function supportConfig(): SupportConfig | null {
  return parseSupportConfig({
    vpa: process.env.NEXT_PUBLIC_UPI_VPA,
    payee: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME,
    qrSrc: process.env.NEXT_PUBLIC_UPI_QR_SRC,
  });
}

export function buildUpiLink(config: Pick<SupportConfig, "vpa" | "payee">, amount: SupportAmount): string {
  const params: [string, string][] = [
    ["pa", config.vpa],
    ["pn", config.payee],
    ["am", amount],
    ["cu", "INR"],
    ["tn", TRANSACTION_NOTE],
  ];
  // "@" in the UPI ID stays literal: it's the form UPI apps expect, and some
  // reject a percent-encoded "%40" in `pa`. Everything else is encoded.
  return `upi://pay?${params.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%40/g, "@")}`).join("&")}`;
}

/**
 * What the card offers on this device. Android opens a UPI app per amount via
 * the deep link. On a computer a static QR is the only route (it cannot preset
 * an amount), so without a configured QR there is no card. iPhone gets no card:
 * upi:// links aren't reliably handled there, and a QR on the same phone can't
 * be scanned.
 */
export type SupportVariant = "deeplink" | "qr";

export function supportVariant(
  device: DeviceClass,
  config: SupportConfig
): SupportVariant | null {
  if (device === "android") return "deeplink";
  if (device === "ios") return null;
  return config.qrSrc ? "qr" : null;
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
