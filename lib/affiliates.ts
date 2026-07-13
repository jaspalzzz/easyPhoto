import type { PORTAL_KEYS } from "@/lib/portalPresets";

export interface ExamAffiliate {
  url: string;
  label: string;
}

type ExamId = (typeof PORTAL_KEYS)[number];

/**
 * Affiliate destinations for exam requirement pages.
 * Keep this empty until a human has approved and added a real destination.
 */
export const EXAM_AFFILIATES: Partial<Record<ExamId, ExamAffiliate>> = {};

export function getExamAffiliate(examId: ExamId): ExamAffiliate | null {
  const affiliate = EXAM_AFFILIATES[examId];
  return affiliate?.url ? affiliate : null;
}
