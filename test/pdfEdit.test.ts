import { describe, it, expect, vi } from "vitest";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { mergePdfs, splitPdf } from "@/lib/pdfMergeSplit";
import { placementToPdfRect, reorderPdf, signPdf } from "@/lib/pdfEdit";
import { addPageNumbers, watermarkPdf } from "@/lib/pdfAnnotate";
import { assertPdfDecryptable, PdfEncryptedError } from "@/lib/pdfToImages";
import { getDocument } from "pdfjs-dist";

// pdfjs-dist tries to set up a Web Worker via an http: URL which Node's ESM
// loader rejects. The PDF tools under test (mergePdfs, splitPdf, reorderPdf,
// signPdf) use pdf-lib — not pdfjs — for all mutations. pdfjs is only called
// by assertPdfDecryptable to detect password-protection; our test PDFs are
// unencrypted, so we can stub pdfjs to skip the worker entirely.
vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      destroy: vi.fn(() => Promise.resolve()),
      getPage: async () => ({
        getViewport: () => ({ width: 100, height: 100, scale: 1 }),
        render: () => ({ promise: Promise.resolve() }),
      }),
    }),
  })),
}));

// jsdom's Blob/File lack arrayBuffer() (real browsers have it since 2020).
// Polyfill so the lib's `file.arrayBuffer()` works under test.
if (typeof Blob !== "undefined" && !Blob.prototype.arrayBuffer) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Blob.prototype as any).arrayBuffer = function (this: Blob) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as ArrayBuffer);
      fr.onerror = () => reject(fr.error);
      fr.readAsArrayBuffer(this);
    });
  };
}

/** Build a small vector PDF (one line of text per page) as a File. */
async function makePdfFile(texts: string[], name = "doc.pdf"): Promise<File> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (const t of texts) {
    const page = doc.addPage([300, 400]);
    page.drawText(t, { x: 40, y: 350, size: 18, font, color: rgb(0, 0, 0) });
  }
  const bytes = await doc.save();
  return new File([bytes as BlobPart], name, { type: "application/pdf" });
}

async function pageCount(blob: Blob): Promise<number> {
  const doc = await PDFDocument.load(new Uint8Array(await blob.arrayBuffer()));
  return doc.getPageCount();
}

async function isPdf(blob: Blob): Promise<boolean> {
  const head = new TextDecoder().decode(
    new Uint8Array(await blob.slice(0, 5).arrayBuffer())
  );
  return head.startsWith("%PDF");
}

// 1x1 transparent PNG.
const PNG_1x1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

