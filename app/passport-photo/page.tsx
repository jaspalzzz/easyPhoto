import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { DocPhotoLanding } from "@/components/site/DocPhotoLanding";
import { PASSPORT_FAQ } from "@/lib/faqs";

export const metadata = pageMetadata({
  // Indian searchers mean a 35×45 mm photo for any form ("passport size photo
  // maker"): GSC sent those searches to the name & date tool while this page sat
  // at position ~22. The Passport Seva fact stays in the FAQ.
  title: "Passport Size Photo Maker Online — 35×45 mm, White Background",
  titleAbsolute: true,
  description:
    "Make a passport size photo (35 × 45 mm, white background) for job, exam, college and bank forms. " +
    "Download a JPG or a print sheet. Free; nothing is uploaded.",
  path: "/passport-photo/",
});

export default function Page() {
  return (
    <DocPhotoLanding
      kind="passport"
      path="/passport-photo/"
      h1="Passport Size Photo Maker"
      intro="Make a passport size photo for a form: pick India for 35 × 45 mm on a white background, or another country's size, then upload a photo and download it. Processing stays in your browser."
      afterIntro={
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Then{" "}
          <Link href="/blog/how-to-print-passport-photos-at-home/" className="font-medium text-brand hover:underline">
            print several on one sheet
          </Link>
          ,{" "}
          <Link href="/tools/resize-kb/" className="font-medium text-brand hover:underline">
            bring it under your form&apos;s KB limit
          </Link>
          , or{" "}
          <Link href="/tools/photo-with-name-date/" className="font-medium text-brand hover:underline">
            add your name and date
          </Link>
          .
        </p>
      }
      faqItems={PASSPORT_FAQ}
      dateModified="2026-11-01"
    />
  );
}
