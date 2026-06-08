/**
 * Reject a promise if it doesn't settle within `ms`. Used to bound long-running
 * on-device ML jobs (segmentation, detection) so a weak device can't leave a
 * tool spinning forever — the UI surfaces an error instead of hanging.
 *
 * Note: this rejects the wrapper, letting the UI recover; it cannot truly cancel
 * the underlying WASM/GPU work, which finishes and is then garbage-collected.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = "This is taking too long. Please try again with a smaller image."
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}
