import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { COUNTRY_SPECS, effectivePrintMm } from "@/lib/countrySpecs";
import { kbPath } from "@/lib/kbTargets";
import type { FaqItem } from "@/components/site/Faq";

const spec = COUNTRY_SPECS["india"];
const mm = effectivePrintMm(spec);

export const metadata = pageMetadata({
  title: "Resume / CV Photo Maker — Passport-Size, Free",
  description:
    "Make a professional passport-size photo for your resume, CV or bio-data. " +
    `Auto-crops to ${mm.width}×${mm.height}mm with a clean white background. ` +
    "Free, private, and entirely in your browser — nothing is uploaded.",
  path: "/tools/resume-photo/",
});

const FAQ: FaqItem[] = [
  {
    q: "What size photo should I use on a resume?",
    a: `Most Indian resumes, CVs and bio-data use a standard passport-size photo — ${mm.width}×${mm.height}mm (3.5×4.5cm). This tool crops to exactly that size with a clean background, so it is ready to print or paste.`,
  },
  {
    q: "Should I smile in a resume photo?",
    a: "Aim for a friendly but professional, mostly neutral expression — a gentle, closed-mouth smile is fine. Dress formally, face the camera straight on, and use even lighting with no harsh shadows.",
  },
  {
    q: "What background should a resume photo have?",
    a: "A plain, light background reads as professional — usually white or light grey. This tool sets a clean white background automatically, so a busy room behind you won't show.",
  },
  {
    q: "Do resumes in the US, UK or Canada need a photo?",
    a: "No. In the US, UK, Canada and Australia, a photo is usually left off a resume to avoid bias, and many employers prefer it that way. Photos are common and often expected on resumes/CVs in India, much of Europe, the Middle East and parts of Asia.",
  },
  {
    q: "Is the resume photo maker free and private?",
    a: "Yes. It is completely free, with no watermark and no sign-up. Your photo is processed entirely in your browser and is never uploaded to any server.",
  },
];

export default function Page() {
  return (
    <ToolPage
      title="Resume / CV Photo Maker"
      slug="resume-photo"
      path="/tools/resume-photo/"
      blurb={`Make a professional passport-size photo (${mm.width}×${mm.height}mm) for your resume, CV or bio-data — correct size, clean white background, free. Nothing is uploaded.`}
      faqItems={FAQ}
      footnote="Your photo is processed entirely in your browser. Nothing is uploaded."
    >
      {/* India 35x45mm passport spec, with the passport-submission advisory
          stripped — this is resume context, not a passport application. */}
      <PhotoTool spec={{ ...spec, advisory: undefined }} />

      <div className="mt-8 space-y-3">
        <h2 className="eyebrow">Tips for a good resume photo</h2>
        <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          <li>Wear formal or smart-casual clothing in a solid colour.</li>
          <li>Face the camera straight on, with your head and shoulders in frame.</li>
          <li>Use soft, even lighting and avoid strong shadows on your face.</li>
          <li>Keep a calm, confident expression — a slight smile works well.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Building an online profile too? Make a square{" "}
          <Link href="/tools/linkedin-photo/" className="text-brand hover:underline">
            LinkedIn profile photo
          </Link>{" "}
          from the same headshot.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Uploading the photo to a portal?
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          If a job portal caps the file size, compress the finished photo to an
          exact KB target. Your image stays in your browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[20, 50, 100].map((kb) => (
            <Link
              key={kb}
              href={kbPath(kb)}
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
            >
              Resize to {kb} KB
            </Link>
          ))}
          <Link
            href="/tools/resize-kb/"
            className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft/50"
          >
            Custom size
          </Link>
        </div>
      </div>
    </ToolPage>
  );
}
