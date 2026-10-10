/**
 * Fillable-PDF (AcroForm) helpers behind the Form Fill tool: list the fields a
 * user can type into, then fill and flatten them.
 *
 * Owner-restricted PDFs (they open without a password but carry an /Encrypt
 * dictionary — common for government and bank forms) can't go through pdf-lib,
 * which cannot decrypt: field names come back as ciphertext. Those are read and
 * filled through pdfjs instead, which decrypts them and saves the values as an
 * incremental update. That copy keeps the issuer's encryption and restrictions,
 * so it can't be flattened; its fields stay editable. Sending these PDFs to
 * Unlock PDF instead is a dead end: it re-renders pages as images, which drops
 * every form field.
 *
 * The issuer's permissions are respected: a restricted PDF is only filled when
 * they allow form filling, otherwise PdfFillNotAllowedError is thrown.
 *
 * Password-protected PDFs (need a password to open) still throw
 * PdfEncryptedError — from this module, that error only ever means a password.
 */
import { assertPdfDecryptable, loadPdfForEditing, PdfEncryptedError } from "@/lib/pdfToImages";

/** The PDF's issuer doesn't permit filling its form (owner-restricted PDFs only). */
export class PdfFillNotAllowedError extends Error {
  constructor() {
    super("This PDF's permissions don't allow filling its form.");
    this.name = "PdfFillNotAllowedError";
  }
}

export type FieldKind = "Text" | "CheckBox" | "Dropdown" | "RadioGroup" | "Other";

export interface FormField {
  name: string;
  type: FieldKind;
  value: string;
  /** Choices for dropdown / radio fields. */
  options?: string[];
}

/**
 * Field kind via `instanceof` against pdf-lib's own classes. Never compare
 * `constructor.name`: the production build minifies class names (they become
 * "e"), so name checks matched nothing and every export came back empty.
 */
export async function fieldKind(f: import("pdf-lib").PDFField): Promise<FieldKind> {
  const lib = await import("pdf-lib");
  if (f instanceof lib.PDFTextField) return "Text";
  if (f instanceof lib.PDFCheckBox) return "CheckBox";
  if (f instanceof lib.PDFDropdown) return "Dropdown";
  if (f instanceof lib.PDFRadioGroup) return "RadioGroup";
  return "Other";
}

export interface FillResult {
  blob: Blob;
  /** Names of fields that could not be filled. */
  failed: string[];
  /** False for an owner-restricted PDF: its fields stay editable (see module comment). */
  flattened: boolean;
}

/**
 * pdf-lib document for an unrestricted PDF, or null for an owner-restricted
 * one. Throws PdfEncryptedError when the PDF needs a password to open.
 */
async function loadUnrestricted(file: File): Promise<import("pdf-lib").PDFDocument | null> {
  await assertPdfDecryptable(file);
  try {
    return await loadPdfForEditing(file);
  } catch (err) {
    if (err instanceof PdfEncryptedError) return null; // decryptable by pdfjs, so owner-restricted
    throw err;
  }
}

/** One widget of a field, as pdfjs's getFieldObjects() reports it (only what we use). */
interface PdfjsWidget {
  id: string;
  type: string;
  /** On-state of a checkbox / radio widget. */
  exportValues?: string;
  /** Choices of a combo box. */
  items?: { exportValue: string; displayValue: string }[];
  /** Max length of a text field (0 = none). */
  charLimit?: number;
}

const PDFJS_KIND: Record<string, FieldKind> = {
  text: "Text",
  checkbox: "CheckBox",
  combobox: "Dropdown",
  radiobutton: "RadioGroup",
};

/**
 * Open the PDF with pdfjs (which decrypts owner-restricted files) and hand its
 * fields to `withFields`. Throws PdfFillNotAllowedError unless the permissions
 * allow form filling — PDF 32000-1 Table 22: bit 9 "fill in form fields", or
 * bit 6 "modify annotations, fill in form fields" (null = no restrictions).
 */
