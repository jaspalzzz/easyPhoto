import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImageToolShell } from "@/components/tools/ImageToolShell";
import {
  discardWorkflowPayload,
  setWorkflowPayload,
  WORKFLOW_SIGNATURE_KINDS,
} from "@/lib/workflowHandoff";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const loadImageFromFile = vi.hoisted(() => vi.fn());
const ensureDecodable = vi.hoisted(() => vi.fn(async (file: File) => file));

vi.mock("@/lib/pipeline", () => ({ loadImageFromFile }));
vi.mock("@/lib/heic", () => ({ ensureDecodable }));

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  discardWorkflowPayload();
  loadImageFromFile.mockReset();
  ensureDecodable.mockClear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  discardWorkflowPayload();
});

describe("ImageToolShell workflow receiver", () => {
  it("does not load a photo payload into a signature-only workspace", async () => {
    setWorkflowPayload(new Blob(["photo"], { type: "image/jpeg" }), "photo.jpg", {
      kind: "photo",
    });

    await act(async () => {
      root.render(
        <ImageToolShell acceptedWorkflowKinds={WORKFLOW_SIGNATURE_KINDS}>
          {() => <p>WORKSPACE_SOURCE_READY</p>}
        </ImageToolShell>
      );
    });

    expect(ensureDecodable).not.toHaveBeenCalled();
    expect(loadImageFromFile).not.toHaveBeenCalled();
    expect(container.textContent).not.toContain("WORKSPACE_SOURCE_READY");
  });
});
