import { CONVERT_SLUGS } from "@/lib/convertPairs";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
import { MAKER_PAGES } from "@/lib/makerPages";
import { PORTAL_KEYS } from "@/lib/portalPresets";

const ALWAYS_EXCLUDED_PATHS = [
  "/privacy/",
  "/terms/",
  "/disclaimer/",
  "/contact/",
  "/about/",
] as const;

// Upload/result workspaces that sit outside a registry-backed route family.
// Keep this list small: registry-driven families are assembled below.
const ROOT_WORKSPACE_PATHS = [
  "/baby-passport-photo/",
  "/passport-photo/",
  "/visa-photo/",
  "/ssc-photo-with-name-date/",
  "/unlock-aadhaar-pdf/",
] as const;

const EXCLUDED_PREFIXES = ["/tools/", "/embed/", "/exam-resizer/"] as const;

// Most root exam resizers use the portal id directly. These are the existing
// URL-name exceptions; the underlying portal set still comes from PORTAL_KEYS.
const PORTAL_ROUTE_ALIASES: Partial<Record<(typeof PORTAL_KEYS)[number], readonly string[]>> = {
  pan: ["pan-card"],
  rrb: ["railway"],
  sbi: ["sbi-po"],
};

const PORTAL_WORKSPACE_PATHS = PORTAL_KEYS.flatMap((portalId) => {
  const routeIds = [portalId, ...(PORTAL_ROUTE_ALIASES[portalId] ?? [])];
  return [
    `/exam-requirements/${portalId}/`,
    ...routeIds.flatMap((routeId) => [
      `/${routeId}-photo-resizer/`,
      `/${routeId}-signature-resizer/`,
    ]),
  ];
});

const EXCLUDED_EXACT = new Set<string>([
  ...ALWAYS_EXCLUDED_PATHS,
  ...ROOT_WORKSPACE_PATHS,
  ...PORTAL_WORKSPACE_PATHS,
  ...MAKER_PAGES.map((maker) => `/${maker.slug}/`),
  ...HINGLISH_SLUGS.map((slug) => `/${slug}/`),
  ...CONVERT_SLUGS.map((slug) => `/convert/${slug}/`),
]);

export function normalizeAdPath(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/**
 * One policy boundary for every page that must never initialize AdSense.
 * Registry-backed exact paths keep generated upload routes in sync, while the
 * prefixes cover tool families whose route itself is their registry boundary.
 */
export function isAdSenseExcludedPath(pathname: string): boolean {
  const normalized = normalizeAdPath(pathname || "/");
  return (
    EXCLUDED_EXACT.has(normalized) ||
    EXCLUDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  );
}
