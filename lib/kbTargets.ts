/** Dedicated "resize to N KB" landing pages — high-intent (esp. India forms). */
export const KB_TARGETS = [10, 20, 50, 100, 200] as const;

export type KbTarget = (typeof KB_TARGETS)[number];

export const kbSlug = (kb: number) => `resize-image-to-${kb}kb`;
export const kbPath = (kb: number) => `/tools/${kbSlug(kb)}/`;
