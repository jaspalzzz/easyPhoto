/**
 * Print sheet — jsPDF.
 * --------------------
 * Tile N copies of the finished photo onto a standard 4×6" photo sheet at the
 * EXACT print millimetre size, with light cut guides. The user prints this at a
 * kiosk/home printer and cuts out the copies.
 *
 * The photo canvas is already rendered at the print DPI, so placing it at the
 * spec's mm size preserves resolution. We pick the sheet orientation + grid
 * that fits the most copies.
 *
 * jsPDF is dynamically imported inside generatePrintSheet() so its ~140kB only
 * loads when the user actually exports a sheet — the pure layout maths
 * (maxCopiesPerSheet) stays dependency-free for the rest of the UI.
 */

const SHEET_IN = { w: 4, h: 6 };
const MM_PER_IN = 25.4;
const MARGIN_MM = 4;
const GAP_MM = 3;

export interface PrintSheetOptions {
  /** Finished photo canvas (rendered at print DPI). */
  canvas: HTMLCanvasElement;
  /** Exact print size in mm (e.g. {width:51,height:51}). */
  photoMm: { width: number; height: number };
  /** Desired copies; clamped to what fits. Defaults to the max that fit. */
  copies?: number;
}

interface Layout {
  orientation: "portrait" | "landscape";
  sheet: { w: number; h: number };
  cols: number;
  rows: number;
  capacity: number;
}

function gridFor(
  sheetW: number,
  sheetH: number,
  pw: number,
  ph: number
): { cols: number; rows: number } {
  const cols = Math.max(
    0,
    Math.floor((sheetW - 2 * MARGIN_MM + GAP_MM) / (pw + GAP_MM))
  );
  const rows = Math.max(
    0,
    Math.floor((sheetH - 2 * MARGIN_MM + GAP_MM) / (ph + GAP_MM))
  );
  return { cols, rows };
}

function bestLayout(photoMm: { width: number; height: number }): Layout {
  const portrait = { w: SHEET_IN.w * MM_PER_IN, h: SHEET_IN.h * MM_PER_IN };
  const landscape = { w: portrait.h, h: portrait.w };

  const p = gridFor(portrait.w, portrait.h, photoMm.width, photoMm.height);
  const l = gridFor(landscape.w, landscape.h, photoMm.width, photoMm.height);
  const pCap = p.cols * p.rows;
  const lCap = l.cols * l.rows;

  if (lCap > pCap) {
    return {
      orientation: "landscape",
      sheet: landscape,
      cols: l.cols,
      rows: l.rows,
      capacity: lCap,
    };
  }
  return {
    orientation: "portrait",
    sheet: portrait,
    cols: p.cols,
    rows: p.rows,
    capacity: pCap,
  };
}

export function maxCopiesPerSheet(photoMm: {
  width: number;
  height: number;
}): number {
  return bestLayout(photoMm).capacity;
}

/** Build a 4×6" print sheet PDF; returns a Blob ready to download. */
export async function generatePrintSheet(
  opts: PrintSheetOptions
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const { canvas, photoMm } = opts;
  const layout = bestLayout(photoMm);
  if (layout.capacity === 0) {
    throw new Error("Photo is too large to fit on a 4×6 inch sheet.");
  }

  const copies = Math.min(opts.copies ?? layout.capacity, layout.capacity);
  const pw = photoMm.width;
  const ph = photoMm.height;

  // Centre the grid block on the sheet.
  const blockW = layout.cols * pw + (layout.cols - 1) * GAP_MM;
  const blockH = layout.rows * ph + (layout.rows - 1) * GAP_MM;
  const startX = (layout.sheet.w - blockW) / 2;
  const startY = (layout.sheet.h - blockH) / 2;

  const doc = new jsPDF({
    unit: "mm",
    format: [layout.sheet.w, layout.sheet.h],
    orientation: layout.orientation,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  doc.setDrawColor(180);
  doc.setLineWidth(0.1);

  let placed = 0;
  for (let r = 0; r < layout.rows && placed < copies; r++) {
    for (let c = 0; c < layout.cols && placed < copies; c++) {
      const x = startX + c * (pw + GAP_MM);
      const y = startY + r * (ph + GAP_MM);
      doc.addImage(imgData, "JPEG", x, y, pw, ph);
      doc.rect(x, y, pw, ph); // thin cut guide
      placed++;
    }
  }

  return doc.output("blob");
}
