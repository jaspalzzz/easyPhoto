import { beforeEach, describe, expect, it } from "vitest";
import { examPhotoNextAction } from "@/lib/examWorkflow";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import {
  clearExamWorkflowDraft,
  consumeWorkflowPayload,
  getExamWorkflowDraft,
  setWorkflowPayload,
} from "@/lib/workflowHandoff";

beforeEach(() => {
  clearExamWorkflowDraft();
  consumeWorkflowPayload();
});

describe("typed workflow handoff", () => {
  it("keeps the legacy consume-once handoff working", () => {
    const blob = new Blob(["image"], { type: "image/jpeg" });
    setWorkflowPayload(blob, "photo.jpg");

    expect(consumeWorkflowPayload()).toMatchObject({ blob, filename: "photo.jpg" });
    expect(consumeWorkflowPayload()).toBeNull();
  });

  it("retains separate photo and signature slots for one exam", () => {
    const photo = new Blob(["photo"], { type: "image/jpeg" });
    const signature = new Blob(["signature"], { type: "image/png" });

    setWorkflowPayload(photo, "photo.jpg", {
      kind: "photo",
      examId: "ibps",
      rememberForExamKit: true,
    });
    setWorkflowPayload(signature, "signature.png", {
      kind: "signature",
      examId: "ibps",
      rememberForExamKit: true,
    });

    expect(getExamWorkflowDraft()).toEqual({
      examId: "ibps",
      photo: expect.objectContaining({ blob: photo, kind: "photo" }),
      signature: expect.objectContaining({ blob: signature, kind: "signature" }),
    });
  });

  it("does not mix assets from different exams or an unrelated generic flow", () => {
    setWorkflowPayload(new Blob(["old-photo"]), "old.jpg", {
      kind: "photo",
      examId: "ibps",
      rememberForExamKit: true,
    });
    setWorkflowPayload(new Blob(["new-signature"]), "new.png", {
      kind: "signature",
      examId: "tnpsc",
      rememberForExamKit: true,
    });
    expect(getExamWorkflowDraft()).toMatchObject({
      examId: "tnpsc",
      signature: { filename: "new.png" },
    });
    expect(getExamWorkflowDraft()?.photo).toBeUndefined();

    setWorkflowPayload(new Blob(["generic"]), "generic.png", {
      kind: "signature",
      rememberForExamKit: true,
    });
    expect(getExamWorkflowDraft()).toEqual({
      signature: expect.objectContaining({ filename: "generic.png" }),
    });
  });
});

describe("registry-aware photo next steps", () => {
  const actionFor = (id: string) => {
    const spec = PORTAL_PRESETS[id];
    return examPhotoNextAction({
      examId: id,
      hasSignature: spec.sigLimitKb !== undefined,
      requiresNameDate: spec.requiresNameDate === true,
      requiresSlateNameDate: spec.requiresSlateNameDate === true,
    });
  };

  it("routes a verified digital-strip exam to the name/date tool", () => {
    expect(actionFor("tnpsc").slug).toBe("photo-with-name-date");
  });

  it("never routes a physical-slate workflow to the digital strip tool", () => {
    expect(actionFor("airforce-agniveer").slug).toBe("exam-package");
    expect(
      examPhotoNextAction({
        examId: "synthetic-slate",
        hasSignature: true,
        requiresNameDate: true,
        requiresSlateNameDate: true,
      }).slug
    ).toBe("exam-package");
  });

  it("routes ordinary photo/signature workflows to the Exam Kit", () => {
    expect(actionFor("ibps")).toMatchObject({
      slug: "exam-package",
      label: "Prepare the signature next",
    });
    expect(actionFor("voter-id").slug).toBe("exam-package");
  });
});
