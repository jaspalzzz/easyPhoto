/**
 * The compliance checker re-checks the loaded file whenever the exam changes,
 * and each check is async (decode, then face analysis). These pin two rules:
 *
 * 1. Only the latest check may set the result — a slower, earlier check (for
 *    the previous exam or the previous file) must never overwrite a newer one.
 * 2. A signature is never checked against an exam with no signature upload;
 *    the "no separate signature upload" message stands alone, with no verdict.
 */
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const checkPhotoQuality = vi.hoisted(() => vi.fn());
vi.mock("@/lib/photoCheck", () => ({ checkPhotoQuality }));
vi.mock("@/lib/analytics", () => ({ track: vi.fn(), deviceClass: () => "desktop" }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { ComplianceCheckerTool } from "@/components/tools/ComplianceCheckerTool";
import { allPortalSpecs } from "@/lib/specRegistry";
import { discardWorkflowPayload, setWorkflowPayload } from "@/lib/workflowHandoff";
import type { PortalSpec } from "@/lib/portalPresets";
import { checkCompliance } from "@/lib/compliance";

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

const SPECS = allPortalSpecs();
const FILE_BYTES = 30 * 1024;
const BMP = { width: 200, height: 230 };
const bitmap = () => ({ ...BMP, close: vi.fn() }) as unknown as ImageBitmap;

/** The "File size" line the checker shows for this file against an exam. */
const sizeLine = (s: PortalSpec, kind: "photo" | "signature" = "photo") =>
  checkCompliance(
    { bytes: FILE_BYTES, ...BMP, type: "image/jpeg", backgroundLight: false },
    s,
    kind
  ).checks.find((c) => c.label === "File size")!.detail;

// Two exams whose size verdicts read differently, so the visible "File size"
// line tells us which exam the shown result was checked against.
const EXAM_A = SPECS[0];
const EXAM_B = SPECS.find((s) => sizeLine(s) !== sizeLine(EXAM_A))!;

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
const createImageBitmap = vi.fn();

beforeEach(() => {
  discardWorkflowPayload();
  checkPhotoQuality.mockReset();
  createImageBitmap.mockReset();
  vi.stubGlobal("createImageBitmap", createImageBitmap);
  (globalThis.HTMLCanvasElement.prototype as unknown as { getContext: unknown }).getContext =
    () => null;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  discardWorkflowPayload();
  vi.unstubAllGlobals();
});

async function mountWithHandoff(kind: "photo" | "signature", examId: string) {
  setWorkflowPayload(new Blob([new Uint8Array(FILE_BYTES)], { type: "image/jpeg" }), "x.jpg", {
    kind,
    examId,
  });
  await act(async () => root.render(<ComplianceCheckerTool />));
}

async function selectExam(id: string) {
  const select = container.querySelector<HTMLSelectElement>("#compliance-exam-select")!;
  await act(async () => {
    select.value = id;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

const flush = () => act(async () => {});

describe("ComplianceCheckerTool — only the latest check sets the result", () => {
  it("a slow decode for the previous exam does not overwrite the new exam's result", async () => {
    const first = deferred<ImageBitmap>();
    createImageBitmap.mockReturnValueOnce(first.promise).mockResolvedValueOnce(bitmap());
    checkPhotoQuality.mockResolvedValue([]);

    await mountWithHandoff("photo", EXAM_A.id);
    await selectExam(EXAM_B.id);
    await flush();
    expect(container.textContent).toContain(sizeLine(EXAM_B));

    // The earlier (exam A) check finishes last.
    first.resolve(bitmap());
    await flush();

    expect(container.textContent).toContain(sizeLine(EXAM_B));
    expect(container.textContent).not.toContain(sizeLine(EXAM_A));
    expect(container.textContent).not.toContain("Checking…");
  });

  it("slow face analysis from the previous exam does not add its checks to the new result", async () => {
    createImageBitmap.mockImplementation(async () => bitmap());
    const firstQuality = deferred<unknown[]>();
    checkPhotoQuality.mockReturnValueOnce(firstQuality.promise).mockResolvedValueOnce([]);

    await mountWithHandoff("photo", EXAM_A.id);
    await selectExam(EXAM_B.id);
    await flush();

    firstQuality.resolve([
      { label: "STALE_FACE_CHECK", status: "fail", detail: "from the previous exam" },
    ]);
    await flush();

    expect(container.textContent).toContain(sizeLine(EXAM_B));
    expect(container.textContent).not.toContain("STALE_FACE_CHECK");
    expect(container.textContent).not.toContain("Checking…");
  });
});
