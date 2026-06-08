import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/ToolPage";
import { LinkedInPhotoTool } from "@/components/tools/LinkedInPhotoTool";
import type { FaqItem } from "@/components/site/Faq";

export const metadata = pageMetadata({
  title: "LinkedIn Photo Maker — Square Profile Picture, Free",
  description:
    "Turn any photo into a perfect LinkedIn profile picture: a square crop " +
    "centred on your face at 400×400 or larger. Free, private, and entirely " +
    "in your browser — nothing is uploaded.",
  path: "/tools/linkedin-photo/",
});

const FAQ: FaqItem[] = [
  {
    q: "What size should a LinkedIn profile photo be?",
    a: "LinkedIn profile photos are square, with a minimum of 400×400 pixels (and up to 7680×7680). This tool exports 400×400, 800×800 or 1000×1000 — 400×400 is the safe minimum, but a larger size looks sharper on high-resolution screens.",
  },
  {
    q: "Why does LinkedIn show my photo as a circle?",
    a: "LinkedIn stores a square image but displays it inside a circle. So your face needs to be centred, with a little headroom, or the circle can cut off the top of your head. This tool centres the crop on your face automatically.",
  },
  {
    q: "Does this tool change my background?",
    a: "No — it focuses on the correct square crop and size. If you want a clean, distraction-free background, run your photo through the Background Remover or White Background Maker first, then crop it here.",
  },
  {
    q: "Is the LinkedIn photo maker free and private?",
    a: "Yes. It is completely free, with no watermark and no sign-up. Your photo is processed entirely in your browser using on-device face detection and is never uploaded to any server.",
  },
  {
    q: "Can I make my LinkedIn photo on my phone?",
    a: "Yes. Open this page in your phone's browser, choose a photo from your gallery, pick a size and download — no app needed.",
  },
];

export default function Page() {
  return (
    <ToolPage
      title="LinkedIn Photo Maker"
      slug="linkedin-photo"
      path="/tools/linkedin-photo/"
      blurb="Upload any photo and get a square LinkedIn profile picture, automatically centred on your face — 400×400 (LinkedIn's minimum) or larger. Nothing is uploaded."
      faqItems={FAQ}
      footnote="Face detection and cropping run entirely in your browser. Your photo is never uploaded."
    >
      <LinkedInPhotoTool />
    </ToolPage>
  );
}