describe("PDF tools — lossless via pdf-lib", () => {
  it("rejects password-protected PDFs before pdf-lib can emit broken output", async () => {
    vi.mocked(getDocument).mockImplementationOnce(() => ({
      promise: new Promise((_, reject) => {
        queueMicrotask(() => reject({ name: "PasswordException" }));
      }),
    }) as ReturnType<typeof getDocument>);

    const file = new File(["%PDF-1.7"], "locked.pdf", { type: "application/pdf" });

    await expect(assertPdfDecryptable(file)).rejects.toBeInstanceOf(PdfEncryptedError);
  });

  it("does not probe with pdf-lib's own load — would reject owner-only encrypted PDFs it can't distinguish from user-password ones", async () => {
    // Regression guard: assertPdfDecryptable must reject ONLY on a pdfjs
    // PasswordException (mocked above to succeed by default, simulating a PDF
    // pdfjs can open — including an owner-only encrypted one, since pdfjs only
    // raises PasswordException when an *open* password is required).
    //
    // It must NOT additionally call pdf-lib's PDFDocument.load with
    // ignoreEncryption:false as a second check: pdf-lib flags a PDF as
    // "encrypted" purely from the presence of a trailer /Encrypt dictionary
    // (PDFDocument.js: `isEncrypted = !!context.lookup(Encrypt)`), with zero
    // concept of owner-only vs user-password encryption. A second check there
    // would reject every owner-only-encrypted PDF too (print/copy-restricted
    // but openable with no password — common for government/bank forms), even
    // though pdfjs opens it fine. Asserting the spy was never called catches a
    // reintroduction of that second check even with a garbage/unparsable test
    // fixture (which wouldn't otherwise trip pdf-lib's real encryption check).
    const loadSpy = vi.spyOn(PDFDocument, "load");
    const file = new File(["%PDF-1.7"], "owner-encrypted.pdf", { type: "application/pdf" });

    await expect(assertPdfDecryptable(file)).resolves.toBeUndefined();
    expect(loadSpy).not.toHaveBeenCalled();

    loadSpy.mockRestore();
  });

  it("signPdf rejects password-protected PDFs before export", async () => {
    vi.mocked(getDocument).mockImplementationOnce(() => ({
      promise: new Promise((_, reject) => {
        queueMicrotask(() => reject({ name: "PasswordException" }));
      }),
    }) as ReturnType<typeof getDocument>);

    const file = new File(["%PDF-1.7"], "locked.pdf", { type: "application/pdf" });

    await expect(signPdf(file, {})).rejects.toBeInstanceOf(PdfEncryptedError);
  });

  it("reorderPdf rejects password-protected PDFs before export", async () => {
    vi.mocked(getDocument).mockImplementationOnce(() => ({
      promise: new Promise((_, reject) => {
        queueMicrotask(() => reject({ name: "PasswordException" }));
      }),
    }) as ReturnType<typeof getDocument>);

    const file = new File(["%PDF-1.7"], "locked.pdf", { type: "application/pdf" });

    await expect(reorderPdf(file, [{ originalIndex: 0, rotation: 90 }])).rejects.toBeInstanceOf(PdfEncryptedError);
  });

  it("splitPdf rejects password-protected PDFs before export", async () => {
    vi.mocked(getDocument).mockImplementationOnce(() => ({
      promise: new Promise((_, reject) => {
        queueMicrotask(() => reject({ name: "PasswordException" }));
      }),
    }) as ReturnType<typeof getDocument>);

    const file = new File(["%PDF-1.7"], "locked.pdf", { type: "application/pdf" });

    await expect(splitPdf(file, [0])).rejects.toBeInstanceOf(PdfEncryptedError);
  });

  it("watermarkPdf rejects password-protected PDFs before export", async () => {
    vi.mocked(getDocument).mockImplementationOnce(() => ({
      promise: new Promise((_, reject) => {
        queueMicrotask(() => reject({ name: "PasswordException" }));
      }),
    }) as ReturnType<typeof getDocument>);

    const file = new File(["%PDF-1.7"], "locked.pdf", { type: "application/pdf" });

    await expect(watermarkPdf(file, { text: "DRAFT" })).rejects.toBeInstanceOf(PdfEncryptedError);
  });

  it("addPageNumbers rejects password-protected PDFs before export", async () => {
    vi.mocked(getDocument).mockImplementationOnce(() => ({
      promise: new Promise((_, reject) => {
        queueMicrotask(() => reject({ name: "PasswordException" }));
      }),
    }) as ReturnType<typeof getDocument>);

    const file = new File(["%PDF-1.7"], "locked.pdf", { type: "application/pdf" });

    await expect(addPageNumbers(file)).rejects.toBeInstanceOf(PdfEncryptedError);
  });

  it("merge keeps total page count and stays vector (small, not rasterized)", async () => {
    const out = await mergePdfs([
      await makePdfFile(["A1", "A2"]),
      await makePdfFile(["B1"]),
    ]);
    expect(await isPdf(out)).toBe(true);
    expect(await pageCount(out)).toBe(3);
    expect(out.size).toBeLessThan(50_000); // a rasterized merge would be far larger
  });

  it("split extracts the selected 0-indexed pages", async () => {
    const out = await splitPdf(await makePdfFile(["P1", "P2", "P3", "P4"]), [0, 2]);
    expect(await pageCount(out)).toBe(2);
    expect(out.size).toBeLessThan(50_000);
  });

  it("reorder reorders and applies rotation losslessly", async () => {
    const out = await reorderPdf(await makePdfFile(["P1", "P2", "P3"]), [
      { originalIndex: 2 },
      { originalIndex: 0, rotation: 90 },
      { originalIndex: 1 },
    ]);
    expect(await pageCount(out)).toBe(3);
    const doc = await PDFDocument.load(new Uint8Array(await out.arrayBuffer()));
    expect(doc.getPages()[1].getRotation().angle).toBe(90); // moved page 0 rotated
  });

  it("sign overlays a signature without rasterizing the document", async () => {
    const out = await signPdf(await makePdfFile(["DOC1", "DOC2"]), {
      0: [{ signatureUrl: PNG_1x1, x: 30, y: 40, width: 30, height: 10 }],
    });
    expect(await isPdf(out)).toBe(true);
    expect(await pageCount(out)).toBe(2); // page count unchanged
    expect(out.size).toBeLessThan(50_000); // still vector
  });
});

