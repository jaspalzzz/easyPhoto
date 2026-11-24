/**
 * Shown when a PDF tool is handed an encrypted file: password-protected, or
 * owner-restricted (opens freely but blocks printing/copying). Lossless pdf-lib
 * tools can't decrypt either (they'd emit a broken output), so the visitor is
 * asked for a copy without them. The password remover this used to link was
 * retired on 24 Nov 2026.
 */
export function EncryptedPdfNotice() {
  return (
    <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
      This PDF is password-protected or has editing restrictions, so it can&apos;t
      be processed here. Use a copy without a password or restrictions, then try
      again.
    </p>
  );
}
