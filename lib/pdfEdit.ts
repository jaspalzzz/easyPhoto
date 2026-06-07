/**
 * Lossless PDF editing — reorder/rotate/delete pages and overlay signatures —
 * client-side via pdf-lib. Original page content (text, vectors, fonts) is
 * preserved; we never rasterize. Nothing is uploaded.
 */

/** One output page: which original page it is, and any user rotation to apply. */
export interface ReorderItem {
  originalIndex: number; // 0-based index in the source PDF
  rotation?: number; // additional clockwise rotation in degrees (0/90/180/270)
}

/**
 * Rebuild a PDF from `items` (new order), applying each item's rotation on top
 * of the page's existing rotation. Deleted pages are simply omitted from items.
 */
export async function reorderPdf(
  file: File,
  items: ReorderItem[]
): Promise<Blob> {
  if (items.length === 0) throw new Error("No pages to export.");
  const { PDFDocument, degrees } = await import("pdf-lib");

  const src = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
  });
  const total = src.getPageCount();
  const order = items.filter((it) => it.originalIndex >= 0 && it.originalIndex < total);
  if (order.length === 0) throw new Error("Selected pages are out of range.");

  const out = await PDFDocument.create();
  const copied = await out.copyPages(
    src,
    order.map((it) => it.originalIndex)
  );
  copied.forEach((page, i) => {
    const extra = ((order[i].rotation ?? 0) % 360 + 360) % 360;
    if (extra !== 0) {
      const existing = page.getRotation().angle || 0;
      page.setRotation(degrees((existing + extra) % 360));
    }
    out.addPage(page);
  });

  const bytes = await out.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

/** A signature placed on a page, in PERCENT of the displayed page box. */
export interface SignaturePlacement {
  /** PNG data URL of the (transparent) signature. */
  signatureUrl: string;
  /** Left/top as % of page width/height; width/height as % of page w/h. */
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Overlay signatures onto the ORIGINAL PDF pages (text preserved). Placements
 * are keyed by 0-based page index. Coordinates are percentages of the page box,
 * matching the on-screen overlay (top-left origin); we convert to pdf-lib's
 * bottom-left origin per page.
 */
export async function signPdf(
  file: File,
  signaturesPerPage: Record<number, SignaturePlacement[]>
): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const src = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
  });
  const pages = src.getPages();

  // Embed each distinct signature image once. Decode the data: URL directly
  // (atob) rather than fetch() — our CSP connect-src has no `data:`, so a
  // fetch(dataUrl) would be blocked in production.
  const cache = new Map<string, Awaited<ReturnType<typeof src.embedPng>>>();
  const embed = async (dataUrl: string) => {
    const cached = cache.get(dataUrl);
    if (cached) return cached;
    const base64 = dataUrl.split(",")[1] ?? "";
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const img = await src.embedPng(bytes);
    cache.set(dataUrl, img);
    return img;
  };

  for (const [idxStr, placements] of Object.entries(signaturesPerPage)) {
    const page = pages[Number(idxStr)];
    if (!page || !placements?.length) continue;
    const { width: pw, height: ph } = page.getSize();
    for (const p of placements) {
      const img = await embed(p.signatureUrl);
      const w = (p.width / 100) * pw;
      const h = (p.height / 100) * ph;
      const x = (p.x / 100) * pw;
      const yTop = (p.y / 100) * ph;
      const y = ph - yTop - h; // convert top-left → bottom-left origin
      page.drawImage(img, { x, y, width: w, height: h });
    }
  }

  const bytes = await src.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
