import { test, expect, type Page } from "@playwright/test";
import { spawn, type ChildProcess } from "child_process";
import fs from "fs";
import path from "path";

/**
 * A link between an AI page and any other page must load a fresh document, so
 * the visitor gets the isolation that page is served with (lib/
 * isolationBoundary.ts). Before this, a visitor who landed on the homepage and
 * followed a link to /blog/ stayed isolated there, which blocks ad frames, and
 * one who landed on /blog/ and followed a link to an AI page was not isolated,
 * which leaves the background model on one thread.
 *
 * Isolation comes from response headers, which only the static export served
 * with public/_headers has. So this spec starts scripts/serve-export.mjs on
 * its own port and needs `npm run build` first; it is skipped when there is no
 * export, and when the suite is pointed at a deployed site.
 */
const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.E2E_EXPORT_PORT) || 39218;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const HAS_EXPORT = fs.existsSync(path.join(ROOT, "out", "index.html"));

let server: ChildProcess | undefined;

test.skip(!HAS_EXPORT, 'needs the static export: run "npm run build" first');
test.skip(!!process.env.E2E_BASE_URL, "starts its own local server");

test.beforeAll(async () => {
  server = spawn(process.execPath, [path.join(ROOT, "scripts", "serve-export.mjs"), String(PORT)], {
    stdio: ["ignore", "pipe", "inherit"],
  });
  await new Promise<void>((resolve, reject) => {
    server!.stdout!.once("data", () => resolve());
    server!.once("exit", (code) => reject(new Error(`serve-export exited with ${code}`)));
  });
});

test.afterAll(() => {
  server?.kill();
});

const isolated = (page: Page) => page.evaluate(() => self.crossOriginIsolated);

/** Mark the document, so a later check can tell whether it was replaced. */
const markDocument = (page: Page) =>
  page.evaluate(() => {
    (window as unknown as { __sameDocument?: boolean }).__sameDocument = true;
  });
const sameDocument = (page: Page) =>
  page.evaluate(() => (window as unknown as { __sameDocument?: boolean }).__sameDocument === true);

/** Click the first visible in-site link to `href`, as a visitor would. */
async function followLink(page: Page, href: string) {
  await page.locator(`a[href="${href}"]:visible`).first().click();
  await page.waitForURL(`${ORIGIN}${href}`);
  await page.waitForLoadState("load");
}

test("leaving the homepage for an article loads a document that is not isolated", async ({ page }) => {
  await page.goto(`${ORIGIN}/`);
  expect(await isolated(page)).toBe(true);
  await markDocument(page);

  await followLink(page, "/blog/");

  expect(await sameDocument(page), "a fresh document").toBe(false);
  expect(await isolated(page), "ad frames can load here").toBe(false);
});

test("entering an AI page from an article loads an isolated document", async ({ page }) => {
  await page.goto(`${ORIGIN}/blog/`);
  expect(await isolated(page)).toBe(false);
  await markDocument(page);

  await followLink(page, "/passport-photo/");

  expect(await sameDocument(page), "a fresh document").toBe(false);
  expect(await isolated(page), "the model can use threads here").toBe(true);
});

test("a link between two pages of the same kind keeps the document", async ({ page }) => {
  await page.goto(`${ORIGIN}/blog/`);
  await markDocument(page);

  await followLink(page, "/tools/");

  expect(await sameDocument(page), "client-side navigation is untouched").toBe(true);
  expect(await isolated(page)).toBe(false);
});
