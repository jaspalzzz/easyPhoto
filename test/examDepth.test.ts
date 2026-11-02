import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = fs.readFileSync(
  path.join(process.cwd(), "app/exam-requirements/[exam]/page.tsx"),
  "utf8"
);

describe("exam page template", () => {
  // The bespoke Sarathi / IAF / Army / SBI blocks only repeated the requirement
  // cards (1 Nov 2026 review) and were removed. The Sarathi guide is still
  // linked from the driving-licence page through examGuideLinks().
  it("removes the bespoke blocks that restated the requirement cards", () => {
    for (const exam of ["sbi", "driving-licence", "airforce-agniveer", "army-agniveer", "csir-net"]) {
      expect(pageSource).not.toContain(`{exam === "${exam}" && (`);
    }
    expect(pageSource).not.toMatch(/record sets|upload targets|compatibility tool/);
  });
});