/**
 * An owner-only encrypted PDF (print/copy restricted, opens without a password)
 * passes the pdfjs check, but pdf-lib can't decrypt its streams — edits used to
 * produce blank pages or an unopenable file. Simulated with a trailer /Encrypt
 * dictionary, which is exactly what pdf-lib keys `isEncrypted` off.
 */
async function makeRestrictedPdfFile(): Promise<File> {
  const doc = await PDFDocument.create();
  doc.addPage([300, 400]);
  doc.context.trailerInfo.Encrypt = doc.context.obj({ Filter: "Standard", V: 2, R: 3, P: -3904 });
  const bytes = await doc.save({ useObjectStreams: false });
  return new File([bytes as BlobPart], "restricted.pdf", { type: "application/pdf" });
}

describe("owner-only encrypted (restricted) PDFs", () => {
  it.each([
    ["mergePdfs", async (f: File) => mergePdfs([f])],
    ["splitPdf", async (f: File) => splitPdf(f, [0])],
    ["reorderPdf", async (f: File) => reorderPdf(f, [{ originalIndex: 0 }])],
    ["signPdf", async (f: File) => signPdf(f, {})],
    ["watermarkPdf", async (f: File) => watermarkPdf(f, { text: "COPY" })],
    ["addPageNumbers", async (f: File) => addPageNumbers(f)],
  ])("%s routes them to Unlock PDF instead of emitting a broken file", async (_name, run) => {
    await expect(run(await makeRestrictedPdfFile())).rejects.toBeInstanceOf(PdfEncryptedError);
  });
});

/**
 * Where a placed image ends up ON SCREEN: take the drawn image's corners in
 * PDF user space (pdf-lib rotates ccw about the anchor), then apply the
 * viewer's /Rotate (clockwise) to get top-left-origin display coordinates.
 */
function displayedBox(rect: ReturnType<typeof placementToPdfRect>, W: number, H: number, r: number) {
  const rad = (rect.rotate * Math.PI) / 180;
  const cos = Math.round(Math.cos(rad));
  const sin = Math.round(Math.sin(rad));
  const local = [[0, 0], [rect.width, 0], [0, rect.height], [rect.width, rect.height]];
  const toDisplay = (x: number, y: number) =>
    r === 90 ? [y, x] : r === 180 ? [W - x, y] : r === 270 ? [H - y, W - x] : [x, H - y];
  const pts = local.map(([lx, ly]) => {
    const x = rect.x + lx * cos - ly * sin;
    const y = rect.y + lx * sin + ly * cos;
    return toDisplay(x, y);
  });
  const us = pts.map((p) => p[0]!);
  const vs = pts.map((p) => p[1]!);
  // The image's top edge (local y = height) must be the top on screen.
  const topMid = toDisplay(
    rect.x + (rect.width / 2) * cos - rect.height * sin,
    rect.y + (rect.width / 2) * sin + rect.height * cos,
  );
  return { u: Math.min(...us), v: Math.min(...vs), w: Math.max(...us) - Math.min(...us), h: Math.max(...vs) - Math.min(...vs), topV: topMid[1]! };
}

describe("placementToPdfRect", () => {
  const W = 300; // unrotated page size
  const H = 400;
  const placement = { x: 70, y: 80, width: 20, height: 10 }; // % of the displayed page

  it.each([0, 90, 180, 270])("lands exactly where it was placed on a page rotated %i°", (r) => {
    const rect = placementToPdfRect(placement, W, H, r);
    const quarter = r === 90 || r === 270;
    const dispW = quarter ? H : W;
    const dispH = quarter ? W : H;
    const box = displayedBox(rect, W, H, r);
    expect(box.u).toBeCloseTo(0.7 * dispW, 6);
    expect(box.v).toBeCloseTo(0.8 * dispH, 6);
    expect(box.w).toBeCloseTo(0.2 * dispW, 6);
    expect(box.h).toBeCloseTo(0.1 * dispH, 6);
    expect(box.topV).toBeCloseTo(box.v, 6); // upright, not sideways/upside-down
  });

  it("normalises negative and >360 rotations", () => {
    expect(placementToPdfRect(placement, W, H, -90)).toEqual(placementToPdfRect(placement, W, H, 270));
    expect(placementToPdfRect(placement, W, H, 450)).toEqual(placementToPdfRect(placement, W, H, 90));
  });
});
