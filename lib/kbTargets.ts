/**
 * Dedicated "resize to N KB" landing pages — high-intent (esp. India forms).
 * Keyword-rich, root-level slugs: /photo-resize-to-20kb/.
 */
export const KB_TARGETS = [10, 20, 30, 50, 100, 200] as const;

export type KbTarget = (typeof KB_TARGETS)[number];

export const kbSlug = (kb: number) => `photo-resize-to-${kb}kb`;
export const kbPath = (kb: number) => `/${kbSlug(kb)}/`;
