/**
 * Recently-used tools — the ethical return-visit mechanic that fits a
 * no-account product: a small localStorage list (tool slugs only, no user
 * data, no images) so a returning applicant lands one tap from the resizer
 * they used last week. Guarded everywhere: Safari private mode throws on
 * localStorage access.
 */

const KEY = "ep:recent-tools";
const MAX = 4;

export function recordRecentTool(slug: string): void {
  try {
    const list = getRecentTools().filter((s) => s !== slug);
    list.unshift(slug);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* private mode / storage full — feature silently off */
  }
}

export function getRecentTools(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((s) => typeof s === "string")
      : [];
  } catch {
    return [];
  }
}
