/**
 * Window events the support pop-up (components/site/SupportCardPanel.tsx)
 * dispatches when it opens and closes, so the other post-download surfaces
 * (DownloadToast, PwaInstallHint) step aside and the user never sees two
 * prompts at once. A module of its own: those surfaces ship on every page and
 * must not pull in the support card's config and rules.
 */
export const SUPPORT_OPEN_EVENT = "ep:support-open";
export const SUPPORT_CLOSE_EVENT = "ep:support-close";
