// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { leavesClickToBrowser, needsFullLoad } from "@/lib/isolationBoundary";
import { holdsUnsavedWork, keepDocumentWhile } from "@/lib/unsavedWork";
import {
  clearExamWorkflowDraft,
  discardWorkflowPayload,
  setWorkflowPayload,
} from "@/lib/workflowHandoff";

/**
 * An in-site link keeps the document the visitor landed on, and with it that
 * document's cross-origin isolation. Measured 20 Nov 2026 on the production
 * headers: a visitor who landed on the homepage (isolated) and followed a link
 * to /blog/ was still isolated there, which blocks ad frames; a visitor who
 * landed on /blog/ and followed a link to background removal was not isolated,
 * and the model took 52.7 s instead of 6.9 s without a GPU. A link that
 * crosses between the two kinds of page must load a fresh document. The
 * browser-level proof is e2e/isolation-navigation.spec.ts.
 */

const ISOLATED_DOC = { landedOnIsolatedPath: true, isolated: true };
const PLAIN_DOC = { landedOnIsolatedPath: false, isolated: false };
// Safari ignores `Cross-Origin-Embedder-Policy: credentialless`.
const HEADER_IGNORED_DOC = { landedOnIsolatedPath: true, isolated: false };

describe("needsFullLoad", () => {
  it("loads a fresh document when leaving an isolated page for an ad page", () => {
    expect(needsFullLoad("/blog/", ISOLATED_DOC)).toBe(true);
    expect(needsFullLoad("/exam-requirements/rrb/", ISOLATED_DOC)).toBe(true);
  });

  it("loads a fresh document when entering an AI page from an unisolated one", () => {
    expect(needsFullLoad("/tools/background-removal/", PLAIN_DOC)).toBe(true);
    expect(needsFullLoad("/", PLAIN_DOC)).toBe(true);
    expect(needsFullLoad("/us-passport-photo-maker/", PLAIN_DOC)).toBe(true);
  });

  it("keeps the document between two pages of the same kind", () => {
    expect(needsFullLoad("/passport-photo/", ISOLATED_DOC)).toBe(false);
    expect(needsFullLoad("/tools/sign-image/", PLAIN_DOC)).toBe(false);
  });

  it("never reloads for a browser that ignored the header: a reload cannot isolate it", () => {
    expect(needsFullLoad("/blog/", HEADER_IGNORED_DOC)).toBe(false);
    expect(needsFullLoad("/tools/background-removal/", HEADER_IGNORED_DOC)).toBe(false);
  });

  it("treats a path without its trailing slash the same way", () => {
    expect(needsFullLoad("/tools/background-removal", PLAIN_DOC)).toBe(true);
  });
});

interface Click {
  init?: MouseEventInit;
  doc?: typeof PLAIN_DOC;
  here?: string;
  /** Something earlier in the capture phase already handled the click. */
  alreadyHandled?: boolean;
}

/**
 * Click the element marked data-target (or the first link) and return what
 * leavesClickToBrowser answers during the capture phase, where the real
 * listener runs.
 */
function clickOn(html: string, click: Click = {}): boolean {
  const { init = {}, doc = PLAIN_DOC, here = "http://localhost/blog/", alreadyHandled = false } = click;
  document.body.innerHTML = html;
  const target = document.querySelector("[data-target]") ?? document.querySelector("a")!;
  let answer = false;
  const capture = (event: MouseEvent) => {
    if (alreadyHandled) event.preventDefault();
    answer = leavesClickToBrowser(event, doc, here);
    // jsdom cannot navigate; stop it trying once the answer is recorded.
    event.preventDefault();
  };
  document.addEventListener("click", capture, true);
  target.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init }));
  document.removeEventListener("click", capture, true);
  return answer;
}

const AI_LINK = '<a href="/tools/background-removal/">Remove background</a>';

describe("leavesClickToBrowser", () => {
  afterEach(() => {
    discardWorkflowPayload();
    clearExamWorkflowDraft();
    document.body.innerHTML = "";
  });

  it("takes a plain click on a link that crosses the boundary", () => {
    expect(clickOn(AI_LINK)).toBe(true);
    expect(clickOn('<a href="/blog/">Guides</a>', { doc: ISOLATED_DOC, here: "http://localhost/" })).toBe(true);
  });

  it("finds the link when the click lands on something inside it", () => {
    expect(clickOn('<a href="/"><span data-target>easyPhoto</span></a>')).toBe(true);
  });

  it("judges a link by its path, whatever query or fragment it carries", () => {
    expect(clickOn('<a href="/passport-photo/?c=in#maker">Passport</a>')).toBe(true);
  });

  it("leaves a link to the same kind of page to the router", () => {
    expect(clickOn('<a href="/tools/sign-image/">Sign</a>')).toBe(false);
  });

  it("leaves new-tab, download, modified and non-primary clicks to the browser", () => {
    expect(clickOn(AI_LINK, { init: { metaKey: true } })).toBe(false);
    expect(clickOn(AI_LINK, { init: { ctrlKey: true } })).toBe(false);
    expect(clickOn(AI_LINK, { init: { shiftKey: true } })).toBe(false);
    expect(clickOn(AI_LINK, { init: { altKey: true } })).toBe(false);
    expect(clickOn(AI_LINK, { init: { button: 1 } })).toBe(false);
    expect(clickOn('<a href="/" target="_blank">Home</a>')).toBe(false);
    expect(clickOn('<a href="/" download>Home</a>')).toBe(false);
  });

  it("ignores other sites and clicks that are not on a link", () => {
    expect(clickOn('<a href="https://example.org/">Elsewhere</a>', { doc: ISOLATED_DOC })).toBe(false);
    expect(clickOn("<button data-target>Go</button>", { doc: ISOLATED_DOC })).toBe(false);
  });

  it("ignores a link to a section of the page the visitor is already on", () => {
    expect(clickOn('<a href="/#makers">Makers</a>', { here: "http://localhost/" })).toBe(false);
  });

  it("ignores a click something else already handled", () => {
    expect(clickOn(AI_LINK, { alreadyHandled: true })).toBe(false);
  });

  it("keeps the document while a file is waiting to be handed to the next tool", () => {
    setWorkflowPayload(new Blob(["x"]), "photo.jpg", { kind: "photo" });
    expect(clickOn(AI_LINK)).toBe(false);
  });

  it("keeps the document while the Exam Kit is holding a photo or signature", () => {
    setWorkflowPayload(new Blob(["x"]), "photo.jpg", {
      kind: "photo",
      examId: "ssc",
      rememberForExamKit: true,
    });
    discardWorkflowPayload();
    expect(clickOn(AI_LINK)).toBe(false);
  });
});

describe("keepDocumentWhile", () => {
  it("reports unsaved work only while a registered check says so", () => {
    let working = false;
    const stop = keepDocumentWhile(() => working);
    expect(holdsUnsavedWork()).toBe(false);
    working = true;
    expect(holdsUnsavedWork()).toBe(true);
    stop();
    expect(holdsUnsavedWork()).toBe(false);
  });
});
