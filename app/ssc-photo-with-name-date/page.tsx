import Link from "next/link";
import { Info } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { NameDatePhotoTool } from "@/components/tools/NameDatePhotoTool";

const SSC_SOURCE =
  "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cht_2026.pdf";

const FAQ_ITEMS = [
  {
    q: "Does SSC require a name and date on the photograph?",
    a: "No name-and-date strip is listed in the SSC Combined Hindi Translators Examination 2026 notice. Paragraphs 8.4–8.7 say the application captures the candidate's photograph live rather than accepting a pre-existing photo upload.",
  },
  {
    q: "Can I upload a prepared photograph to the current SSC application?",
    a: "The cited 2026 SSC workflow captures the photograph through the computer or mobile camera when prompted. Confirm the notice for the specific SSC examination because application steps can change.",
  },
  {
    q: "What image does the cited SSC notice still ask candidates to prepare?",
    a: "It lists a separate JPEG/JPG signature upload of 10–20 KB at about 6.0 cm by 2.0 cm. It does not publish photo pixel dimensions or a name/date rule for the live photograph.",
  },
  {
    q: "When should I use the digital name-and-date tool?",
    a: "Use it only for a form whose current instructions request digital text, such as APPSC Direct Recruitment OTPR or Kerala PSC. Navy Agniveer and Agniveervayu slate-photo instructions require a physical slate and cannot be recreated with this tool.",
  },
];

export const metadata = pageMetadata({
  title: "SSC Photo with Name & Date: Not Required (2026)",
  description:
    "SSC's 2026 application instructions use live photograph capture and do not list a digital name-and-date strip. Check the current rule before preparing an image.",
  path: "/ssc-photo-with-name-date/",
});

export default function Page() {
  return (
    <ToolPage
      title="SSC Photo with Name &amp; Date: Not Required"
      slug="ssc-photo-with-name-date"
      faqItems={FAQ_ITEMS}
      path="/ssc-photo-with-name-date/"
      blurb="The SSC Combined Hindi Translators Examination 2026 notice says the application captures the candidate's photograph live. It does not list a pre-existing photo upload or a digital name-and-date strip."
      footnote="Your photo is processed entirely in your browser. No server uploads. Confirm the current SSC notice before applying."
    >
      <div className="mb-6 max-w-xl rounded-md border border-brand/10 bg-brand-soft/30 p-4 text-sm leading-relaxed text-ink-soft">
        <div className="flex gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <div>
            <p className="font-semibold text-ink">Current SSC workflow</p>
            <p className="mt-1">
              Paragraphs 8.4–8.7 describe live camera capture and a separate
              signature upload. They do not state that the live photograph needs
              a name/date strip.{" "}
              <a
                href={SSC_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline underline-offset-2"
              >
                Read the SSC notice
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 max-w-xl rounded-md border border-hairline bg-paper p-4 text-sm leading-relaxed text-ink-soft">
        <p className="font-semibold text-ink">Why a name-and-date tool remains below</p>
        <p className="mt-1">
          This indexed URL is retained to answer the SSC query accurately. The
          tool is preset for APPSC, whose current OTPR manual asks for digital
          name/date text. It can also prepare a strip for Kerala PSC or another
          form that explicitly asks for one. See the{" "}
          <Link
            href="/tools/photo-with-name-date/"
            className="font-medium text-brand underline underline-offset-2"
          >
            workflow comparison
          </Link>{" "}
          before using it.
        </p>
      </div>

      <NameDatePhotoTool defaultPresetId="appsc" />
    </ToolPage>
  );
}
