import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ExamSpecTable } from "@/components/site/ExamSpecTable";
import { portalFaqItems, portalRejectionReasons } from "@/lib/faqs";
import { allPortalSpecs } from "@/lib/specRegistry";
import { GET as getEmbed } from "@/app/embed/exam-spec/[id]/route";
import { generateMetadata as getExamMetadata } from "@/app/exam-requirements/[exam]/page";

const specs = allPortalSpecs();

function tableSections(html: string) {
  const signatureStart = html.indexOf(">Signature</p>");
  return {
    photo: signatureStart >= 0 ? html.slice(0, signatureStart) : html,
    signature: signatureStart >= 0 ? html.slice(signatureStart) : "",
  };
}

describe("portal background and format presentation", () => {
  it.each(specs.map((spec) => [spec.id, spec] as const))(
    "%s: renders only registry-backed background and format rows",
    (_id, spec) => {
      const sections = tableSections(renderToStaticMarkup(<ExamSpecTable spec={spec} />));

      if (spec.photoFormat) expect(sections.photo).toContain(spec.photoFormat);
      else expect(sections.photo).not.toContain(">Format<");

      if (spec.photoBackground) expect(sections.photo).toContain(spec.photoBackground);
      else expect(sections.photo).not.toContain(">Background<");

      if (spec.sigFormat) expect(sections.signature).toContain(spec.sigFormat);
      else expect(sections.signature).not.toContain(">Format<");
    }
  );

  it.each(specs.map((spec) => [spec.id, spec] as const))(
    "%s: FAQ names a format only when that media field carries one",
    (_id, spec) => {
      const items = portalFaqItems(spec);
      const photo = items.find((item) => /photo size/i.test(item.q))?.a ?? "";
      const signature = items.find((item) => /signature size/i.test(item.q))?.a ?? "";

      if (spec.photoFormat) expect(photo).toContain(spec.photoFormat);
      else expect(photo).not.toMatch(/\b(?:JPG|JPEG|PNG)\b/i);

      if (spec.sigLimitKb !== undefined) {
        if (spec.sigFormat) expect(signature).toContain(spec.sigFormat);
        else expect(signature).not.toMatch(/\b(?:JPG|JPEG|PNG)\b/i);
      }
    }
  );

  it("renders OCI and MPSC with their published non-white backgrounds", () => {
    const oci = specs.find((spec) => spec.id === "oci")!;
    const mpsc = specs.find((spec) => spec.id === "mpsc")!;
    const ociHtml = renderToStaticMarkup(<ExamSpecTable spec={oci} />);
    const mpscHtml = renderToStaticMarkup(<ExamSpecTable spec={mpsc} />);

    expect(ociHtml).toContain("Plain light-coloured (not white)");
    expect(ociHtml).not.toContain(">Plain white<");
    expect(mpscHtml).toContain("Solid colour (blue, green or red)");
  });

  it("keeps the statically exported embed card on the same typed fields", async () => {
    const response = await getEmbed(new Request("https://easyphoto.in/embed/exam-spec/itbp"), {
      params: Promise.resolve({ id: "itbp" }),
    });
    const html = await response.text();

    expect(html).not.toContain(">Format<");
    expect(html).not.toContain(">Background<");
    expect(html).toContain("Compatibility target · confirm current form");
  });

  it("omits unsupported-format warnings when no format is recorded", () => {
    const itbp = specs.find((spec) => spec.id === "itbp")!;
    const oci = specs.find((spec) => spec.id === "oci")!;

    expect(portalRejectionReasons(itbp, true).join(" ")).not.toMatch(/format/i);
    expect(portalRejectionReasons(oci, true).join(" ")).toMatch(/format/i);
  });

  it("does not claim metadata format verification without a recorded format", async () => {
    const itbp = await getExamMetadata({ params: Promise.resolve({ exam: "itbp" }) });
    const oci = await getExamMetadata({ params: Promise.resolve({ exam: "oci" }) });

    expect(itbp.description).toContain("Stored size for the form");
    expect(itbp.description).not.toMatch(/size (?:&|and) format/i);
    expect(oci.description).toContain("Stored size & format checked");
  });
});
