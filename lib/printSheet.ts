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

export interface PrintSheetOptions {
  /** Finished photo canvas (rendered at print DPI). */
  canvas: HTMLCanvasElement;
  /** Exact print size in mm (e.g. {width:51,height:51}). */
  photoMm: { width: number; height: number };
  /** Desired copies; clamped to what fits. Defaults to the max that fit. */
  copies?: number;
  /** Custom paper size. Defaults to '4x6'. */
  paperSize?: PaperSize;
  /** Custom page margins in mm. Defaults to 4. */
  marginMm?: number;
  /** Custom gap spacing in mm. Defaults to 3. */
  gapMm?: number;
}

interface Layout {
  orientation: "portrait" | "landscape";
  sheet: { w: number; h: number };
  cols: number;
  rows: number;
  capacity: number;
}

/** Physical paper sizes in mm (portrait). */
export const PAPER_DIMENSIONS = {
  "4x6": { w: 4 * 25.4, h: 6 * 25.4 },
  "5x7": { w: 5 * 25.4, h: 7 * 25.4 },
  "5x6": { w: 5 * 25.4, h: 6 * 25.4 },
  "4x4": { w: 4 * 25.4, h: 4 * 25.4 },
  a4: { w: 210, h: 297 },
  a5: { w: 148, h: 210 },
  letter: { w: 8.5 * 25.4, h: 11 * 25.4 },
} as const;

export type PaperSize = keyof typeof PAPER_DIMENSIONS;

function gridFor(
  sheetW: number,
  sheetH: number,
  pw: number,
  ph: number,
  marginMm: number,
  gapMm: number
): { cols: number; rows: number } {
  const cols = Math.max(
    0,
    Math.floor((sheetW - 2 * marginMm + gapMm) / (pw + gapMm))
  );
  const rows = Math.max(
    0,
    Math.floor((sheetH - 2 * marginMm + gapMm) / (ph + gapMm))
  );
  return { cols, rows };
}

function bestLayout(
  photoMm: { width: number; height: number },
  opts: Omit<PrintSheetOptions, "canvas" | "photoMm"> = {}
): Layout {
  const paper = PAPER_DIMENSIONS[opts.paperSize ?? "4x6"] ?? PAPER_DIMENSIONS["4x6"];
  const marginMm = opts.marginMm ?? 4;
  const gapMm = opts.gapMm ?? 3;

  const portrait = { w: paper.w, h: paper.h };
  const landscape = { w: paper.h, h: paper.w };

  const p = gridFor(portrait.w, portrait.h, photoMm.width, photoMm.height, marginMm, gapMm);
  const l = gridFor(landscape.w, landscape.h, photoMm.width, photoMm.height, marginMm, gapMm);
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

export function maxCopiesPerSheet(
  photoMm: { width: number; height: number },
  opts?: Omit<PrintSheetOptions, "canvas" | "photoMm">
): number {
  return bestLayout(photoMm, opts).capacity;
}

/** Full grid layout (orientation, sheet size, cols/rows) — drives the live sheet preview. */
export function getSheetLayout(
  photoMm: { width: number; height: number },
  opts?: Omit<PrintSheetOptions, "canvas" | "photoMm">
): Layout {
  return bestLayout(photoMm, opts);
}

/**
 * Where each copy goes on the sheet, in mm from the top-left corner: the grid
 * block is centred on the sheet and filled row by row. `copies` is clamped to
 * what fits (defaults to a full sheet). Pure — shared by the PDF generator and
 * the standalone print-sheet tool so both print photos at the exact mm size.
 */
export function sheetPlacements(
  photoMm: { width: number; height: number },
  opts: Omit<PrintSheetOptions, "canvas" | "photoMm"> = {}
): { layout: Layout; placements: { x: number; y: number }[] } {
  const gapMm = opts.gapMm ?? 3;
  const layout = bestLayout(photoMm, opts);
  const copies = Math.min(Math.max(0, opts.copies ?? layout.capacity), layout.capacity);
  const pw = photoMm.width;
  const ph = photoMm.height;

  // Centre the grid block on the sheet.
  const blockW = layout.cols * pw + (layout.cols - 1) * gapMm;
  const blockH = layout.rows * ph + (layout.rows - 1) * gapMm;
  const startX = (layout.sheet.w - blockW) / 2;
  const startY = (layout.sheet.h - blockH) / 2;

  const placements: { x: number; y: number }[] = [];
  for (let r = 0; r < layout.rows && placements.length < copies; r++) {
    for (let c = 0; c < layout.cols && placements.length < copies; c++) {
      placements.push({ x: startX + c * (pw + gapMm), y: startY + r * (ph + gapMm) });
    }
  }
  return { layout, placements };
}

/** Build a printable PDF; returns a Blob ready to download. */
export async function generatePrintSheet(
  opts: PrintSheetOptions
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const { canvas, photoMm, paperSize = "4x6", marginMm = 4, gapMm = 3 } = opts;
  const { layout, placements } = sheetPlacements(photoMm, {
    paperSize,
    marginMm,
    gapMm,
    copies: opts.copies,
  });
  if (layout.capacity === 0) {
    throw new Error("Photo is too large to fit on the selected sheet size.");
  }

  const doc = new jsPDF({
    unit: "mm",
    format: [layout.sheet.w, layout.sheet.h],
    orientation: layout.orientation,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  doc.setDrawColor(180);
  doc.setLineWidth(0.1);

  for (const { x, y } of placements) {
    doc.addImage(imgData, "JPEG", x, y, photoMm.width, photoMm.height);
    doc.rect(x, y, photoMm.width, photoMm.height); // thin cut guide
  }

  return doc.output("blob");
}
