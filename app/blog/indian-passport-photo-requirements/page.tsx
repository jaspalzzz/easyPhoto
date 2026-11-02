import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { Faq } from "@/components/site/Faq";
import { getPost } from "@/lib/blog";

const post = getPost("indian-passport-photo-requirements")!;

const PASSPORT_SEVA_GETTING_STARTED =
  "https://www.passportindia.gov.in/psp/GettingStarted";
const PASSPORT_SEVA_APPLY = "https://www.passportindia.gov.in/psp/Apply";
const MINOR_PHOTO_GUIDELINES =
  "https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf";
const OVERSEAS_PASSPORT_PORTAL = "https://mportal.passportindia.gov.in/mission/";
const OVERSEAS_PHOTO_GUIDELINES =
  "https://portal4.passportindia.gov.in/Online/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf";
const OCI_FAQ = "https://ociservices.gov.in/onlineOCI/onlineOCI/faq";
const EVISA_GUIDANCE = "https://indianvisaonline.gov.in/evisa/tvoa.html";

const FAQ_ITEMS = [
  {
    q: "Do ordinary adult applicants upload or carry a passport photo to a PSK or POPSK?",
    a: "No. Passport Seva says applicants attend the PSK or POPSK so their photograph and biometrics can be taken there, and its visit guidance says a photograph is not required. This covers fresh and reissue applications made in India.",
  },
  {
    q: "Is 630 × 810 px the Passport Seva upload size?",
    a: "Not for an application made in India, where there is no photo upload. 630 × 810 px is the size in the ICAO photograph guidance for passport applications made through Indian embassies and consulates abroad.",
  },
];

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: "/blog/" + post.slug + "/",
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout slug={post.slug} faqItems={FAQ_ITEMS}>
      <p>
        Whether you need a passport photo at all depends on who is applying and
        where. For an adult applying for a fresh or reissued ordinary passport
        in India, the photograph and biometrics are taken at the Passport Seva
        Kendra (PSK) or Post Office Passport Seva Kendra (POPSK). You don&apos;t
        upload a photo with the online form and you don&apos;t carry prints.
      </p>

      <p>
        Passport Seva says so in two places: its{" "}
        <a href={PASSPORT_SEVA_GETTING_STARTED} target="_blank" rel="noopener noreferrer">
          Getting Started guidance
        </a>{" "}
        says applicants attend the centre so their photographs and biometrics can
        be taken there, and the PSK/POPSK visit section says{" "}
        <q>Photograph is not required.</q> The online part is for filling in the
        form, paying and booking an appointment, for normal and Tatkaal
        applications alike. Check the{" "}
        <a href={PASSPORT_SEVA_APPLY} target="_blank" rel="noopener noreferrer">
          fresh and reissue instructions
        </a>{" "}
        and the Document Advisor for the papers to bring.
      </p>

      <h2>Which photo step applies to you?</h2>

      <div className="my-6 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Application</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Photo step</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Adult fresh or reissue, in India</td>
              <td className="px-4 py-3 text-ink-soft">Taken at the PSK/POPSK; nothing to prepare</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Child below four</td>
              <td className="px-4 py-3 text-ink-soft">One recent print, 35 mm wide × 45 mm high, white background</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Through an Indian mission abroad</td>
              <td className="px-4 py-3 text-ink-soft">630 × 810 px ICAO photo; the mission sets how it is handed in</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">OCI or Indian e-Visa</td>
              <td className="px-4 py-3 text-ink-soft">Square photo uploaded online, with its own rules</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Children below four: a printed photo</h2>

      <p>
        Passport Seva makes one exception: for an applicant below four years,
        carry a recent passport-size colour photograph measuring{" "}
        <strong>4.5 × 3.5 cm</strong> (45&nbsp;mm high, 35&nbsp;mm wide) with a{" "}
        <strong>white background</strong>. The official{" "}
        <a href={MINOR_PHOTO_GUIDELINES} target="_blank" rel="noopener noreferrer">
          photograph guidelines for children below four
        </a>{" "}
        add a frontal, centred colour image, open eyes, even lighting, no
        shadow on the background and the face covering 80–85% of the photo. The{" "}
        <Link href="/india-passport-photo-maker/">India passport photo maker</Link>{" "}
        crops to that print size in your browser.
      </p>

      <h2>Applying through an Indian mission abroad</h2>

      <p>
        Indians living abroad apply through Indian missions and posts. The{" "}
        <a href={OVERSEAS_PASSPORT_PORTAL} target="_blank" rel="noopener noreferrer">
          Passport Seva at Indian Embassies and Consulates portal
        </a>{" "}
        asks you to pick your country or region first, because the filing steps
        differ by mission. Since 1 September 2025, those applications need
        ICAO-compliant photographs: the{" "}
        <a href={OVERSEAS_PHOTO_GUIDELINES} target="_blank" rel="noopener noreferrer">
          overseas ICAO photograph guidance
        </a>{" "}
        asks for a colour image of <strong>630 × 810 pixels</strong>, a white
        background and 80–85% face coverage. Check your mission&apos;s page for
        whether it takes the photo there or wants you to bring or upload one.
      </p>

      <h2>OCI and e-Visa photos are different again</h2>

      <p>
        The{" "}
        <a href={OCI_FAQ} target="_blank" rel="noopener noreferrer">
          official OCI FAQ
        </a>{" "}
        asks for an uploaded square photograph: at least 51 × 51 mm, 200–900
        pixels on each side, JPEG/JPG, no more than 200 KB, on a plain
        light-coloured background that is not white. The{" "}
        <a href={EVISA_GUIDANCE} target="_blank" rel="noopener noreferrer">
          Indian e-Visa guidance
        </a>{" "}
        also wants a square JPEG, but between 10 KB and 1 MB, and allows a white
        background. Make each from your original photo rather than reusing the
        passport crop; the photo maker has a separate option for each.
      </p>

      <p>
        easyPhoto is not a government service. It can set a photo&apos;s size,
        crop and background, but it cannot confirm your documents, eligibility
        or the decision on your application.
      </p>
      <div className="mt-12">
        <Faq items={FAQ_ITEMS} noSchema />
      </div>
    </BlogPostLayout>
  );
}
