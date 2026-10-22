/**
 * Structured data stays a true representation of the page (Google
 * structured-data policies; CLAUDE.md §6.9 question 5).
 *
 * Source-level half of the check, runnable without a build: no rating or review
 * markup exists anywhere in the code, and the one SoftwareApplication builder
 * prices the tools at "0". scripts/quality-gate.mjs checks the built pages:
 * every FAQ question/answer, BlogPosting headline and breadcrumb name in the
 * JSON-LD must appear in the visible text, and no exported page carries rating
 * markup.
 */
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { softwareApplicationSchema } from "@/lib/schema";
import { NEVER_LOOSEN } from "@/scripts/quality/ratchet.mjs";
import { sourceFiles } from "./quality/sourceFiles";

const ROOTS = ["app", "components", "lib"];
/** easyPhoto has no reviews or ratings to mark up; any of these would be invented. */
const RATING_MARKUP = /["'`](?:AggregateRating|Review|Rating)["'`]|\b(?:aggregateRating|reviewRating|ratingValue|ratingCount|reviewCount)\b/;

describe("structured data policy", () => {
  it("recognises rating markup", () => {
    expect(RATING_MARKUP.test(`{ "@type": "AggregateRating", ratingValue: 4.9 }`)).toBe(true);
    expect(RATING_MARKUP.test(`"Reviewed by"`)).toBe(false);
  });

  it("no source file emits AggregateRating, Review or rating fields", () => {
    const offenders = sourceFiles(ROOTS, /\.(?:ts|tsx)$/).filter((file) => RATING_MARKUP.test(fs.readFileSync(file, "utf8")));
    expect(offenders, `Rating/review markup with no real reviews is spam: ${offenders.join(", ")}. ${NEVER_LOOSEN}`).toEqual([]);
  });

  it("SoftwareApplication offers are free (price \"0\")", () => {
    const schema = softwareApplicationSchema({ name: "Tool", description: "Free tool", url: "/tools/x/" });
    expect(schema.offers).toMatchObject({ "@type": "Offer", price: "0" });
  });
});
