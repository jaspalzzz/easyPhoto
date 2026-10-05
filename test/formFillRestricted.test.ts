// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { fillAndExport, loadPdfFormFields, PdfFillNotAllowedError, type FormField } from "@/lib/formFill";
import { PdfEncryptedError } from "@/lib/pdfToImages";

/*
 * Encrypted fillable PDFs, through the real pdfjs (its Node build).
 *
 * Fixtures in test/fixtures/form-fill/: a one-page pdf-lib AcroForm (text
 * "full_name", dropdown "state", radio "gender", checkbox "agree", button
 * "submit"; the radio states renamed from pdf-lib's "0"/"1" + /Opt to
 * "Male"/"Female", as Acrobat and LibreOffice name them), encrypted with
 * pypdf's PdfWriter.encrypt(owner_password="owner-secret", ...):
 *   form-fill-allowed-rc4.pdf       user "", RC4-128, PRINT | FILL_FORM_FIELDS (bit 9)
 *   form-annots-allowed-aes256.pdf  user "", AES-256, PRINT | ADD_OR_MODIFY (bit 6)
 *   form-print-only-rc4.pdf         user "", RC4-128, PRINT
 *   form-password.pdf               user "1234", RC4-128, PRINT
 *
 * The bug: the restricted ones were rejected as "encrypted" and the user was
 * sent to Unlock PDF, which re-renders pages as images and drops every field.
 * Restricted PDFs are now filled — but only when the issuer's permissions
 * allow form filling.
 */

// The app loads the browser build with a bundled worker URL; in Node the
// legacy build runs its worker in-process. Our code only sets workerSrc.
vi.mock("pdfjs-dist", async () => ({
  ...(await import("pdfjs-dist/legacy/build/pdf.mjs")),
  GlobalWorkerOptions: { workerSrc: "" },
}));

const fixture = (name: string) =>
  new File([readFileSync(join(__dirname, "fixtures/form-fill", name))], name, { type: "application/pdf" });

const withValues = (fields: FormField[], values: Record<string, string>): FormField[] =>
  fields.map((f) => ({ ...f, value: values[f.name] ?? "" }));

/** Each field's saved value, read back through pdfjs. */
async function savedValues(blob: Blob) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
  try {
    const objects = (await doc.getFieldObjects()) as Record<string, { type: string; value: unknown }[]>;
    const read = (name: string) => objects[name].find((w) => w.type)?.value;
    return {
      values: {
        full_name: read("full_name"),
        state: read("state"),
        gender: read("gender"),
        agree: read("agree"),
      },
      permissions: await doc.getPermissions(),
    };
  } finally {
    await doc.destroy();
  }
}

describe.each(["form-fill-allowed-rc4.pdf", "form-annots-allowed-aes256.pdf"])(
  "owner-restricted PDF that allows form filling (%s)",
  (name) => {
    it("lists its fields by their real names", async () => {
      expect(await loadPdfFormFields(fixture(name))).toEqual([
        { name: "full_name", type: "Text", value: "" },
        { name: "state", type: "Dropdown", value: "", options: ["Delhi", "Punjab", "Kerala"] },
        { name: "gender", type: "RadioGroup", value: "", options: ["Male", "Female"] },
        { name: "agree", type: "CheckBox", value: "" },
      ]);
    });

    it("fills it, keeping the fields and the issuer's restrictions", async () => {
      const file = fixture(name);
      const fields = withValues(await loadPdfFormFields(file), {
        full_name: "JASPAL KUMAR",
        state: "Punjab",
        gender: "Female",
        agree: "true",
      });
      const { blob, failed, flattened } = await fillAndExport(file, fields);
      expect(failed).toEqual([]);
      expect(flattened).toBe(false);

      const saved = await savedValues(blob);
      expect(saved.values).toEqual({ full_name: "JASPAL KUMAR", state: "Punjab", gender: "Female", agree: "Yes" });
      expect(saved.permissions).not.toBeNull(); // still restricted, as issued
    });

    it("reports a value the field can't take instead of dropping it", async () => {
      const file = fixture(name);
      const fields = withValues(await loadPdfFormFields(file), { full_name: "JASPAL KUMAR", gender: "Other" });
      const { failed } = await fillAndExport(file, fields);
      expect(failed).toEqual(["gender"]);
    });
  }
);

describe("owner-restricted PDF that does not allow form filling", () => {
  it("lists no fields", async () => {
    await expect(loadPdfFormFields(fixture("form-print-only-rc4.pdf"))).rejects.toBeInstanceOf(PdfFillNotAllowedError);
  });

  it("refuses to fill it", async () => {
    const fields: FormField[] = [{ name: "full_name", type: "Text", value: "JASPAL KUMAR" }];
    await expect(fillAndExport(fixture("form-print-only-rc4.pdf"), fields)).rejects.toBeInstanceOf(
      PdfFillNotAllowedError
    );
  });
});

describe("password-protected fillable PDF", () => {
  it("is still refused: it can't be opened without the password", async () => {
    await expect(loadPdfFormFields(fixture("form-password.pdf"))).rejects.toBeInstanceOf(PdfEncryptedError);
  });
});
