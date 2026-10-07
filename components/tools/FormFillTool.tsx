"use client";

import * as React from "react";
import { FileUp, Download, ShieldCheck, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { downloadBlob } from "@/lib/download";
import { fillAndExport, loadPdfFormFields, PdfFillNotAllowedError, type FormField } from "@/lib/formFill";
import { PdfEncryptedError } from "@/lib/pdfToImages";
import { SupportInline } from "@/components/site/SupportInline";

/**
 * Form Fill only throws PdfEncryptedError for a PDF that needs a password to
 * open (owner-restricted ones are filled — see lib/formFill.ts). Don't point to
 * Unlock PDF here: it rebuilds pages as images, so the form fields are lost.
 */
const PASSWORD_PROTECTED =
  "This PDF needs a password to open, so its form can't be filled here. Open it with the password in a PDF reader and fill it there.";
const FILL_NOT_ALLOWED =
  "This PDF's issuer doesn't allow its form to be filled outside their own software, so it can't be filled here. Use the form the issuer provides, or ask them for a fillable copy.";

export function FormFillTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [fields, setFields] = React.useState<FormField[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [filling, setFilling] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  /** Set after downloading an owner-restricted PDF, which can't be flattened. */
  const [keptRestrictions, setKeptRestrictions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldIdPrefix = React.useId();

  React.useEffect(() => {
    track({ name: "tool_view", tool: "form-fill" });
  }, []);

  const pick = async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    setError(null);
    setKeptRestrictions(false);
    setFields(null);
    setFile(null);
    setLoading(true);
    try {
      const detected = await loadPdfFormFields(f);
      if (detected.length === 0) {
        setError(
          "No fillable form fields found in this PDF. This tool works with AcroForm PDFs (e.g. government application forms). Regular text PDFs cannot be filled this way."
        );
      } else {
        setFile(f);
        setFields(detected);
      }
    } catch (err) {
      if (err instanceof PdfEncryptedError) {
        setError(PASSWORD_PROTECTED);
      } else if (err instanceof PdfFillNotAllowedError) {
        setError(FILL_NOT_ALLOWED);
      } else {
        setError("Could not read this PDF. Make sure it is not corrupted.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pick(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) pick(f);
  };

  const updateField = (index: number, value: string) => {
    setFields((prev) => prev ? prev.map((f, i) => i === index ? { ...f, value } : f) : prev);
  };

  const fill = async () => {
    if (!file || !fields) return;
    setFilling(true);
    setKeptRestrictions(false);
    try {
      const { blob, failed, flattened } = await fillAndExport(file, fields);
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "-filled.pdf"));
      setKeptRestrictions(!flattened);
      setError(
        failed.length
          ? `Downloaded, but ${failed.length} field${failed.length === 1 ? "" : "s"} could not be filled: ${failed.join(", ")}. Check the value fits the field.`
          : null
      );
    } catch (err) {
      if (err instanceof PdfEncryptedError) {
        setError(PASSWORD_PROTECTED);
      } else if (err instanceof PdfFillNotAllowedError) {
        setError(FILL_NOT_ALLOWED);
      } else {
        setError("Failed to fill and export the PDF. Please try again.");
      }
    } finally {
      setFilling(false);
    }
  };

  const hasValues = fields?.some((f) => f.value.trim());

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a fillable PDF form"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-brand bg-brand-soft/20" : "border-hairline hover:border-brand/50"
        }`}
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={onInput} />
        {file ? (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <FileText className="h-8 w-8 text-brand" />
            <p className="font-medium text-ink">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · click to change</p>
          </div>
        ) : (
          <>
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-ink">Drop a fillable PDF form here</p>
              <p className="mt-1 text-sm text-muted-foreground">Works with AcroForm PDFs — government forms, applications</p>
            </div>
          </>
        )}
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Detecting form fields…
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      {keptRestrictions && (
        <p role="status" className="text-sm text-muted-foreground">
          This PDF has restrictions set by its issuer, so the filled copy keeps them and its fields stay editable.
        </p>
      )}

      {fields && fields.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-ink">
            {fields.length} form field{fields.length !== 1 ? "s" : ""} detected
          </p>

          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.name + i} className="space-y-1">
                <label htmlFor={`${fieldIdPrefix}-${i}`} className="block text-sm font-medium text-ink">
                  {field.name}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">({field.type})</span>
                </label>
                {field.options ? (
                  <select
                    id={`${fieldIdPrefix}-${i}`}
                    className="rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    value={field.value}
                    onChange={(e) => updateField(i, e.target.value)}
                  >
                    <option value="">— unset —</option>
                    {field.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : field.type === "CheckBox" ? (
                  <select
                    id={`${fieldIdPrefix}-${i}`}
                    className="rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    value={field.value}
                    onChange={(e) => updateField(i, e.target.value)}
                  >
                    <option value="">— unset —</option>
                    <option value="true">Checked</option>
                    <option value="false">Unchecked</option>
                  </select>
                ) : (
                  <input
                    id={`${fieldIdPrefix}-${i}`}
                    type="text"
                    value={field.value}
                    onChange={(e) => updateField(i, e.target.value)}
                    placeholder={`Enter ${field.name}…`}
                    className="w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                )}
              </div>
            ))}
          </div>

          <Button onClick={fill} disabled={!hasValues || filling} className="w-full">
            {filling ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Fill &amp; Download PDF
          </Button>
          <SupportInline />
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        Your form data stays on your device — nothing is uploaded or stored.
      </p>
    </div>
  );
}
