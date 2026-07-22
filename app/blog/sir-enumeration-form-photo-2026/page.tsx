import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("sir-enumeration-form-photo-2026")!;

const FAQ_ITEMS = [
  {
    q: "Do I need to upload a photo for the SIR enumeration form?",
    a: "No. The online SIR enumeration form is submitted through an Aadhaar-matched login and e-Sign with a mobile OTP — there is no photo-upload step in that flow. The paper form distributed by your Booth Level Officer is pre-printed with the photograph already on the electoral roll.",
  },
  {
    q: "What is the SIR photo size in KB or pixels?",
    a: "The Election Commission publishes no SIR-specific photo size, KB limit, pixel dimension, format or DPI. Pages quoting an exact figure such as \"35×45 mm, 200 KB\" are not citing an official SIR requirement. Treat any precise number with caution and check your state CEO or your BLO.",
  },
  {
    q: "When do I actually need a recent photo during SIR?",
    a: "Only in a narrow case: if the photograph pre-printed on your paper enumeration form is wrong or outdated, ECI guidance says a recent photograph may be affixed — and even then the Commission has clarified it is not mandatory. A fresh photo is a genuine requirement when you file a new registration (Form 6) or a correction (Form 8), which use the standard voter photograph.",
  },
  {
    q: "Is attaching a photo to the enumeration form mandatory?",
    a: "No. The Election Commission has clarified that enumeration forms are accepted without an affixed photograph.",
  },
];

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout
      slug={post.slug}
      faqItems={FAQ_ITEMS}
      ctaHref="/exam-requirements/voter-id/"
      ctaLabel="Prepare a voter (Form 6) photo"
    >
      <p>
        With the Special Intensive Revision (SIR) of electoral rolls underway, millions of
        people are searching for a &ldquo;SIR photo size.&rdquo; The honest answer is that
        the online enumeration form has no photo-upload step, and the Election Commission
        publishes no SIR photo specification at all. This guide separates what is actually
        required from what some sites have invented to farm the search.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            <strong>Online form:</strong> no photo upload — login (Aadhaar-matched), fill
            details, e-Sign, OTP
          </li>
          <li>
            <strong>Paper form:</strong> pre-printed with the photo already on the roll
          </li>
          <li>
            <strong>Official SIR photo size:</strong> none published — no KB, pixel, format
            or DPI rule
          </li>
          <li>
            <strong>When a photo applies:</strong> a new registration (Form&nbsp;6) or a
            correction (Form&nbsp;8), which use the standard voter photo
          </li>
        </ul>
      </div>

      <p className="text-sm text-muted-foreground">
        As of SIR Phase&nbsp;2 (late 2025–2026), per the CEO Delhi SIR FAQ and ECI
        guidance. The process is set by the Election Commission and can change — confirm
        the current instruction with your Booth Level Officer (BLO) or your state Chief
        Electoral Officer.
      </p>

      <h2>What the online SIR form actually asks for</h2>

      <p>
        The ECINET online enumeration facility is open to electors whose electoral-roll
        name matches their Aadhaar. After you log in, you fill the details shown on the
        page, the system takes you to an e-Sign step, an OTP is sent to your registered
        mobile number, and on entering it the form is submitted. There is{" "}
        <strong>no image-upload step anywhere in that flow.</strong> You can read the
        official wording in the{" "}
        <a
          href="https://ceodelhi.gov.in/PDFFolders/2026/FAQ_SIR2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          CEO Delhi SIR 2026 FAQ
        </a>
        . The paper form distributed by your BLO is already pre-printed with the photograph
        held on the electoral roll.
      </p>

      <h2>The one case where a recent photo is relevant</h2>

      <p>
        ECI guidance for the paper form says a recent photograph should be affixed{" "}
        <strong>only if the photo already printed on your enumeration form is wrong or
        outdated.</strong> Even then, the Commission has publicly clarified that attaching a
        photo is not mandatory — forms are accepted without one. There is no published size,
        KB or format rule for this; an ordinary passport-style photograph is what is
        expected, and no exact figure is officially specified.
      </p>

      <h2>If you are correcting or adding a voter record</h2>

      <p>
        SIR is a revision of existing entries. If your situation is a{" "}
        <strong>new registration</strong> (a fresh Form&nbsp;6) or a{" "}
        <strong>correction or photo replacement</strong> (Form&nbsp;8), that does use the
        standard voter (EPIC) photograph — and that is a genuine, published requirement: a
        recent, good-quality, unsigned colour photo on a plain light background. For the full
        ECI/Form&nbsp;6 detail see our{" "}
        <Link href="/blog/voter-id-photo-requirements-2026/" className="text-brand underline">
          Voter ID photo requirements guide
        </Link>
        . If you need to crop or size that photo, the{" "}
        <Link href="/exam-requirements/voter-id/" className="text-brand underline">
          voter ID photo tool
        </Link>{" "}
        prepares it entirely in your browser — nothing is uploaded.
      </p>

      <h2>A note on &ldquo;SIR photo size&rdquo; pages</h2>

      <p>
        Because so many people are searching during SIR, several sites have published pages
        quoting a precise &ldquo;SIR photo size&rdquo; and pointing to a resizer. Treat an
        exact KB or pixel figure with caution: the enumeration process we can verify against
        the ECI source does not require a photo upload and does not publish such a spec. When
        a number can decide whether an official form is accepted, we would rather show you the
        source and the uncertainty than repeat a figure the Election Commission has not
        published.
      </p>

      <div className="my-8 rounded-xl border border-hairline bg-paper p-5">
        <h3 className="!mt-0 text-base font-semibold text-ink">What is verifiable vs. what is not</h3>
        <p className="!mb-0 !mt-2 text-sm leading-relaxed text-ink-soft">
          Verifiable from the ECI source: the online enumeration form uses Aadhaar-matched
          login and e-Sign with no photo upload, and no SIR photo size is published. Not
          established anywhere official: a specific &ldquo;SIR photo&rdquo; KB, pixel, format
          or DPI value. The genuine photo requirement lives in the standard voter forms
          (Form&nbsp;6 / Form&nbsp;8), not in SIR itself.
        </p>
      </div>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
