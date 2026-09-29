import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  PDFButton,
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFField,
  PDFForm,
  PDFRadioGroup,
  PDFTextField,
} from "pdf-lib";
import { fillAndExport, loadPdfFormFields, type FormField } from "@/lib/formFill";

// pdfjs is only used to detect password protection; these PDFs are unencrypted,
// so stub it to avoid its Web Worker (same approach as test/pdfEdit.test.ts).
vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({ numPages: 1, destroy: vi.fn(() => Promise.resolve()) }),
  })),
}));

// jsdom's Blob/File lack arrayBuffer(); real browsers have it.
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

/** A one-page AcroForm with one field of every kind the tool supports, plus a button it must skip. */
async function makeFormPdf(): Promise<File> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const form = pdf.getForm();
  form.createTextField("full_name").addToPage(page, { x: 50, y: 750, width: 300, height: 24 });
  const state = form.createDropdown("state");
  state.addOptions(["Delhi", "Punjab", "Kerala"]);
  state.addToPage(page, { x: 50, y: 700, width: 200, height: 24 });
  const gender = form.createRadioGroup("gender");
  gender.addOptionToPage("Male", page, { x: 50, y: 650, width: 16, height: 16 });
  gender.addOptionToPage("Female", page, { x: 100, y: 650, width: 16, height: 16 });
  form.createCheckBox("agree").addToPage(page, { x: 50, y: 600, width: 16, height: 16 });
  form.createButton("submit").addToPage("Submit", page, { x: 50, y: 550, width: 80, height: 24 });
  return new File([(await pdf.save()) as BlobPart], "form.pdf", { type: "application/pdf" });
}

const withValues = (fields: FormField[], values: Record<string, string>): FormField[] =>
  fields.map((f) => ({ ...f, value: values[f.name] ?? "" }));

/**
 * The production bug: the minifier renamed pdf-lib's classes (constructor.name
 * became "e"), so name-based type checks matched nothing and every exported
 * form came back empty. Reproduce that for the whole file, so a regression to
 * `constructor.name` fails here instead of only after deploy.
 */
const MINIFIED = [PDFField, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup, PDFButton];
const originalNames = MINIFIED.map((c) => c.name);
beforeAll(() => MINIFIED.forEach((c) => Object.defineProperty(c, "name", { value: "e", configurable: true })));
afterAll(() => MINIFIED.forEach((c, i) => Object.defineProperty(c, "name", { value: originalNames[i], configurable: true })));

describe("form fill with minified class names (production build)", () => {
  it("simulates minification", () => {
    expect(PDFTextField.name).toBe("e");
  });

  it("detects every fillable field kind and skips buttons", async () => {
    const fields = await loadPdfFormFields(await makeFormPdf());
    expect(fields).toEqual([
      { name: "full_name", type: "Text", value: "" },
      { name: "state", type: "Dropdown", value: "", options: ["Delhi", "Punjab", "Kerala"] },
      { name: "gender", type: "RadioGroup", value: "", options: ["Male", "Female"] },
      { name: "agree", type: "CheckBox", value: "" },
    ]);
  });

  it("writes every value into the form before flattening it", async () => {
    const file = await makeFormPdf();
    const fields = withValues(await loadPdfFormFields(file), {
      full_name: "JASPAL KUMAR",
      state: "Punjab",
      gender: "Female",
      agree: "true",
    });

    // Read the form state at the moment it is flattened: after that the
    // values only exist as drawn text, which pdf-lib cannot read back.
    let atFlatten: Record<string, unknown> | null = null;
    const realFlatten = PDFForm.prototype.flatten;
    const spy = vi.spyOn(PDFForm.prototype, "flatten").mockImplementation(function (this: PDFForm, ...args) {
      atFlatten = {
        full_name: this.getTextField("full_name").getText(),
        state: this.getDropdown("state").getSelected(),
        gender: this.getRadioGroup("gender").getSelected(),
        agree: this.getCheckBox("agree").isChecked(),
      };
      return realFlatten.apply(this, args);
    });

    try {
      const { blob, failed } = await fillAndExport(file, fields);
      expect(failed).toEqual([]);
      expect(atFlatten).toEqual({ full_name: "JASPAL KUMAR", state: ["Punjab"], gender: "Female", agree: true });

      const out = await PDFDocument.load(await blob.arrayBuffer());
      expect(out.getPageCount()).toBe(1);
      expect(out.getForm().getFields()).toHaveLength(0); // flattened, as the tool promises
    } finally {
      spy.mockRestore();
    }
  });

  it("reports a field it could not fill instead of silently dropping it", async () => {
    const file = await makeFormPdf();
    const fields = withValues(await loadPdfFormFields(file), { full_name: "JASPAL KUMAR", gender: "Other" });
    const { failed } = await fillAndExport(file, fields);
    expect(failed).toEqual(["gender"]);
  });

  it("refuses to export when nothing could be filled", async () => {
    const file = await makeFormPdf();
    const fields = withValues(await loadPdfFormFields(file), { gender: "Other" });
    await expect(fillAndExport(file, fields)).rejects.toThrow("No fields could be filled.");
  });
});
