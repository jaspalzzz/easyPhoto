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
  /** Prevents a photo from being mistaken for a signature (and vice versa). */
  kind: WorkflowAssetKind;
  /** Portal preset that the asset is being prepared for, when known. */
  examId?: string;
}

export type WorkflowAssetKind = "image" | "photo" | "signature" | "pdf";
export type WorkflowImageAssetKind = Exclude<WorkflowAssetKind, "pdf">;

/** Receiver contracts shared by every workflow-aware tool. */
export const WORKFLOW_GENERIC_IMAGE_KINDS = [
  "image",
  "photo",
  "signature",
] as const satisfies readonly WorkflowImageAssetKind[];
export const WORKFLOW_PHOTO_KINDS = [
  "photo",
] as const satisfies readonly WorkflowImageAssetKind[];
export const WORKFLOW_SIGNATURE_KINDS = [
  "signature",
] as const satisfies readonly WorkflowImageAssetKind[];
export const WORKFLOW_PDF_KINDS = [
  "pdf",
] as const satisfies readonly WorkflowAssetKind[];

export interface WorkflowPayloadOptions {
  kind: WorkflowAssetKind;
  examId?: string;
  /** Keep photo/signature assets together for the Exam Application Kit. */
  rememberForExamKit?: boolean;
}

export interface ExamWorkflowDraft {
  examId?: string;
  photo?: WorkflowPayload;
  signature?: WorkflowPayload;
}

let pending: WorkflowPayload | null = null;
let examDraft: ExamWorkflowDraft | null = null;

/** Store an output blob so the next tool can auto-load it on mount. */
export function setWorkflowPayload(
  blob: Blob,
  filename: string,
  options: WorkflowPayloadOptions
): void {
  const payload: WorkflowPayload = {
    blob,
    filename,
    kind: options.kind,
    ...(options.examId ? { examId: options.examId } : {}),
  };
  pending = payload;

  if (
    options.rememberForExamKit &&
    (options.kind === "photo" || options.kind === "signature")
  ) {
    const sameExamDraft =
      !!options.examId && examDraft?.examId === options.examId ? examDraft : null;
    examDraft = {
      ...(sameExamDraft ?? {}),
      ...(options.examId ? { examId: options.examId } : {}),
      [options.kind]: payload,
    };
  }
}

/**
 * Read and clear the pending payload.
 * Consume-once: a second call returns null so accidental double-mounts
 * (React strict mode) don't load the image twice.
 */
export function consumeWorkflowPayload<
  const AcceptedKinds extends readonly WorkflowAssetKind[],
>(
  acceptedKinds: AcceptedKinds
): (WorkflowPayload & { kind: AcceptedKinds[number] }) | null {
  const p = pending;
  pending = null;
  if (!p || !acceptedKinds.includes(p.kind)) return null;
  return p as WorkflowPayload & { kind: AcceptedKinds[number] };
}

/** Clear a pending one-shot payload without offering it to a receiver. */
export function discardWorkflowPayload(): void {
  pending = null;
}

/** Read the current exam draft without clearing it between workflow steps. */
export function getExamWorkflowDraft(): ExamWorkflowDraft | null {
  return examDraft;
}

/** Clear only the longer-lived exam bundle; generic consume-once handoffs remain intact. */
export function clearExamWorkflowDraft(): void {
  examDraft = null;
}
