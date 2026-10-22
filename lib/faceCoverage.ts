/**
 * How much of a photo the head fills — UPSC's "Face must cover at least 75% or
 * 3/4th of the area in the photo" — and how to crop closer without cutting the
 * head. Pure geometry on the face detector's landmark box; no DOM.
 *
 * Calibration (docs/feature-upsc-face-coverage-2026-10.md, 10 Oct 2026): on
 * UPSC's own sample photos the head box (hair top → chin × ear → ear) was
 * 1.25× the landmark box's width and 1.41× its height, consistently (three
 * samples, ±1%). UPSC accepted the sample at 84% and rejected 39% and 58%.
 */

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface FaceLandmarkBox {
  /** Horizontal and vertical extent of the face landmarks, in image pixels. */
  xSpan: { min: number; max: number };
  ySpan: { min: number; max: number };
}

export const HEAD_WIDTH_PER_FACE_WIDTH = 1.25;
export const HEAD_HEIGHT_PER_FACE_HEIGHT = 1.41;

/** The head box estimated from the landmark box: centred on the face, chin at the bottom. */
export function estimateHeadBox({ xSpan, ySpan }: FaceLandmarkBox): Box {
  const faceW = xSpan.max - xSpan.min;
  const faceH = ySpan.max - ySpan.min;
  const cx = (xSpan.min + xSpan.max) / 2;
  const headW = faceW * HEAD_WIDTH_PER_FACE_WIDTH;
  const headH = faceH * HEAD_HEIGHT_PER_FACE_HEIGHT;
  return { left: cx - headW / 2, right: cx + headW / 2, bottom: ySpan.max, top: ySpan.max - headH };
}

/** Share of the photo's area the head fills (the part of the head inside the photo). */
export function headCoverage(head: Box, width: number, height: number): number {
  if (!(width > 0) || !(height > 0)) return 0;
  const w = Math.max(0, Math.min(head.right, width) - Math.max(head.left, 0));
  const h = Math.max(0, Math.min(head.bottom, height) - Math.max(head.top, 0));
  return (w * h) / (width * height);
}

/**
 * True when the photo cuts into the sides of the head (ears) by more than a
 * small tolerance — UPSC's "Too Close" sample. Hair touching the top edge is
 * fine: UPSC's accepted sample has it.
 */
export function headIsCut(head: Box, width: number, tolerance = 0.03): boolean {
  const slack = (head.right - head.left) * tolerance;
  return head.left < -slack || head.right > width + slack;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Share of the crop's width the head fills: ears a little inside the sides, as in UPSC's accepted sample (88%). */
const CROP_HEAD_WIDTH_SHARE = 0.9;
/**
 * Share of the crop's spare height placed above the head. The estimate stops
 * at the crown of short hair; fuller hair rises above it, so most of the room
 * goes on top and the chin stays near the bottom.
 */
const CROP_TOP_SLACK_SHARE = 2 / 3;

/**
 * A closer crop with the head filling about `target` of the area: ears a
 * little inside the sides, room above for the hair, chin near the bottom.
 * Never cuts into the estimated head. Returns null when the head already fills
 * the target, or when no crop inside the photo can contain the whole head.
 */
export function planCloserCrop(head: Box, width: number, height: number, target = 0.8): CropRect | null {
  if (headCoverage(head, width, height) >= target) return null;
  const headW = head.right - head.left;
  const headH = head.bottom - head.top;
  const shareW = CROP_HEAD_WIDTH_SHARE;
  const shareH = target / shareW;
  let cropW = headW / shareW;
  let cropH = headH / shareH;
  if (cropW > width) cropW = width;
  if (cropH > height) cropH = height;
  if (cropW < headW || cropH < headH) return null;

  const cx = (head.left + head.right) / 2;
  let x = cx - cropW / 2;
  let y = head.top - (cropH - headH) * CROP_TOP_SLACK_SHARE;
  x = Math.min(Math.max(0, x), width - cropW);
  y = Math.min(Math.max(0, y), height - cropH);
  if (x > head.left + 0.5 || x + cropW < head.right - 0.5 || y + cropH < head.bottom - 0.5) return null;
  return { x: Math.round(x), y: Math.round(y), width: Math.round(cropW), height: Math.round(cropH) };
}

/** The head box in a crop's own coordinates. */
export function headInCrop(head: Box, crop: CropRect): Box {
  return { left: head.left - crop.x, right: head.right - crop.x, top: head.top - crop.y, bottom: head.bottom - crop.y };
}
