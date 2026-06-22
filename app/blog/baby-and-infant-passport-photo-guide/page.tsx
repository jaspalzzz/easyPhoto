import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("baby-and-infant-passport-photo-guide")!;

export const metadata = pageMetadata({
  title: `${post.title}`,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug}>
      <p>
        A baby can&apos;t sit up on command, hold a neutral expression or look at
        a lens. Yet the photo still has to meet the same compliance rules as an
        adult&apos;s. The good news is that countries relax a few rules for
        infants, and a plain white sheet plus a phone is all you need.
        Here&apos;s how to do it without a studio.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>Lay the baby on a plain white sheet and photograph straight down — the sheet doubles as the background.</li>
          <li>Eyes should be open; a calm, closed-mouth face is ideal but slight expressions are usually accepted for very young babies.</li>
          <li>No hands, toys, pacifiers or straps can be visible in the frame.</li>
          <li>Upload to the <Link href="/baby-passport-photo/" className="text-brand underline">baby passport photo maker</Link> to crop automatically to the correct size and background.</li>
        </ul>
      </div>

      <h2>What&apos;s relaxed for babies — and what isn&apos;t</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Requirement</th>
            <th className="py-2 pr-3 font-semibold text-ink">Adult rule</th>
            <th className="py-2 pr-3 font-semibold text-ink">Infant exception</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Expression</td>
            <td className="py-2 pr-3">Neutral, mouth closed</td>
            <td className="py-2 pr-3">Slight expression accepted; not crying</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Eyes</td>
            <td className="py-2 pr-3">Open and looking forward</td>
            <td className="py-2 pr-3">Open preferred; very young newborns often excused</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Background</td>
            <td className="py-2 pr-3">Plain, uniform colour</td>
            <td className="py-2 pr-3">Same rule — no patterns, no visible hands</td>
          </tr>
          <tr className="border-b border-hairline/60">
            <td className="py-2 pr-3 font-medium text-ink">Props / support</td>
            <td className="py-2 pr-3">Nothing visible</td>
            <td className="py-2 pr-3">Car seat allowed if plain; parent must not be visible</td>
          </tr>
        </tbody>
      </table>
      <p>
        The{" "}
        <a
          href="https://travel.state.gov/content/travel/en/passports/photos.html"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          U.S. State Department
        </a>{" "}
        confirms that for infant photos, eyes do not need to be fully open and
        the mouth may be slightly open — but the background and framing rules remain
        unchanged.
      </p>

      <h2>The lay-down method</h2>
      <p>
        The easiest setup is to lay the baby on their back on a plain white sheet
        or blanket with no patterns. Photograph straight down from above, keeping
        the phone parallel to the baby so the face isn&apos;t distorted.
      </p>
      <ul>
        <li>Smooth out wrinkles and crumbs in the sheet — they count as a busy background.</li>
        <li>Use soft daylight and turn off flash to avoid shadows and red-eye.</li>
        <li>Support the head if needed, but keep hands out of frame.</li>
        <li>Take many shots and pick the one with open eyes and a calm face.</li>
      </ul>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/baby-and-infant-passport-photo-guide.png"
          alt="Illustrated diagram of the lay-down passport photo method for babies: white sheet, baby lying flat facing up, adult holding smartphone directly above at 90 degrees"
          width={1024}
          height={1024}
          className="w-full h-auto"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          The lay-down method: baby on a smooth white sheet, photographer directly overhead at 90°, natural side lighting — no flash, no shadows.
        </figcaption>
      </figure>

      <h2>For an older infant who can sit</h2>
      <p>
        Sit the baby against a plain wall in a car seat or on a parent&apos;s lap
        draped with a plain white cloth (the parent must not be visible). Get down
        to their eye level and snap when they look toward the lens.
      </p>

      <h2>Crop and clean it up</h2>
      <p>
        Babies move, so you&apos;ll rarely frame it perfectly in-camera. Upload
        your best shot to the{" "}
        <Link href="/baby-passport-photo/">baby passport photo maker</Link>, and
        it crops to the correct head size and sets the right background. See the
        exact rules on your country page, such as{" "}
        <Link href="/us-passport-photo-maker/">US</Link>,{" "}
        <Link href="/india-passport-photo-maker/">India</Link> or{" "}
        <Link href="/uk-passport-photo-maker/">UK</Link>. If a stray shadow or
        off-white sheet shows, the{" "}
        <Link href="/tools/white-background/">white background tool</Link>{" "}
        cleans it up.
      </p>

      <h2>Then size it for the portal</h2>
      <p>
        For online applications, compress the final image to the upload limit
        with <Link href="/photo-resize-to-50kb/">resize to 50&nbsp;KB</Link> or
        a <Link href="/tools/resize-kb/">custom target</Link>. As always, the
        photo stays on your device.
      </p>

      <div className="mt-12">
        <Faq items={[
          {
            q: "Do babies need to have their eyes open in a passport photo?",
            a: "Most countries prefer open eyes but make allowances for very young infants. The U.S. State Department explicitly states that infant eyes do not need to be fully open. Aim for open eyes but don't discard a good photo if the eyes are slightly closed — the overall framing and background matter more.",
          },
          {
            q: "Can a parent's hands be visible if they're supporting the baby?",
            a: "No. The face must be clearly visible with no other people, hands, or props in the frame. If you need to support the baby's head, position your hands so they're out of frame or use a rolled towel hidden under the sheet.",
          },
          {
            q: "What if the white sheet has shadows behind the baby's head?",
            a: "Shadows are the main reason DIY baby photos fail. Use soft, diffuse daylight from the side and shoot in a well-lit room rather than under a ceiling light. If light shadows remain, the white background tool can often clean them without affecting the face.",
          },
          {
            q: "How do I get a baby to look at the camera?",
            a: "Attract their attention to just above the lens — a squeaky toy held by a helper above the camera works well. Timing helps more than positioning: take dozens of shots in a short burst and pick the best. A phone's burst mode makes this easy.",
          },
        ]} />
      </div>
    </BlogPostLayout>
  );
}
