import { describe, expect, it } from "vitest";
import { redEyeReplacement } from "@/components/tools/RedEyeTool";

describe("redEyeReplacement", () => {
  it("does not treat normal warm skin or eyelid tones as red-eye", () => {
    expect(redEyeReplacement(185, 124, 105)).toBeNull();
    expect(redEyeReplacement(180, 90, 70)).toBeNull();
  });

  it("turns true flash red-eye into a neutral dark pupil color", () => {
    const replacement = redEyeReplacement(235, 64, 54);

    expect(replacement).not.toBeNull();
    expect(replacement).toBeGreaterThanOrEqual(14);
    expect(replacement).toBeLessThan(60);
  });
});
