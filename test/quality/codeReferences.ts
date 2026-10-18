/**
 * Write for applicants, not for us (CLAUDE.md §3).
 *
 * Tool warnings and error messages are shown to users verbatim, so they must
 * never name the code behind them. On 18 Oct 2026 the live resume tool told
 * users to "Use recommendedDigitalDpi() for the online-upload preset."
 *
 * Returns every code-shaped token in a user-facing string: a function call
 * `name()`, a camelCase identifier `headHeightMm`, or a property path
 * `spec.printMm`. An empty array means the string reads as plain English.
 */
const CODE_REFERENCE =
  /\b[A-Za-z_$][\w$]*\(\)|\b[a-z]+[A-Z][A-Za-z0-9]*\b|\b[a-z]\w*\.[a-z]\w*[A-Z]\w*\b/g;

export function codeReferences(text: string): string[] {
  return text.match(CODE_REFERENCE) ?? [];
}
