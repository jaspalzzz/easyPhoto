/**
 * Processing pipeline glue (browser-only).
 * ----------------------------------------
 *   load image (in-memory)
 *     → detectFace            (MediaPipe)
 *     → computeCrop           (pure engine)
 *     → renderPhoto           (1:1 crop → Pica high-quality resize to exact px)
 *     → [Phase 2] background replace over spec.background.hex
 *
 * Pica is dynamically imported so it never lands in the server bundle and the
 * model/codec weight loads only when the user actually processes a photo.
 */

import type { CountrySpec } from "./countrySpecs";
import {
  computeCrop,
  mmToPx,
  type CropResult,
  type CropRect,
  type FaceMeasurements,
  type ComputeCropOpts,
} from "./headPositioning";
import { fillBackground } from "./background";

export interface LoadedImage {
  image: HTMLImageElement;
  size: { width: number; height: number };
  /** Object URL — caller must revokeObjectURL when discarding. */
  url: string;
}

/**
 * Cap the longest edge of the working image. Modern phones shoot 48–108MP;
 * processing at that size allocates 200–400MB+ per full-res canvas across the
 * pipeline (detection, segmentation compose, crop) and can OOM any device.
 * Passport output is only ~500–800px, so even the mobile cap is far more than
 * enough — no visible quality loss, and every device uses less memory.
 *
 * Mobile gets a tighter cap (tab-memory limits); desktop can afford more detail.
 */
const SOURCE_MAX_EDGE_MOBILE = 2500;
const SOURCE_MAX_EDGE_DESKTOP = 4096;

function sourceMaxEdge(): number {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  return /Android|iPhone|iPad|iPod/i.test(ua)
    ? SOURCE_MAX_EDGE_MOBILE
    : SOURCE_MAX_EDGE_DESKTOP;
}

/**
 * Encode a canvas to a PNG **object URL**. Object URLs reference a Blob held
 * once in memory; data: URIs (toDataURL) inline a base64 copy (~1.37× the
 * bytes) into a JS string that lives as long as the URL does. For preview
 * images that can be replaced repeatedly (re-crop, country switch), object URLs
 * are lighter — provided callers revokeObjectURL when replacing/discarding.
 */
export function canvasToObjectURL(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("canvas.toBlob returned null"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

/** Read a user-selected File into an in-memory HTMLImageElement. No upload. */
export function loadImageFromFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const w = image.naturalWidth;
      const h = image.naturalHeight;
      const longest = Math.max(w, h);
      const maxEdge = sourceMaxEdge();
      if (longest <= maxEdge) {
        resolve({ image, size: { width: w, height: h }, url });
        return;
      }
      // Oversized photo: downscale ONCE here so the entire pipeline works in a
      // bounded, lower-memory space (coordinates stay consistent end to end).
      try {
        const scale = maxEdge / longest;
        const dw = Math.max(1, Math.round(w * scale));
        const dh = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement("canvas");
        canvas.width = dw;
        canvas.height = dh;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, 0, 0, dw, dh);
        canvas.toBlob((blob) => {
          if (!blob) {
            // Fall back to the original full-res image if encoding fails.
            resolve({ image, size: { width: w, height: h }, url });
            return;
          }
          URL.revokeObjectURL(url);
          const scaledUrl = URL.createObjectURL(blob);
          const scaled = new Image();
          scaled.onload = () =>
            resolve({
              image: scaled,
              size: { width: dw, height: dh },
              url: scaledUrl,
            });
          scaled.onerror = () => {
            URL.revokeObjectURL(scaledUrl);
            reject(new Error("Could not read that image file."));
          };
          scaled.src = scaledUrl;
        }, "image/png");
      } catch {
        resolve({ image, size: { width: w, height: h }, url });
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image file."));
    };
    image.src = url;
  });
}

