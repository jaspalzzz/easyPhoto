// Builds audit-report/REPORT.md from the output audit's JSON results
// (audit/outputs.spec.ts). Run after `playwright test -c playwright.audit.config.ts`.
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("audit-report", "results");
if (!fs.existsSync(dir)) {
  console.error("no results in audit-report/results — run the audit first");
  process.exit(1);
}
const rows = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
  .sort((a, b) => (a.exam + a.kind + a.input).localeCompare(b.exam + b.kind + b.input));

const failures = (r) => (r.error ? [r.error] : r.checks.filter((c) => !c.pass).map((c) => `${c.check}: want ${c.expected}, got ${c.actual}`));
const exams = [...new Set(rows.map((r) => r.exam))];
const bad = rows.filter((r) => failures(r).length || (r.pageErrors || []).length);

let md = `# Exam output audit — ${new Date().toISOString().slice(0, 10)}\n\n`;
md += `${rows.length} runs over ${exams.length} exams; **${bad.length} failing runs** in ${new Set(bad.map((r) => r.exam)).size} exams.\n\n`;
md += `## Failures\n\n| Exam | Page | File | Input | Problem |\n|---|---|---|---|---|\n`;
for (const r of bad) {
  const probs = [...failures(r), ...(r.pageErrors || []).map((e) => `page error: ${e}`)];
  md += `| ${r.exam} | ${r.page} | ${r.kind} | ${r.input} | ${probs.join("; ").replace(/\|/g, "/")} |\n`;
}
md += `\n## Every run\n\n| Exam | File | Input | Result | Output |\n|---|---|---|---|---|\n`;
for (const r of rows) {
  const f = r.facts;
  const out = f ? `${f.format} ${f.width}×${f.height}, ${f.bytes} B${f.dpi ? `, ${f.dpi} dpi` : ""}` : "—";
  const note = r.rules?.formatUnspecified ? " (exam names no format)" : "";
  md += `| ${r.exam} | ${r.kind} | ${r.input} | ${failures(r).length ? "FAIL" : "pass"} | ${out}${note} |\n`;
}
fs.writeFileSync(path.resolve("audit-report", "REPORT.md"), md);
console.log(`audit-report/REPORT.md: ${rows.length} runs, ${bad.length} failing`);
