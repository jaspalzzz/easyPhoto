/**
 * Guards that the maker PAGE uses labelWithDoc, not merely that the helper works.
 *
 * `makerLabel.test.ts` asserts labelWithDoc() returns the right string. That is
 * necessary but not sufficient, and it was measured: reverting the h1 in
 * `app/[maker]/page.tsx` to `{spec.label} {Doc} Photo Maker` left the helper
 * correct, its unit test green, and "Schengen Visa Visa Photo Maker" back on
 * the live page. A guard that cannot fail on the regression it was written for
 * is not a guard.
 *
 * So this renders the actual server component and reads the strings the page
 * publishes: the <h1> from the rendered tree and the <title> from
 * generateMetadata. PhotoTool is stubbed — this is about the page's own copy.
 */
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/tool/PhotoTool", () => ({
  PhotoTool: () => React.createElement("div", { "data-testid": "photo-tool" }),
}));

import MakerPage, { generateMetadata } from "@/app/[maker]/page";

/** Any word repeated back-to-back, case-insensitively. */
const REPEATED_WORD = /\b(\w+)\s+\1\b/i;

type Element = React.ReactElement<Record<string, unknown>>;

/** Flatten a rendered tree to plain text. */
function textOf(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(" ");
  const el = node as Element;
  if (!el?.props) return "";
  return textOf((el.props as { children?: unknown }).children);
}

/** Find the first element rendered with the given intrinsic tag. */
function findTag(node: unknown, tag: string): Element | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findTag(child, tag);
      if (hit) return hit;
    }
    return null;
  }
  const el = node as Element;
  if (!el.props) return null;
  if (el.type === tag) return el;
  return findTag((el.props as { children?: unknown }).children, tag);
}

async function renderedH1(slug: string): Promise<string> {
  const tree = await MakerPage({ params: Promise.resolve({ maker: slug }) });
  const h1 = findTag(tree, "h1");
  return textOf(h1).replace(/\s+/g, " ").trim();
}

async function metadataTitle(slug: string): Promise<string> {
  const meta = await generateMetadata({ params: Promise.resolve({ maker: slug }) });
  const title = (meta as { title?: unknown }).title;
  return typeof title === "string" ? title : String((title as { default?: string })?.default ?? "");
}

describe("maker page publishes headings without a repeated word", () => {
  it("renders the schengen h1 without doubling 'Visa'", async () => {
    const h1 = await renderedH1("schengen-visa-photo-maker");
    expect(h1).toBe("Schengen Visa Photo Maker");
    expect(h1).not.toMatch(REPEATED_WORD);
  });

  it("builds the schengen title without doubling 'Visa'", async () => {
    const title = await metadataTitle("schengen-visa-photo-maker");
    expect(title).toContain("Schengen Visa Photo Size");
    expect(title).not.toMatch(REPEATED_WORD);
  });

  it("still names the document on an ordinary country label", async () => {
    // The fix must not swallow the word for labels that do not carry it.
    const h1 = await renderedH1("us-passport-photo-maker");
    expect(h1).toBe("United States Passport Photo Maker");
  });
});
