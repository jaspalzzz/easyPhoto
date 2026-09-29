/**
 * Fillable-PDF (AcroForm) helpers behind the Form Fill tool: list the fields a
 * user can type into, then fill and flatten them.
 */
import { assertPdfDecryptable, loadPdfForEditing } from "@/lib/pdfToImages";

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

export async function loadPdfFormFields(file: File): Promise<FormField[]> {
  await assertPdfDecryptable(file);
  const pdf = await loadPdfForEditing(file);
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

/** Fill the form; returns the PDF plus the names of any fields that failed. */
export async function fillAndExport(file: File, fields: FormField[]): Promise<{ blob: Blob; failed: string[] }> {
  await assertPdfDecryptable(file);
  const pdf = await loadPdfForEditing(file);
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
  return { blob: new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }), failed };
}