let picaInstance: unknown = null;
async function getPica() {
  if (!picaInstance) {
    const Pica = (await import("pica")).default;
    picaInstance = Pica();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return picaInstance as any;
}

/**
 * Render the computed crop to a final, exact-size canvas using Pica for the
 * downscale (sharper than a single drawImage). Background is pre-filled with the
 * country's spec colour so any transparent/letterboxed area is spec-correct.
 */
export async function renderPhoto(
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  result: CropResult,
  spec: CountrySpec
): Promise<HTMLCanvasElement> {
  const { crop, output } = result;

  // 1:1 crop into an intermediate canvas (no scaling here — keep all detail).
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = crop.sw;
  cropCanvas.height = crop.sh;
  const cctx = cropCanvas.getContext("2d");
  if (!cctx) throw new Error("Could not acquire 2D canvas context.");
  cctx.imageSmoothingQuality = "high";
  cctx.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    0,
    0,
    crop.sw,
    crop.sh
  );

  const out = document.createElement("canvas");
  out.width = output.width;
  out.height = output.height;
  fillBackground(out, spec.background.hex);

  const pica = await getPica();
  await pica.resize(cropCanvas, out, { alpha: true });
  return out;
}

/**
 * Full single-pass helper: measurements + spec + dpi → crop result + canvas.
 * Detection is done by the caller (once) and the measurements reused across
 * the print and digital presets, which differ only by DPI.
 *
 * `renderSource` is what actually gets cropped + scaled — pass the bg-composited
 * canvas (Phase 2) so the export has the correct background; the crop geometry
 * is identical to the source image, so `source` must be the source dimensions.
 */
export async function buildPreset(
  renderSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  source: { width: number; height: number },
  measurements: FaceMeasurements,
  spec: CountrySpec,
  opts: ComputeCropOpts
): Promise<{ result: CropResult; canvas: HTMLCanvasElement }> {
  const result = computeCrop(measurements, spec, { ...opts, source });
  const canvas = await renderPhoto(renderSource, result, spec);
  return { result, canvas };
}

/**
 * Manual fine-tune path: the user dragged the crop box, so geometry comes from
 * their rect (source px) instead of computeCrop. We still recompute the
 * achieved head-size + the same quality warnings so the CompliancePanel stays
 * honest about a hand-adjusted crop.
 */
export async function buildPresetFromCrop(
  renderSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  source: { width: number; height: number },
  cropRect: CropRect,
  measurements: FaceMeasurements,
  spec: CountrySpec,
  dpi: number
): Promise<{ result: CropResult; canvas: HTMLCanvasElement }> {
  const output = {
    width: mmToPx(spec.printMm.width, dpi),
    height: mmToPx(spec.printMm.height, dpi),
  };
  const crop: CropRect = {
    sx: Math.round(cropRect.sx),
    sy: Math.round(cropRect.sy),
    sw: Math.round(cropRect.sw),
    sh: Math.round(cropRect.sh),
  };

  const warnings: string[] = [];
  const srcHeadPx = measurements.chinY - measurements.crownY;
  const headPct = crop.sh > 0 ? (srcHeadPx / crop.sh) * 100 : 0;
  const upscale = crop.sh > 0 ? output.height / crop.sh : 0;

  if (upscale > 1.15)
    warnings.push(
      `Low source resolution: needs ${upscale.toFixed(2)}x upscaling (> 1.15). ` +
        `Result may be soft. Request a higher-res photo.`
    );
  if (
    spec.headPercentOfFrame &&
    (headPct > spec.headPercentOfFrame.max + 0.5 ||
      headPct < spec.headPercentOfFrame.min - 0.5)
  )
    warnings.push(
      `Manual crop puts the head at ${headPct.toFixed(1)}% of frame, outside ` +
        `the ${spec.headPercentOfFrame.min}-${spec.headPercentOfFrame.max}% ` +
        `target band. Adjust the crop so the head fills the right amount.`
    );

  const result: CropResult = {
    crop,
    output,
    dpi,
    achieved: {
      headPercentOfFrame: +headPct.toFixed(1),
      upscale: +upscale.toFixed(3),
    },
    warnings,
  };
  const canvas = await renderPhoto(renderSource, result, spec);
  return { result, canvas };
}
