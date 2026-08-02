/**
 * Guards that the maker PAGE applies the advisory scoping, not merely that the
 * helper exists.
 *
 * `countryAdvisoryScope.test.ts` asserts `specForDocumentKind` behaves. That is
 * necessary but not sufficient: if `app/[maker]/page.tsx` were changed back to
 * an inline `kind === "visa" ? { ...spec, advisory: undefined } : spec`, the
 * helper would still be correct, its unit test would still pass, and the Canada
 * and Japan warnings would silently vanish from the rendered page again.
 *
 * So this renders the actual server component and inspects the props handed to
 * PhotoTool. PhotoTool is stubbed — this is about what the page passes down,
 * not about the tool's own behaviour.
 */
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

const photoToolProps: Array<Record<string, unknown>> = [];

vi.mock("@/components/tool/PhotoTool", () => ({
  PhotoTool: (props: Record<string, unknown>) => {
    photoToolProps.push(props);
    return React.createElement("div", { "data-testid": "photo-tool" });
  },
}));

import MakerPage from "@/app/[maker]/page";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";

type Element = React.ReactElement<Record<string, unknown>>;

/** Walk a rendered tree and return the props given to the stubbed PhotoTool. */
function findPhotoToolProps(node: unknown): Record<string, unknown> | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findPhotoToolProps(child);
      if (hit) return hit;
    }
    return null;
  }
  const el = node as Element;
  if (!el.props) return null;
  // The mocked component is the function we registered above.
  if (typeof el.type === "function" && el.type.name !== "") {
    const rendered = photoToolProps.length;
    void rendered;
  }
  if ((el.type as { name?: string })?.name === "PhotoTool") return el.props;
  return findPhotoToolProps((el.props as { children?: unknown }).children);
}

async function specPassedToTool(slug: string) {
  photoToolProps.length = 0;
  const tree = await MakerPage({ params: Promise.resolve({ maker: slug }) });
  const props = findPhotoToolProps(tree);
  return (props?.spec ?? null) as { advisory?: string } | null;
}

describe("maker page hands the scoped spec to the tool", () => {
  it("keeps a visa-only advisory on the visa page (Canada)", async () => {
    const spec = await specPassedToTool("canada-visa-photo-maker");
    expect(spec).not.toBeNull();
    expect(spec!.advisory).toBe(COUNTRY_SPECS.canada!.advisory);
    expect(spec!.advisory).toMatch(/temporary-residence/i);
  });

  it("keeps a visa-only advisory on the visa page (Japan)", async () => {
    const spec = await specPassedToTool("japan-visa-photo-maker");
    expect(spec).not.toBeNull();
    expect(spec!.advisory).toBe(COUNTRY_SPECS.japan!.advisory);
  });

  it("withholds a passport-scoped advisory from a visa page", async () => {
    // India's advisory is about PSK capture — meaningless on a visa page.
    const spec = await specPassedToTool("india-visa-photo-maker");
    if (spec) expect(spec.advisory).toBeUndefined();
  });

  it("still shows the passport-scoped advisory on the passport page", async () => {
    const spec = await specPassedToTool("australia-passport-photo-maker");
    expect(spec).not.toBeNull();
    expect(spec!.advisory).toBe(COUNTRY_SPECS.australia!.advisory);
  });
});
