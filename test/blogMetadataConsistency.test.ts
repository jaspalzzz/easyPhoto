import { describe, expect, it } from "vitest";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog";

const CLAIMS_FIXED_PIXELS = /\b(?:exact|fixed)\s+(?:pixel\s+)?(?:size|dimensions?)\b/i;
const DENIES_FIXED_PIXELS = /\b(?:no|without)\s+fixed\s+pixel(?:s|\s+size|\s+dimensions?)?\b|publishes\s+no\s+fixed\s+pixel/i;

export function hasFixedPixelContradiction(post: Pick<BlogPost, "title" | "description">): boolean {
  return CLAIMS_FIXED_PIXELS.test(post.title) && DENIES_FIXED_PIXELS.test(post.description);
}

describe("blog title and description consistency", () => {
  it("detects the former NDA/CDS contradiction", () => {
    expect(hasFixedPixelContradiction({
      title: "NDA photo requirements — Exact Size",
      description: "UPSC publishes no fixed pixel size.",
    })).toBe(true);
  });

  it("has no title claiming fixed pixels when its description denies them", () => {
    expect(BLOG_POSTS.filter(hasFixedPixelContradiction).map((post) => post.slug)).toEqual([]);
  });
});
