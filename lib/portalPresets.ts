/**
 * Portal specifications for image resizing (photo + signature).
 * -----------------------------------------------------------
 * Standard rules for Indian government & global portal forms.
 */

export interface PortalSpec {
  id: string;
  name: string;
  photoLimitKb: number;
  photoMinKb?: number;
  sigLimitKb?: number;
  sigMinKb?: number;
  photoWidthPx?: number;
  photoHeightPx?: number;
  sigWidthPx?: number;
  sigHeightPx?: number;
  photoAspectRatio?: number; // width / height
  sigAspectRatio?: number;
  description: string;
}

export const PORTAL_PRESETS: Record<string, PortalSpec> = {
  ssc: {
    id: "ssc",
    name: "SSC (Staff Selection Commission)",
    photoLimitKb: 50,
    photoMinKb: 20,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 140,
    sigHeightPx: 60,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 4 / 2,
    description: "Staff Selection Commission photo (20-50 KB, 3.5x4.5cm) and signature (10-20 KB, 4.0x2.0cm).",
  },
  upsc: {
    id: "upsc",
    name: "UPSC (Union Public Service Commission)",
    photoLimitKb: 300,
    photoMinKb: 20,
    sigLimitKb: 300,
    sigMinKb: 20,
    photoWidthPx: 350,
    photoHeightPx: 350, // UPSC wants square aspects
    sigWidthPx: 350,
    sigHeightPx: 350,
    photoAspectRatio: 1,
    sigAspectRatio: 1,
    description: "Union Public Service Commission online application photo & signature. Limits: 20-300 KB each, minimum 350x350 px.",
  },
  ds160: {
    id: "ds160",
    name: "US DS-160 (Visa)",
    photoLimitKb: 240,
    photoWidthPx: 600,
    photoHeightPx: 600,
    photoAspectRatio: 1,
    description: "Online US Visa Application DS-160. Square photo (600x600px up to 1200x1200px), under 240 KB limit, white background.",
  },
  "passport-seva": {
    id: "passport-seva",
    name: "Passport Seva (India)",
    photoLimitKb: 50,
    photoMinKb: 30,
    sigLimitKb: 20,
    sigMinKb: 10,
    photoWidthPx: 350,
    photoHeightPx: 450,
    sigWidthPx: 450,
    sigHeightPx: 150,
    photoAspectRatio: 3.5 / 4.5,
    sigAspectRatio: 4.5 / 1.5,
    description: "Passport Seva online portal. Photo needs white background (30-50 KB, 3.5x4.5cm). Signature size: 10-20 KB.",
  },
  oci: {
    id: "oci",
    name: "OCI Card (India)",
    photoLimitKb: 200,
    sigLimitKb: 200,
    photoWidthPx: 360,
    photoHeightPx: 360,
    sigWidthPx: 360,
    sigHeightPx: 360, // OCI signature must be 1:1 square aspect ratio
    photoAspectRatio: 1,
    sigAspectRatio: 1,
    description: "Overseas Citizen of India (OCI) registration. Square photo and signature (up to 200 KB each, minimum 360x360 px).",
  },
};

export const PORTAL_KEYS = Object.keys(PORTAL_PRESETS) as Array<keyof typeof PORTAL_PRESETS>;
