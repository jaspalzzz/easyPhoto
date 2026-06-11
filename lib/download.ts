/**
 * Trigger a browser download for an in-memory Blob. No server round-trip.
 *
 * Also dispatches an "ep:download" CustomEvent so the global DownloadToast
 * (mounted in the layout) can confirm the save — downloads are otherwise
 * silent, and on mobile users genuinely can't tell whether they worked.
 */
export function downloadBlob(blob: Blob, filename: string): void {
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
}
