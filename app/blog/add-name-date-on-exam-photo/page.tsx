import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("add-name-date-on-exam-photo")!;

const SOURCES = {
  appsc:
    "https://psc.ap.gov.in/UserManuals/DirectRecruitmentOTPRUserManual.pdf",
  keralaPsc: "https://keralapsc.gov.in/index.php/tips-applicants",
  navy:
    "https://www.joinindiannavy.gov.in/files/Advt_Agniveer_MR_English.pdf",
  airforce:
    "https://iafrecruitment.edcil.co.in/agniveervayu/pdffiles/Advt%20Agniveervayu%2001%20of%2027.pdf",
  upsc:
    "https://upsconline.nic.in/ngrp/assets/PDF/instruction-photo-signature-upload-upsc.pdf",
  ssc: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cht_2026.pdf",
  ibps: "https://www.ibps.in/wp-content/uploads/Detailed-Notification-CRP-SPL-XVI_Final_V1_30.06.2026.pdf",
} as const;

const FAQ_ITEMS = [
  {
    q: "Does UPSC require the name and date to be printed on the photo?",
    a: "No. UPSC's current instructions list a 20–200 KB JPG photo upload, mandatory live photograph capture, and one 20–100 KB image containing three signatures stacked vertically. They do not list a name-and-date strip.",
  },
  {
    q: "What date should I put on a digital name-and-date strip?",
    a: "Use the date the photograph was taken, but only when the current application instructions ask for that date. Do not substitute the application date unless the notice says to do so.",
  },
  {
    q: "Which applications can use a digital name-and-date strip?",
    a: "The current APPSC Direct Recruitment OTPR manual and Kerala PSC guidance require the candidate's name and photography date on the image. Confirm the notice for the specific recruitment before preparing it.",
  },
  {
    q: "Should I add a digital strip for UPSC, SSC, IBPS, Navy Agniveer or Agniveervayu?",
    a: "Not for the current SSC, IBPS or UPSC workflows. Navy Agniveer and Agniveervayu notices instead require the candidate to hold a physical black slate with the name and photography date when the photo is taken; a digital strip does not replace that slate.",
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
      ctaHref="/tools/photo-with-name-date/"
      ctaLabel="Open the name-and-date tool"
      faqItems={FAQ_ITEMS}
    >
      <div className="mb-5 text-sm text-muted-foreground">
        Last reviewed 16 July 2026 · Checked against the linked authority instructions
      </div>
      <p>
        A digital name-and-date strip is needed only when the application
        instructions ask for one. The current APPSC Direct Recruitment manual
        and Kerala PSC guidance do; the current UPSC, SSC and IBPS instructions
        do not. Navy Agniveer and Agniveervayu use a different workflow: the
        candidate is photographed holding a physical black slate, so adding text
        afterward is not a substitute.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            Digital strip: APPSC Direct Recruitment OTPR and Kerala PSC currently
            ask for the candidate&apos;s name and photography date on the image.
          </li>
          <li>
            No strip listed: UPSC, SSC and IBPS current instructions.
          </li>
          <li>
            Physical slate: current Navy Agniveer and Agniveervayu notices; the
            slate must be present when the photo is taken.
          </li>
        </ul>
      </div>

      <h2>Before and after: what the digital tool changes</h2>
      <p>
        The <Link href="/tools/photo-with-name-date/">name-and-date tool</Link>{" "}
        adds a separate light strip below the photo and prints the entered name
        and photography date on it. Use that output only for a form whose current
        instructions call for digital text, then recheck the finished file&apos;s
        dimensions and size against that form.
      </p>

      <h2>Which workflows use a strip, slate or neither</h2>
      <div className="my-5 overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="py-2 pr-3 font-semibold text-ink">Application</th>
              <th className="py-2 pr-3 font-semibold text-ink">Current instruction</th>
              <th className="py-2 font-semibold text-ink">Authority source</th>
            </tr>
          </thead>
          <tbody className="text-ink-soft">
            {[
              [
                "APPSC Direct Recruitment OTPR",
                "Digital name and photography date printed on the photo",
                SOURCES.appsc,
                "APPSC OTPR user manual",
              ],
              [
                "Kerala PSC",
                "Digital name and photography date at the bottom of the photo",
                SOURCES.keralaPsc,
                "Kerala PSC applicant guidance",
              ],
              [
                "Navy Agniveer",
                "Physical black slate held in the photo; not a digital strip",
                SOURCES.navy,
                "Indian Navy Agniveer notice, paragraph 34",
              ],
              [
                "Agniveervayu",
                "Physical black slate held in the photo; not a digital strip",
                SOURCES.airforce,
                "IAF Intake 01/2027 notice, paragraph 43.3.1",
              ],
              [
                "UPSC",
                "No strip listed; uploaded photo, live photo and triple signature",
                SOURCES.upsc,
                "UPSC photo and signature instructions",
              ],
              [
                "SSC",
                "No strip listed; photograph captured live in the application",
                SOURCES.ssc,
                "SSC CHT 2026 notice, paragraphs 8.4–8.7",
              ],
              [
                "IBPS",
                "No strip listed; uploaded photo plus separate live photograph",
                SOURCES.ibps,
                "IBPS CRP-SPL XVI notice, Annexure III",
              ],
            ].map(([application, instruction, url, label]) => (
              <tr key={application} className="border-b border-hairline/60">
                <td className="py-2 pr-3 font-medium text-ink">{application}</td>
                <td className="py-2 pr-3">{instruction}</td>
                <td className="py-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand underline underline-offset-2"
                  >
                    {label}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Instructions can change by recruitment cycle. If a current notice does
        not mention a digital strip, do not infer one from an older guide or from
        another authority&apos;s form.
      </p>

      <h2>What a digital strip needs to contain</h2>
      <p>
        APPSC&apos;s Direct Recruitment OTPR manual says the photograph should have
        the candidate&apos;s name and the date it was taken printed on it. Kerala PSC
        says the name and photography date should be printed at the bottom. These
        sources do not create a universal font or date-format rule for other
        forms, so follow the current notice for the application you are preparing.
      </p>

      <figure className="my-7 overflow-hidden rounded-xl border border-hairline">
        <Image
          src="/images/add-name-date-on-exam-photo.webp"
          alt="Illustration comparing a plain portrait with one that has a candidate name and photography date in a strip below"
          width={1024}
          height={1024}
          className="h-auto w-full"
        />
        <figcaption className="bg-accent/30 px-4 py-2.5 text-center text-[12.5px] text-muted-foreground">
          A digital-strip example. Use it only when the current application
          instructions ask for text printed on the image.
        </figcaption>
      </figure>

      <h2>Why the workflows are easy to confuse</h2>
      <p>
        A digital strip and a slate photo both display a name and date, but they
        are not interchangeable. The strip is added to an existing image. A slate
        is a physical object held at chest level while the photograph is taken.
        UPSC&apos;s live-photo and triple-signature steps are different again and do
        not include either treatment.
      </p>

      <h2>How to prepare a digital strip when it is listed</h2>
      <p>
        For APPSC, Kerala PSC or another form that explicitly asks for digital
        text, the{" "}
        <Link href="/tools/photo-with-name-date/">
          photo with name &amp; date tool
        </Link>{" "}
        can add the strip on your device:
      </p>
      <ul>
        <li>Upload the photo you intend to use.</li>
        <li>Enter the candidate&apos;s name and the date the photograph was taken.</li>
        <li>Review the strip placement and export the JPG.</li>
        <li>Check the finished file against the current application instructions.</li>
      </ul>
      <p>
        The tool runs in the browser, so the photo, name and date are not sent to
        the site&apos;s server. The{" "}
        <Link href="/ssc-photo-with-name-date/">
          SSC photo with name and date page
        </Link>{" "}
        explains why current SSC applications do not use this strip.
      </p>

      <h2>Then check the relevant file limits</h2>
      <p>
        After adding a strip for a supported workflow, compare the finished file
        with the registry-backed guidance for{" "}
        <Link href="/exam-requirements/appsc/">APPSC</Link> or{" "}
        <Link href="/exam-requirements/kerala-psc/">Kerala PSC</Link>. For UPSC,
        use the <Link href="/exam-requirements/upsc/">UPSC requirements page</Link>{" "}
        and its linked instruction PDF instead of adding text.
      </p>

      <h2>Name-and-date troubleshooting</h2>
      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Problem</th>
            <th className="py-2 font-semibold text-ink">What to check</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {[
            [
              "The date is the application date",
              "Replace it with the photography date when that is what the current notice requests.",
            ],
            [
              "The strip covers the face or shoulders",
              "Re-crop with enough space, then regenerate the strip below the portrait.",
            ],
            [
              "Text becomes blurry after resizing",
              "Avoid repeatedly saving the JPEG; export the strip once, then make only the required final adjustment.",
            ],
            [
              "The notice asks for a slate photo",
              "Take a new photo with the physical slate present. Do not add a digital strip afterward.",
            ],
            [
              "The notice does not mention a name/date treatment",
              "Leave the photo plain and follow the workflow described by that authority.",
            ],
          ].map(([problem, check]) => (
            <tr key={problem} className="border-b border-hairline/60">
              <td className="py-2 pr-3 font-medium text-ink">{problem}</td>
              <td className="py-2">{check}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        For other measurable upload problems, see{" "}
        <Link href="/blog/why-exam-photo-signature-rejected/">
          why exam photos and signatures get rejected
        </Link>
        . The final decision remains with the recruiting authority, so confirm the
        current notice before submitting.
      </p>

      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
