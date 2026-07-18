import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ExamContext } from "@/components/site/ExamContext";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

describe("ExamContext name/date guidance", () => {
  it("does not advertise the digital strip for SSC even when a caller passes a link", () => {
    const html = renderToStaticMarkup(
      <ExamContext spec={PORTAL_PRESETS.ssc} nameDateHref="/tools/photo-with-name-date/" />
    );
    expect(html).not.toMatch(/Photo with Name|Need your name/i);
  });

  it("keeps the digital strip link for a registry preset that requires it", () => {
    const html = renderToStaticMarkup(
      <ExamContext spec={PORTAL_PRESETS.appsc} nameDateHref="/tools/photo-with-name-date/" />
    );
    expect(html).toMatch(/Photo with Name/i);
  });
});
