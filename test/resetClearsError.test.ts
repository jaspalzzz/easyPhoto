/**
 * Guards the "Choose another file" reset against stale error banners.
 *
 * Every file-based tool renders its dropzone when `!file` and its error banner
 * independently of `file`. So a reset handler that clears the file but not the
 * error leaves the user staring at a fresh dropzone with the *previous* file's
 * failure still on screen — reported live on /tools/compress-document/ after a
 * password-protected PDF: "Couldn't compress this PDF" persisted after picking
 * another file, making a working tool look broken.
 *
 * `pick()` already clears the error on the happy path; the gap is only in the
 * explicit reset buttons. This scans source rather than mounting each tool,
 * because the bug is a missing statement in a handler — a static fact — and a
 * hand-run grep is exactly what let four components drift out of sync.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const TOOLS_DIR = path.join(process.cwd(), "components", "tools");

/** Inline reset handlers, e.g. onClick={() => { setFile(null); ... }} */
const RESET_HANDLER = /on[A-Z]\w*=\{\(\)\s*=>\s*\{([^}]*setFile\(null\)[^}]*)\}\}/g;

function toolSources(): { file: string; source: string }[] {
  return readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".tsx"))
    .map((e) => ({
      file: e.name,
      source: readFileSync(path.join(TOOLS_DIR, e.name), "utf8"),
    }));
}

/** A component only has the bug if it actually owns an error state to leave stale. */
function hasErrorState(source: string): boolean {
  return /\bsetError\b/.test(source);
}

function offendingHandlers(source: string): string[] {
  return [...source.matchAll(RESET_HANDLER)]
    .map((m) => m[1].trim())
    .filter((body) => !/setError\(\s*null\s*\)/.test(body));
}

describe("file reset clears the error banner", () => {
  it("finds reset handlers to check (guard is not vacuous)", () => {
    const withResets = toolSources().filter(
      ({ source }) => hasErrorState(source) && [...source.matchAll(RESET_HANDLER)].length > 0
    );
    expect(withResets.length).toBeGreaterThan(0);
  });

  it("no tool clears the file without also clearing the error", () => {
    const offenders = toolSources()
      .filter(({ source }) => hasErrorState(source))
      .flatMap(({ file, source }) => offendingHandlers(source).map((body) => `${file}: ${body}`));

    expect(offenders).toEqual([]);
  });

  it("detects the regression when setError(null) is dropped", () => {
    const mutated = `
      const [error, setError] = React.useState<string | null>(null);
      <Button onClick={() => { setFile(null); setResultBlob(null); }}>Choose another file</Button>
    `;
    expect(hasErrorState(mutated)).toBe(true);
    expect(offendingHandlers(mutated)).toHaveLength(1);
  });

  it("accepts a handler that clears the error", () => {
    const fixed = `
      const [error, setError] = React.useState<string | null>(null);
      <Button onClick={() => { setFile(null); setResultBlob(null); setError(null); }}>Choose another file</Button>
    `;
    expect(offendingHandlers(fixed)).toEqual([]);
  });
});
