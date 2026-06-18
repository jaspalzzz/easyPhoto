import Link from "next/link";

/**
 * Shown when a PDF tool is handed a password-protected file. Lossless pdf-lib
 * tools can't decrypt it (they'd emit a broken output), so we point the user to
 * the Unlock PDF tool instead.
 */
export function EncryptedPdfNotice() {
  return (
    <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
      This PDF is password-protected, so it can&apos;t be processed here. Please
      remove the password first with the{" "}
      <Link href="/tools/unlock-pdf" className="font-medium underline">
        Unlock PDF tool
      </Link>
      , then try again.
    </p>
  );
}
