/**
 * Trigger a browser download for an in-memory Blob. No server round-trip.
 *
 * Also dispatches an "ep:download" CustomEvent so the global DownloadToast
 * (mounted in the layout) can confirm the save — downloads are otherwise
 * silent, and on mobile users genuinely can't tell whether they worked.
 */
import { track } from "@/lib/analytics";

export function downloadBlob(blob: Blob, filename: string, tool?: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the download has had a chance to start. iOS Safari routes
  // the blob through a share/preview flow that reads the URL later than
  // desktop browsers do — revoking at 1s there can yield a blank
  // "WebKitBlobResource" failure, so give it a comfortable window.
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);
  setTimeout(() => URL.revokeObjectURL(url), isIOS ? 10_000 : 1500);

  window.dispatchEvent(
    new CustomEvent("ep:download", {
      detail: { filename, bytes: blob.size },
    })
  );

  if (tool) {
    const extension = filename.split(".").pop()?.toLowerCase();
    track({ name: "download", tool, format: extension?.slice(0, 12) });
  }
}

/**
 * Share a Blob via the Web Share API (navigator.share).
 * Falls back silently (returns false) when the API or file sharing is not
 * available — callers should guard the button with `"share" in navigator`.
 */
export async function shareFile(
  blob: Blob,
  filename: string,
  title?: string
): Promise<boolean> {
  if (typeof navigator === "undefined" || !("share" in navigator)) return false;
  const file = new File([blob], filename, { type: blob.type });
  try {
    await navigator.share({ files: [file], title });
    return true;
  } catch (err) {
    // AbortError = user cancelled — not a real error.
    if (err instanceof Error && err.name === "AbortError") return false;
    // NotAllowedError or NotSupportedError = browser doesn't support file sharing.
    return false;
  }
}
