/** Source walking shared by the guideline guards. Paths are repo-relative. */
import fs from "node:fs";
import path from "node:path";

/** Every file under `roots` whose name matches `extension`, test files excluded. */
export function sourceFiles(roots: string[], extension: RegExp): string[] {
  const walk = (dir: string): string[] => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return extension.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
    });
  };
  return roots.flatMap(walk);
}

/**
 * Removes `//` and `/* *\/` comments, which explain past decisions and may
 * name exactly what a guard forbids. Block comments keep their newlines so a
 * reported line number still points at the source. A `//` after `:` or a quote
 * (a URL, a string) is left alone.
 */
export function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
}
