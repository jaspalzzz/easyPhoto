/**
 * AI photo-quality checks — the "is this photo actually usable?" analysis that
 * a file-size/dimension check can't do. Reuses the MediaPipe FaceLandmarker
 * (lib/faceDetection.ts) for face geometry, plus lightweight pixel sampling of
 * the background region for plainness and even lighting. Each result carries a
 * concrete fix. 100% in-browser; nothing is uploaded.
 *
 * Honesty: face geometry (present / single / centred / size / in-frame) is
 * reliable. Background + lighting are HEURISTICS and only ever "warn".
 */

import { detectFace } from "./faceDetection";

export interface PhotoCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  /** Concrete next step shown only on warn/fail. */
  fix?: string;
  /** Optional internal tool route that resolves the issue (renders the fix as a link). */
  href?: string;
}

/** Draw onto a small canvas for cheap pixel sampling (keeps mobile memory low). */
function sampleCanvas(
  image: HTMLImageElement | HTMLCanvasElement,
  size: { width: number; height: number }
): { data: Uint8ClampedArray; w: number; h: number } | null {
  const cap = 320;
  const scale = Math.min(1, cap / Math.max(size.width, size.height));
  const w = Math.max(1, Math.round(size.width * scale));
  const h = Math.max(1, Math.round(size.height * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, w, h);
  return { data: ctx.getImageData(0, 0, w, h).data, w, h };
}

const luma = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

export async function checkPhotoQuality(
  image: HTMLImageElement | HTMLCanvasElement,
  size: { width: number; height: number }
): Promise<PhotoCheck[]> {
  const checks: PhotoCheck[] = [];

  // ── Face geometry (reliable) ───────────────────────────────────────────
  let det: Awaited<ReturnType<typeof detectFace>> | null = null;
  try {
    det = await detectFace(image, size);
  } catch {
    det = null;
  }

  if (!det) {
    checks.push({
      label: "Face detected",
      status: "fail",
      detail: "No clear face was found in the photo.",
      fix: "Use a front-facing photo with your whole head visible and even lighting.",
    });
  } else {
    checks.push({
      label: "Face detected",
      status: "pass",
      detail: "A clear, front-facing face was found.",
    });

    checks.push(
      det.faceCount === 1
        ? { label: "One person only", status: "pass", detail: "Only you are in the frame." }
        : {
            label: "One person only",
            status: "fail",
            detail: `${det.faceCount} faces detected.`,
            fix: "Crop the photo so only the applicant is visible.",
          }
    );

    const offset = Math.abs(det.faceCenterX / size.width - 0.5);
    checks.push(
      offset <= 0.12
        ? { label: "Head centred", status: "pass", detail: "Your face is horizontally centred." }
        : {
            label: "Head centred",
            status: "warn",
            detail: "Your face looks off to one side.",
            fix: "Re-centre so your face sits in the middle of the frame.",
          }
    );

    const headPct = Math.round(((det.chinY - det.crownY) / size.height) * 100);
    if (headPct < 45) {
      checks.push({
        label: "Head size",
        status: "warn",
        detail: `Your head fills about ${headPct}% of the height — likely too small.`,
        fix: "Move closer or crop tighter so the head fills roughly 60–80%.",
      });
    } else if (headPct > 92) {
      checks.push({
        label: "Head size",
        status: "warn",
        detail: `Your head fills about ${headPct}% — likely too close / cropped.`,
        fix: "Step back so there's space above your head and around the shoulders.",
      });
    } else {
      checks.push({
        label: "Head size",
        status: "pass",
        detail: `Your head fills about ${headPct}% of the photo.`,
      });
    }

    // Eyes level (ICAO roll) — a tilted head is a common rejection cause and is
    // reliable from landmarks. Within ±5° passes; ±5–10° warns; beyond fails.
    const tilt = Math.abs(det.rollDeg);
    if (tilt <= 5) {
      checks.push({
        label: "Eyes level",
        status: "pass",
        detail: "Your head is straight and your eyes are level.",
      });
    } else {
      checks.push({
        label: "Eyes level",
        status: tilt <= 10 ? "warn" : "fail",
        detail: `Your head is tilted about ${Math.round(tilt)}°.`,
        fix: "Straighten the photo so your eyes are level.",
        href: "/tools/straighten-photo/",
      });
    }

    // Eye line height — for a correctly framed passport photo the eyes sit in
    // the upper-middle band. Landmark-based but framing-dependent, so warn only.
    if (det.eyeCenterY != null) {
      const eyeBand = det.eyeCenterY / size.height;
      checks.push(
        eyeBand >= 0.3 && eyeBand <= 0.55
          ? {
              label: "Eye position",
              status: "pass",
              detail: "Your eyes sit in the expected upper-middle band.",
            }
          : {
              label: "Eye position",
              status: "warn",
              detail:
                eyeBand < 0.3
                  ? "Your eyes sit high in the frame."
                  : "Your eyes sit low in the frame.",
              fix: "Re-crop so your eyes fall in the upper-middle third of the photo.",
            }
      );
    }

    const topMargin = det.crownY / size.height;
    const cutSides = det.faceXSpan.min < 2 || det.faceXSpan.max > size.width - 2;
    const cutBottom = det.chinY > size.height - 2;
    checks.push(
      topMargin < 0.03 || cutSides || cutBottom
        ? {
            label: "Whole head visible",
            status: "warn",
            detail: "Your head may be touching or cut off at an edge.",
            fix: "Leave a small margin above the head and on both sides of the face.",
          }
        : {
            label: "Whole head visible",
            status: "pass",
            detail: "Your head and a margin are inside the frame.",
          }
    );
  }

  // ── Background + lighting (heuristic — warn only) ──────────────────────
  const sample = sampleCanvas(image, size);
  if (sample) {
    const { data, w, h } = sample;
    // Background region = top strip (above the head for most portraits).
    const y0 = Math.round(h * 0.02);
    const y1 = Math.max(y0 + 1, Math.round(h * 0.14));
    let sum = 0;
    let n = 0;
    let leftSum = 0;
    let leftN = 0;
    let rightSum = 0;
    let rightN = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const L = luma(data[i], data[i + 1], data[i + 2]);
        sum += L;
        n++;
        if (x < w / 3) {
          leftSum += L;
          leftN++;
        } else if (x > (w * 2) / 3) {
          rightSum += L;
          rightN++;
        }
      }
    }
    const avg = n ? sum / n : 0;
    checks.push(
      avg >= 200
        ? { label: "Plain light background", status: "pass", detail: "The background looks plain and light." }
        : {
            label: "Plain light background",
            status: "warn",
            detail: "The background looks dark or busy.",
            fix: "Use a plain white or light-grey wall behind you — or use the white-background tool.",
          }
    );
    const leftAvg = leftN ? leftSum / leftN : 0;
    const rightAvg = rightN ? rightSum / rightN : 0;
    if (Math.abs(leftAvg - rightAvg) > 35) {
      checks.push({
        label: "Even lighting",
        status: "warn",
        detail: "One side of the background is darker — there may be a shadow.",
        fix: "Light yourself evenly from the front so the background has no shadow.",
      });
    } else {
      checks.push({
        label: "Even lighting",
        status: "pass",
        detail: "Lighting across the background looks even.",
      });
    }
  }

  return checks;
}
