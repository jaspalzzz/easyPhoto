export interface ExamPhotoWorkflowFlags {
  examId: string;
  hasSignature: boolean;
  requiresNameDate: boolean;
  requiresSlateNameDate: boolean;
}

export interface ExamPhotoNextAction {
  slug: "photo-with-name-date" | "exam-package";
  label: string;
  hint: string;
}

/**
 * Choose only the next step supported by the selected registry flags.
 * A physical name/date slate never routes to the digital strip tool.
 */
export function examPhotoNextAction(
  flags: ExamPhotoWorkflowFlags
): ExamPhotoNextAction {
  if (!flags.requiresSlateNameDate && flags.requiresNameDate) {
    return {
      slug: "photo-with-name-date",
      label: "Add the required name & date",
      hint: "The prepared photo will carry into the registry-backed strip tool",
    };
  }

  if (flags.hasSignature) {
    return {
      slug: "exam-package",
      label: "Prepare the signature next",
      hint: "Your photo will be retained in the Exam Kit while you add the signature",
    };
  }

  return {
    slug: "exam-package",
    label: "Review in the Exam Kit",
    hint: "Carry this photo into a final measurable file check and download",
  };
}
