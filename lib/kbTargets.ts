/**
 * Dedicated "resize to N KB" landing pages — high-intent (esp. India forms).
 * Keyword-rich, root-level slugs: /photo-resize-to-20kb/.
 */
export const KB_TARGETS = [10, 20, 30, 50, 100, 200] as const;

export type KbTarget = (typeof KB_TARGETS)[number];

export const kbSlug = (kb: number) => `photo-resize-to-${kb}kb`;
export const kbPath = (kb: number) => `/${kbSlug(kb)}/`;

export const SIGNATURE_KB_TARGETS = [10, 20, 50, 100] as const;
export type SignatureKbTarget = (typeof SIGNATURE_KB_TARGETS)[number];
export const sigKbSlug = (kb: number) => `signature-resize-to-${kb}kb`;
export const sigKbPath = (kb: number) => `/${sigKbSlug(kb)}/`;

/** Dedicated "compress PDF to N KB" landing pages — marksheets, certificates, forms. */
export const PDF_KB_TARGETS = [50, 100, 200, 500] as const;
export type PdfKbTarget = (typeof PDF_KB_TARGETS)[number];
export const pdfKbSlug = (kb: number) => `compress-pdf-to-${kb}kb`;
export const pdfKbPath = (kb: number) => `/${pdfKbSlug(kb)}/`;
