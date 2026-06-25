import { describe, it, expect, vi } from "vitest";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { mergePdfs, splitPdf } from "@/lib/pdfMergeSplit";
import { reorderPdf, signPdf } from "@/lib/pdfEdit";

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
