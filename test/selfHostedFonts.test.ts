import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { sourceFiles, stripComments } from "./quality/sourceFiles";

/**
 * The build must not download fonts. `next/font/google` fetches them from
 * Google while building; on 20 Nov 2026 that fetch failed on Cloudflare twice
 * in a row ("An error occurred in `next/font`") and release #168 stayed
 * undeployed for a day. The fonts now live in app/fonts/ and are declared in
 * app/fonts/fonts.css.
 */
const FONT_DIR = path.join(process.cwd(), "app", "fonts");
const FONT_CSS = fs.readFileSync(path.join(FONT_DIR, "fonts.css"), "utf8");
const LAYOUT = fs.readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");

const referencedFiles = [...FONT_CSS.matchAll(/url\(\.\/([^)]+)\)/g)].map((match) => match[1]);

describe("self-hosted fonts", () => {
  it("no source file loads a font from Google at build time", () => {
    const offenders = sourceFiles(["app", "components", "lib"], /\.(?:ts|tsx|js|jsx|mjs)$/).filter((file) =>
      /from\s+["']next\/font\/google["']/.test(stripComments(fs.readFileSync(file, "utf8"))),
    );
    expect(offenders, "use the files in app/fonts/ (see app/fonts/README.md)").toEqual([]);
  });

  it("no stylesheet or layout points at Google's font servers", () => {
    const globals = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
    for (const source of [FONT_CSS, globals, LAYOUT]) {
      expect(stripComments(source)).not.toMatch(/fonts\.(?:googleapis|gstatic)\.com/);
    }
  });

  it("every @font-face rule points at a file that is in the folder", () => {
    expect(referencedFiles.length).toBeGreaterThan(0);
    const missing = [...new Set(referencedFiles)].filter((file) => !fs.existsSync(path.join(FONT_DIR, file)));
    expect(missing).toEqual([]);
  });

  it("the folder holds no font file that no rule uses", () => {
    const onDisk = fs.readdirSync(FONT_DIR).filter((file) => file.endsWith(".woff2"));
    expect(onDisk.filter((file) => !referencedFiles.includes(file))).toEqual([]);
  });

  it.each(["--font-sans", "--font-display", "--font-outfit", "--font-mono"])(
    "defines %s, which Tailwind and the components read",
    (variable) => {
      expect(FONT_CSS).toMatch(new RegExp(`${variable}:\\s*"`));
    },
  );

  it("every preloaded font is one the stylesheet declares", () => {
    const preloaded = [...LAYOUT.matchAll(/new URL\("\.\/fonts\/([^"]+)"/g)].map((match) => match[1]);
    expect(preloaded.length).toBeGreaterThan(0);
    expect(preloaded.filter((file) => !referencedFiles.includes(file))).toEqual([]);
  });

  it("fonts.css is imported after globals.css, so its variables are the last word", () => {
    const globalsAt = LAYOUT.indexOf('import "./globals.css"');
    const fontsAt = LAYOUT.indexOf('import "./fonts/fonts.css"');
    expect(globalsAt).toBeGreaterThan(-1);
    expect(fontsAt).toBeGreaterThan(globalsAt);
  });
});
