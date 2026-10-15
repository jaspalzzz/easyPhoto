/**
 * Homepage brand (owner-approved 15 Oct 2026). "easyPhoto" is shared by
 * unrelated apps, so our profiles go in the Organization `sameAs`; the H1 says
 * what we do in visitors' words.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { organizationSchema } from "@/lib/schema";

describe("homepage brand", () => {
  it("lists our confirmed profiles in sameAs", () => {
    expect(organizationSchema().sameAs).toEqual(
      expect.arrayContaining(["https://www.producthunt.com/products/easyphoto"])
    );
  });

  it("has a plain H1 without 'to spec'", () => {
    const page = fs.readFileSync(path.join("app", "page.tsx"), "utf8");
    expect(page).toContain("Passport, exam and document photos,");
    expect(page).toContain("ready for Indian forms");
    expect(page).not.toContain("prepared to spec");
  });
});
