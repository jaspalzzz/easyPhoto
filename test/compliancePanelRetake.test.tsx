/**
 * Never state the same fact twice on one page (CLAUDE.md §3).
 *
 * The "Retake recommended" box and the warning list below it are fed by the
 * same crop warnings. Before 18 Oct 2026 the box said the photo would look
 * soft and the list then said it again in developer terms, so a warning the
 * box shows must not also appear in the list.
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CompliancePanel } from "@/components/tool/CompliancePanel";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import {
  CONFLICTING_HEAD_RULES_WARNING,
  LOW_RESOLUTION_WARNING,
  PAST_EDGES_WARNING,
  type CropResult,
} from "@/lib/headPositioning";

const { india } = COUNTRY_SPECS;

function result(warnings: string[], upscale = 1): CropResult {
  return {
    crop: { sx: 0, sy: 0, sw: 400, sh: 500 },
    output: { width: 413, height: 531 },
    dpi: 300,
    achieved: { headPercentOfFrame: 75, upscale },
    warnings,
  };
}

function panelText(r: CropResult): string {
  const html = renderToStaticMarkup(<CompliancePanel spec={india} result={r} />);
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent ?? "";
}

const count = (text: string, part: string) => text.split(part).length - 1;

describe("CompliancePanel — retake box", () => {
  it("says a low-resolution photo will look soft exactly once", () => {
    const text = panelText(result([LOW_RESOLUTION_WARNING], 2.5));
    expect(text).toContain("Retake recommended");
    expect(count(text, "may look soft")).toBe(1);
    expect(text).not.toContain("look good");
  });

  it("says the head is too close to the edges exactly once", () => {
    const text = panelText(result([PAST_EDGES_WARNING]));
    expect(text).toContain("Retake recommended");
    expect(count(text, "too close to the photo edges")).toBe(1);
  });

  it("keeps the second retake reason in the list when both apply", () => {
    const text = panelText(
      result([LOW_RESOLUTION_WARNING, PAST_EDGES_WARNING], 2.5)
    );
    expect(count(text, "may look soft")).toBe(1);
    expect(count(text, "too close to the photo edges")).toBe(1);
  });

  it("lists warnings the retake box does not cover", () => {
    const text = panelText(result([CONFLICTING_HEAD_RULES_WARNING]));
    expect(text).not.toContain("Retake recommended");
    expect(count(text, CONFLICTING_HEAD_RULES_WARNING)).toBe(1);
  });

  it("says the photo looks good only when there are no warnings", () => {
    expect(panelText(result([]))).toContain(
      "Head size, framing and resolution look good."
    );
  });
});
