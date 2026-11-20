import { isIsolatedPath } from "@/lib/adExclusions";
import { holdsUnsavedWork } from "@/lib/unsavedWork";

/**
 * Cross-origin isolation belongs to the document, and an in-site link keeps
 * the document. The AI pages send the isolation headers (public/_headers) so
 * the background model can use several threads; every other page leaves them
 * out so ad frames can load. A visitor who moves between the two kinds of page
 * by a link therefore arrives with the wrong state:
 *
 * - landed on an AI page, followed a link to an article: still isolated, so
 *   every ad frame is blocked for the rest of the visit;
 * - landed on an article, followed a link to an AI page: not isolated, so the
 *   model runs on one thread (52.7 s against 6.9 s for the same photo on a
 *   desktop without a GPU, measured 20 Nov 2026).
 *
 * A link that crosses the boundary is therefore left to the browser, which
 * follows it like any other link and loads a fresh document: what a visitor
 * arriving from Google gets. Nothing here navigates from script. Two cases
 * keep the document:
 *
 * - work held in memory (a file being handed to the next tool, the Exam Kit's
 *   photo and signature, a photo loaded in a maker) would be lost by a reload,
 *   so the visitor keeps it and the slower or ad-free page (lib/unsavedWork.ts);
 * - a browser that ignored the header (Safari does not support
 *   `credentialless`) cannot be isolated by loading again.
 *
 * Only link clicks are covered. Navigation started in code (a hand-off, the
 * search box, the command palette) calls router.push and keeps the document;
 * the next link the visitor follows puts it right.
 */

/** What the current document is, as opposed to what its address suggests. */
export interface DocumentIsolation {
  /** The address this document was loaded for is one of the AI pages. */
  landedOnIsolatedPath: boolean;
  /** The browser's own answer: `self.crossOriginIsolated`. */
  isolated: boolean;
}

export function needsFullLoad(targetPath: string, doc: DocumentIsolation): boolean {
  const headerIgnored = doc.landedOnIsolatedPath && !doc.isolated;
  if (headerIgnored) return false;
  return isIsolatedPath(targetPath) !== doc.isolated;
}

/**
 * True when this click should be left to the browser so it loads a fresh
 * document. Only a plain primary click on a same-site link to another page
 * qualifies; anything else stays with the router or the browser as before.
 */
export function leavesClickToBrowser(
  event: MouseEvent,
  doc: DocumentIsolation,
  currentHref: string,
): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (!(event.target instanceof Element)) return false;

  const link = event.target.closest("a[href]");
  if (!link) return false;
  const opensElsewhere =
    link.hasAttribute("download") || !["", "_self"].includes(link.getAttribute("target") ?? "");
  if (opensElsewhere) return false;

  const current = new URL(currentHref);
  let target: URL;
  try {
    target = new URL(link.getAttribute("href") ?? "", current);
  } catch {
    return false;
  }
  if (target.origin !== current.origin || target.pathname === current.pathname) return false;
  return needsFullLoad(target.pathname, doc) && !holdsUnsavedWork();
}
