import { describe, expect, it } from "vitest";
import type { PortalSpec } from "@/lib/portalPresets";
import { allPortalSpecs } from "@/lib/specRegistry";
import {
  buildNameDatePresets,
  NAME_DATE_PRESETS,
} from "@/lib/nameDatePresets";

describe("name/date presets", () => {
  it("contains every registry preset flagged requiresNameDate and no others", () => {
    const expected = allPortalSpecs()
      .filter((spec) => spec.requiresNameDate === true)
      .map((spec) => spec.id)
      .sort();

    expect(NAME_DATE_PRESETS.map((preset) => preset.id).sort()).toEqual(expected);
    expect(expected).toEqual(["appsc", "kerala-psc", "tnpsc"]);
  });

  it("automatically derives a future flagged preset and its published strip", () => {
    const future: PortalSpec = {
      id: "future-psc",
      name: "Future PSC",
      photoLimitKb: 40,
      photoMinKb: 20,
      photoWidthPx: 120,
      photoHeightPx: 160,
      photoAspectRatio: 120 / 160,
      requiresNameDate: true,
      description: "Photo 120x160 px with name and date in the lower 40 px.",
    };
    const unflagged: PortalSpec = {
      id: "other-exam",
      name: "Other Exam",
      photoLimitKb: 50,
      description: "No name or date treatment is published.",
    };

    expect(buildNameDatePresets([unflagged, future])).toEqual([
      expect.objectContaining({
        id: "future-psc",
        width: 120,
        height: 160,
        kb: 40,
        minKb: 20,
        stripHeightPx: 40,
        ar: 1,
      }),
    ]);
  });

  it("keeps TNPSC's lower 55px band inside its 130x170 final frame", () => {
    expect(NAME_DATE_PRESETS.find((preset) => preset.id === "tnpsc")).toEqual(
      expect.objectContaining({
        width: 130,
        height: 170,
        stripHeightPx: 55,
      })
    );
  });
});
