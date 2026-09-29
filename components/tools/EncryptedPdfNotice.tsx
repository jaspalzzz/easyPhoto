import Link from "next/link";

/**
 * Shown when a PDF tool is handed an encrypted file — password-protected, or
 * owner-restricted (opens freely but blocks printing/copying). Lossless pdf-lib
 * tools can't decrypt either (they'd emit a broken output), so we point the
 * user to the Unlock PDF tool instead.
 */
export function EncryptedPdfNotice() {
  return (
    <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
      This PDF is password-protected or has editing restrictions, so it can&apos;t
      be processed here. Please remove them first with the{" "}
      <Link href="/tools/unlock-pdf" className="font-medium underline">
        Unlock PDF tool
      </Link>
      , then try again.
    </p>
  );
}
