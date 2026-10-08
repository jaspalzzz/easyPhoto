import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ExamResizerSteps } from "@/components/tools/ExamResizerSteps";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { resizerMetaDescription } from "@/lib/faqs";
import { getPortalSpec } from "@/lib/specRegistry";

const ssc = getPortalSpec("ssc")!;
const ibps = getPortalSpec("ibps")!;

describe("live-capture exam resizer flow", () => {
  it("leads SSC with capture guidance and the signature file", () => {
    const html = renderToStaticMarkup(<ExamResizerSteps spec={ssc} slug="ssc" />);

    expect(html).toContain("Photo is captured in the application");
    expect(html).toContain("Step 1 — Signature file");
    expect(html).not.toContain("Step 1 — Photo");
    expect(html).toContain("Optional compatibility photo tool — not a current portal requirement");
    expect(html).toContain("Drop a photo, or click to browse");
  });

  it("leaves a non-live IBPS upload flow unchanged", () => {
    const html = renderToStaticMarkup(<ExamResizerSteps spec={ibps} slug="ibps" />);

    expect(html).toContain("Step 1 — Photo");
    expect(html).toContain("Step 2 — Signature");
    expect(html).not.toContain("Optional compatibility photo tool");
  });

  it("offers SSC only the signature workspace: SSC takes no photo file", () => {
    const html = renderToStaticMarkup(<PortalResizer portalId="ssc" />);

    expect(html).toContain("Photo: live capture in the application");
    expect(html).toContain("Signature Workspace");
    // No photo tab or photo tool at all (noPhotoUpload), not just a signature default.
    expect(html).not.toContain("Optional photo tool");
    expect(html).not.toContain("Prepare Signature File");
    expect(html).not.toContain("Upload a prepared photograph");
  });

  it("compact mode drops the banner and the shared limitation lists", () => {
    const html = renderToStaticMarkup(<PortalResizer portalId="ssc" hideDescription compact />);

    expect(html).not.toContain("Photo: live capture in the application");
    expect(html).not.toContain("Can check");
    expect(html).not.toContain("All operations run entirely in your browser");
    expect(html).not.toContain("selected 10–20 KB target");
    // The tool itself is still there.
    expect(html).toContain('type="file"');
  });

  it("keeps non-live embedded portal workspaces photo-first", () => {
    const html = renderToStaticMarkup(<PortalResizer portalId="ibps" />);

    expect(html).toContain("Compress Portal Photo");
    expect(html).toContain("Clean &amp; Compress Signature");
    expect(html).not.toContain("&amp;amp;");
    expect(html).toContain("Photo Sizer");
    expect(html).toContain("Upload a prepared photograph");
  });

  it("keeps live-capture metadata on the capture workflow", () => {
    const description = resizerMetaDescription(ssc, "SSC");

    expect(description).toMatch(/captures the photograph live/i);
    expect(description).toMatch(/separate 10–20 KB signature/i);
    expect(description).toMatch(/compatibility aid, not the live-photo step/i);
    expect(description).not.toMatch(/prepare your SSC photo/i);
  });
});
