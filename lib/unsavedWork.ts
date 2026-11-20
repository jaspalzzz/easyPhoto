/**
 * Work that lives only in this document's memory: a file being handed to the
 * next tool, the Exam Kit's photo and signature, a photo loaded in a maker.
 * Loading a fresh document would lose it, so the code that owns such work
 * registers a check here and lib/isolationBoundary.ts asks before it lets a
 * link replace the document.
 *
 * Kept free of imports on purpose: the tool store and the hand-off module
 * register here, and they must not pull the ad and isolation path lists into
 * every page that uses them.
 */
type WorkCheck = () => boolean;

const workChecks = new Set<WorkCheck>();

/** While `check` returns true, links keep the document. Returns the unregister. */
export function keepDocumentWhile(check: WorkCheck): () => void {
  workChecks.add(check);
  return () => {
    workChecks.delete(check);
  };
}

export function holdsUnsavedWork(): boolean {
  for (const check of workChecks) {
    if (check()) return true;
  }
  return false;
}
