import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { PhotoSignatureMergeTool } from "@/components/tools/PhotoSignatureMergeTool";
import { getTool } from "@/lib/toolsCatalog";

const tool = getTool("photo-signature-merge")!;

export const metadata = pageMetadata({
  // Searchers' own words (GSC 25 Sep – 12 Oct 2026): "merge photo and
  // signature", "photo sign merge", "photo and signature merge".
  title: "Merge Photo and Signature Online — One JPG, Free",
  description:
    "Merge your photo and signature into one JPG, photo above signature or side by side. " +
    "Then compress it to your form's KB limit. Free; nothing is uploaded.",
  path: `/tools/${tool.slug}/`,
});

export default function Page() {
  return (
    <ToolPage
      title="Merge Photo and Signature"
      slug={tool.slug}
      blurb={tool.blurb}
      faqItems={[
        {
          q: "Why would I need my photo and signature on one image?",
          a: "Some application and exam forms ask you to paste a photo and signature together in a single box, or to upload one combined image rather than two separate files. This tool composites them onto one clean white canvas so you can do that in one step.",
        },
        {
          q: "Should I choose stacked or side-by-side?",
          a: "Stacked (photo on top, signature below) matches the most common form layout where the photo box sits above the signature box. Choose side-by-side if your form has the two boxes next to each other. You can switch and re-merge instantly.",
        },
        {
          q: "Does it clean up my signature?",
          a: "Yes — the tool automatically trims the empty white space around your signature so it sits tight next to your photo, even if you scanned it on a large sheet of paper. For the cleanest result, sign in dark ink on plain white paper.",
        },
        {
          q: "My form has a KB limit. What do I do with the merged file?",
          a: "Download the merged JPG, then open it in the Compress to KB tool (linked under the result) and enter your form's limit. Merging adds the signature's pixels, so check the size even if your photo alone was under the limit.",
        },
        {
          q: "Is anything uploaded to a server?",
          a: "No. Both images are read and combined entirely in your browser using JavaScript and the HTML canvas. Neither your photo nor your signature ever leaves your device.",
        },
      ]}
    >
      <PhotoSignatureMergeTool />
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Need your signature written on the photo itself, not beside it? Use{" "}
        <Link href="/tools/sign-image/" className="font-medium text-brand hover:underline">
          sign on photo
        </Link>
        .
      </p>
    </ToolPage>
  );
}