async function withPdfjsFields<T>(
  file: File,
  withFields: (
    doc: import("pdfjs-dist").PDFDocumentProxy,
    fields: Map<string, { kind: FieldKind; widgets: PdfjsWidget[] }>
  ) => Promise<T>
): Promise<T> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  try {
    const permissions = await doc.getPermissions();
    const { FILL_INTERACTIVE_FORMS, MODIFY_ANNOTATIONS } = pdfjs.PermissionFlag;
    if (permissions && !permissions.some((p) => p === FILL_INTERACTIVE_FORMS || p === MODIFY_ANNOTATIONS)) {
      throw new PdfFillNotAllowedError();
    }
    const fields = new Map<string, { kind: FieldKind; widgets: PdfjsWidget[] }>();
    const objects = ((await doc.getFieldObjects()) ?? {}) as Record<string, PdfjsWidget[]>;
    for (const [name, all] of Object.entries(objects)) {
      // Entries without a known type are parent nodes, buttons, signatures or list boxes.
      const widgets = all.filter((w) => w.type in PDFJS_KIND);
      if (widgets.length) fields.set(name, { kind: PDFJS_KIND[widgets[0].type], widgets });
    }
    return await withFields(doc, fields);
  } finally {
    await doc.destroy();
  }
}

function pdfjsOptions(kind: FieldKind, widgets: PdfjsWidget[]): string[] | undefined {
  if (kind === "Dropdown") return (widgets[0].items ?? []).map((i) => i.exportValue);
  if (kind === "RadioGroup") return [...new Set(widgets.map((w) => w.exportValues ?? ""))];
  return undefined;
}

export async function loadPdfFormFields(file: File): Promise<FormField[]> {
  const pdf = await loadUnrestricted(file);
  if (!pdf) {
    return withPdfjsFields(file, async (_doc, fields) =>
      [...fields].map(([name, { kind, widgets }]) => {
        const options = pdfjsOptions(kind, widgets);
        return { name, type: kind, value: "", ...(options ? { options } : {}) };
      })
    );
  }
  const lib = await import("pdf-lib");
  const fields: FormField[] = [];
  for (const f of pdf.getForm().getFields()) {
    const type = await fieldKind(f);
    if (type === "Other") continue; // buttons / signature fields can't be typed into
    const options =
      f instanceof lib.PDFDropdown || f instanceof lib.PDFRadioGroup ? f.getOptions() : undefined;
    fields.push({ name: f.getName(), type, value: "", ...(options ? { options } : {}) });
  }
  return fields;
}

/** Fill an owner-restricted PDF through pdfjs; the values are saved, nothing is flattened. */
async function fillRestricted(file: File, values: FormField[]): Promise<FillResult> {
  return withPdfjsFields(file, async (doc, fields) => {
    const failed: string[] = [];
    let filled = 0;
    for (const field of values) {
      if (!field.value) continue;
      const found = fields.get(field.name);
      if (!found) {
        failed.push(field.name);
        continue;
      }
      const { kind, widgets } = found;
      const options = pdfjsOptions(kind, widgets);
      const limit = widgets[0].charLimit ?? 0;
      // Same rejections pdf-lib makes on the unrestricted path.
      if ((options && !options.includes(field.value)) || (kind === "Text" && limit > 0 && field.value.length > limit)) {
        failed.push(field.name);
        continue;
      }
      for (const w of widgets) {
        const value =
          kind === "CheckBox" ? field.value === "true"
          : kind === "RadioGroup" ? w.exportValues === field.value
          : field.value;
        doc.annotationStorage.setValue(w.id, { value });
      }
      filled++;
    }
    if (filled === 0) throw new Error("No fields could be filled.");

    const out = await doc.saveDocument();
    return { blob: new Blob([out as BlobPart], { type: "application/pdf" }), failed, flattened: false };
  });
}

/** Fill the form; returns the PDF plus the names of any fields that failed. */
export async function fillAndExport(file: File, fields: FormField[]): Promise<FillResult> {
  const pdf = await loadUnrestricted(file);
  if (!pdf) return fillRestricted(file, fields);
  const lib = await import("pdf-lib");
  const form = pdf.getForm();

  const failed: string[] = [];
  let filled = 0;
  for (const field of fields) {
    if (!field.value) continue;
    try {
      const f = form.getField(field.name);
      if (f instanceof lib.PDFTextField) {
        f.setText(field.value);
      } else if (f instanceof lib.PDFCheckBox) {
        if (field.value === "true") f.check();
        else f.uncheck();
      } else if (f instanceof lib.PDFDropdown) {
        f.select(field.value);
      } else if (f instanceof lib.PDFRadioGroup) {
        f.select(field.value);
      } else {
        failed.push(field.name);
        continue;
      }
      filled++;
    } catch {
      // e.g. text longer than a comb field's max length
      failed.push(field.name);
    }
  }
  if (filled === 0) throw new Error("No fields could be filled.");

  form.flatten();
  const out = await pdf.save();
  return { blob: new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }), failed, flattened: true };
}
