/**
 * Cross-tool image handoff for the workflow ("next step") feature.
 *
 * When a user clicks a "Continue editing →" card in Tool A, this module
 * stores the output blob in memory and Tool B reads it on mount — no
 * file re-upload required.
 *
 * Module-level singleton: the reference persists across Next.js client-side
 * navigations within the same browser tab.  It is NOT persisted to
 * localStorage/sessionStorage because blobs can be several MB and the size
 * limits are tight (5 MB total for the entire origin).
 */

export interface WorkflowPayload {
  blob: Blob;
  /** Suggested filename for the receiving tool's file-info header. */
  filename: string;
}

let pending: WorkflowPayload | null = null;

/** Store an output blob so the next tool can auto-load it on mount. */
export function setWorkflowPayload(blob: Blob, filename: string): void {
  pending = { blob, filename };
}

/**
 * Read and clear the pending payload.
 * Consume-once: a second call returns null so accidental double-mounts
 * (React strict mode) don't load the image twice.
 */
export function consumeWorkflowPayload(): WorkflowPayload | null {
  const p = pending;
  pending = null;
  return p;
}
