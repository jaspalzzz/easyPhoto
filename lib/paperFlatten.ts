/**
 * Whitens the paper in a phone photo of a signature while keeping the ink.
 *
 * A fixed "lighter than X is paper" threshold fails on phone photos: the paper
 * comes out grey (luma 150–200) and darker towards one side where a hand or the
 * phone cast a shadow. Here each pixel is compared with the paper *around it*:
 * a coarse paper map is built from a small copy of the image, with a max
 * filter so thin ink strokes don't darken it, then every pixel is divided by
 * that map. Paper lands at white wherever it is, and ink, which is much darker
 * than its local paper, keeps its colour. Pure functions on RGBA arrays; the
 * canvas plumbing lives with the caller.
 */

const luma = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

/**
 * The local paper brightness of a small RGBA image: each pixel's luma replaced
 * by the brightest luma within `radius` pixels. Ink strokes are thin and dark,
 * so the brightest nearby pixel is paper. Returns one luma value per pixel.
 */
export function paperLevels(small: Uint8ClampedArray, width: number, height: number, radius = 1): Uint8ClampedArray {
  const l = new Uint8ClampedArray(width * height);
  for (let i = 0; i < l.length; i += 1) l[i] = luma(small[i * 4], small[i * 4 + 1], small[i * 4 + 2]);
  const out = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let best = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        const yy = y + dy;
        if (yy < 0 || yy >= height) continue;
        for (let dx = -radius; dx <= radius; dx += 1) {
          const xx = x + dx;
          if (xx < 0 || xx >= width) continue;
          const v = l[yy * width + xx];
          if (v > best) best = v;
        }
      }
      out[y * width + x] = best;
    }
  }
  return out;
}

/** Bilinear upscale of a `sw × sh` level map to `width × height`. */
export function upsampleLevels(
  levels: Uint8ClampedArray,
  sw: number,
  sh: number,
  width: number,
  height: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y += 1) {
    const fy = Math.min(sh - 1, Math.max(0, ((y + 0.5) * sh) / height - 0.5));
    const y0 = Math.floor(fy);
    const y1 = Math.min(sh - 1, y0 + 1);
    const ty = fy - y0;
    for (let x = 0; x < width; x += 1) {
      const fx = Math.min(sw - 1, Math.max(0, ((x + 0.5) * sw) / width - 0.5));
      const x0 = Math.floor(fx);
      const x1 = Math.min(sw - 1, x0 + 1);
      const tx = fx - x0;
      const top = levels[y0 * sw + x0] * (1 - tx) + levels[y0 * sw + x1] * tx;
      const bottom = levels[y1 * sw + x0] * (1 - tx) + levels[y1 * sw + x1] * tx;
      out[y * width + x] = top * (1 - ty) + bottom * ty;
    }
  }
  return out;
}

export interface FlattenOptions {
  /** Share of the local paper brightness at and above which a pixel becomes white. */
  whitePoint?: number;
  /** Share below which a pixel is kept as ink; between the two it fades to white. */
  inkPoint?: number;
}

/**
 * Divides each pixel by its local paper brightness (`paper`, one luma per
 * pixel), so paper becomes white and ink keeps its colour, then sets anything
 * near the paper's brightness to pure white. Changes `pixels` in place.
 */
export function flattenPaper(pixels: Uint8ClampedArray, paper: Uint8ClampedArray, opts: FlattenOptions = {}): void {
  const whitePoint = opts.whitePoint ?? 0.88;
  const inkPoint = opts.inkPoint ?? 0.55;
  for (let p = 0, i = 0; p < paper.length; p += 1, i += 4) {
    const scale = 255 / Math.max(paper[p], 16);
    const r = Math.min(255, pixels[i] * scale);
    const g = Math.min(255, pixels[i + 1] * scale);
    const b = Math.min(255, pixels[i + 2] * scale);
    const n = luma(r, g, b) / 255;
    // Fade between ink and white so stroke edges stay smooth.
    const t = n >= whitePoint ? 1 : n <= inkPoint ? 0 : (n - inkPoint) / (whitePoint - inkPoint);
    pixels[i] = r + (255 - r) * t;
    pixels[i + 1] = g + (255 - g) * t;
    pixels[i + 2] = b + (255 - b) * t;
  }
}
