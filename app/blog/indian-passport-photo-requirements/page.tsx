import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("indian-passport-photo-requirements")!;

const PASSPORT_SEVA_GETTING_STARTED =
  "https://www.passportindia.gov.in/psp/GettingStarted";
const PASSPORT_SEVA_APPLY = "https://www.passportindia.gov.in/psp/Apply";
const MINOR_PHOTO_GUIDELINES =
  "https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf";
const OVERSEAS_PASSPORT_PORTAL = "https://embassy.passportindia.gov.in/";
const OVERSEAS_PHOTO_GUIDELINES =
  "https://portal4.passportindia.gov.in/Online/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf";
const OCI_FAQ = "https://ociservices.gov.in/onlineOCI/onlineOCI/faq";
const EVISA_GUIDANCE = "https://indianvisaonline.gov.in/evisa/tvoa.html";

const FAQ_ITEMS = [
  {
    q: "Do ordinary adult applicants upload or carry a passport photo to a PSK or POPSK?",
    a: "No. Passport Seva says applicants attend the PSK or POPSK so their photograph and biometrics can be obtained there, and its visit guidance says a photograph is not required. This applies to the ordinary domestic fresh/reissue workflow.",
  },
  {
    q: "When is a printed photo required for an ordinary Indian passport application?",
    a: "For a child below four years, Passport Seva instructs the applicant to carry a recent 4.5 × 3.5 cm (45 × 35 mm) photograph with a white background. The ordinary adult domestic workflow does not require a print.",
  },
  {
    q: "Is 630 × 810 px the ordinary Passport Seva upload size?",
    a: "No current official source was found for a 630 × 810 px, under-250 KB upload in the ordinary domestic PSK/POPSK workflow. The current 630 × 810 px instruction is published for ICAO-compliant passport photographs submitted through Indian embassies and consulates abroad. Follow the instructions for the workflow and mission handling your application.",
  },
  {
    q: "Do OCI and Indian e-Visa applications use the passport workflow?",
    a: "No. OCI and e-Visa are separate online services with their own photo uploads and specifications. OCI uses a square photograph on a plain light-coloured, non-white background; the Indian e-Visa also uses a square digital photograph but permits a plain light-coloured or white background.",
  },
  {
    q: "What can the photo maker be used for?",
    a: "It can prepare the 45 × 35 mm white-background print needed for a child below four, and separate presets can help prepare OCI, e-Visa and other-country photos. It is not a mandatory photo-upload step for an ordinary adult Indian passport application.",
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
        The ordinary Indian passport workflow depends on the applicant and where
        the application is processed. For an adult applying for a fresh or
        reissued ordinary passport in India, the photograph and biometrics are
        captured at the Passport Seva Kendra (PSK) or Post Office Passport Seva
        Kendra (POPSK). The applicant does not upload a passport photograph with
        the online form and does not need to carry printed photographs.
      </p>

      <p>
        Passport Seva states this in two places: its{" "}
        <a href={PASSPORT_SEVA_GETTING_STARTED} target="_blank" rel="noopener noreferrer">
          Getting Started guidance
        </a>{" "}
        says applicants attend the centre so their photographs and biometrics can
        be obtained there, and the PSK/POPSK visit section says{" "}
        <q>Photograph is not required.</q>
      </p>

      <h2>Which Indian passport photo workflow applies?</h2>

      <div className="my-6 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Application</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Photo step</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">What to follow</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Adult fresh/reissue in India</td>
              <td className="px-4 py-3 text-ink-soft">Photo and biometrics captured at PSK/POPSK</td>
              <td className="px-4 py-3 text-ink-soft">No photo upload or print required</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Child below four</td>
              <td className="px-4 py-3 text-ink-soft">Carry one recent printed photograph</td>
              <td className="px-4 py-3 text-ink-soft">45 × 35 mm, white background</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Indian mission or consulate abroad</td>
              <td className="px-4 py-3 text-ink-soft">Mission-specific capture or upload process</td>
              <td className="px-4 py-3 text-ink-soft">Overseas portal and local mission instructions</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">OCI</td>
              <td className="px-4 py-3 text-ink-soft">Square photograph uploaded online</td>
              <td className="px-4 py-3 text-ink-soft">OCI Services photo specification</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Indian e-Visa</td>
              <td className="px-4 py-3 text-ink-soft">Square photograph uploaded online</td>
              <td className="px-4 py-3 text-ink-soft">Indian Visa Online e-Visa guidance</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Ordinary adult fresh and reissue applications in India</h2>

      <p>
        The online portion is used to complete the application, pay and book an
        appointment. It is not a passport-photo upload step. The applicant then
        attends the PSK or POPSK with the required original documents and copies;
        staff capture the photograph and biometrics at the centre. The same core
        process applies to normal and Tatkaal appointments and to fresh and
        reissue applications.
      </p>

      <p>
        Before attending, use the{" "}
        <a href={PASSPORT_SEVA_APPLY} target="_blank" rel="noopener noreferrer">
          current Passport Seva fresh/reissue instructions
        </a>{" "}
        and Document Advisor for the documents relevant to your case. Do not add
        a digital photo or printed-photo task unless those instructions identify
        a specific exception.
      </p>

      <h2>Children below four: keep the 35 × 45 mm print</h2>

      <p>
        Passport Seva makes a specific exception for minor applicants below four
        years: carry a recent passport-size colour photograph measuring{" "}
        <strong>4.5 × 3.5 cm (45 × 35 mm)</strong> with a{" "}
        <strong>white background</strong>. This confirmed printed dimension remains
        valid and should not be presented as a requirement for every applicant.
      </p>

      <p>
        The official{" "}
        <a href={MINOR_PHOTO_GUIDELINES} target="_blank" rel="noopener noreferrer">
          photograph guidelines for children below four
        </a>{" "}
        also specify a frontal, centred colour image, open eyes, even lighting,
        no background shadow and face coverage of 80–85% of the photograph.
        These points describe the under-four printed-photo exception.
      </p>

      <h2>Overseas applications are a separate workflow</h2>

      <p>
        Passport services for Indians living abroad are handled through Indian
        missions and posts. The{" "}
        <a href={OVERSEAS_PASSPORT_PORTAL} target="_blank" rel="noopener noreferrer">
          Passport Seva at Indian Embassies and Consulates portal
        </a>{" "}
        says ICAO-compliant photographs have been required for passport
        applications from 1 September 2025 and directs applicants to select their
        country or region.
      </p>

      <p>
        The linked{" "}
        <a href={OVERSEAS_PHOTO_GUIDELINES} target="_blank" rel="noopener noreferrer">
          overseas ICAO photograph guidance
        </a>{" "}
        specifies a colour image of <strong>630 × 810 pixels</strong>, white
        background and 80–85% face coverage for photograph capture or upload.
        It does not establish a 250 KB limit for the ordinary domestic workflow.
        Check the selected mission&apos;s current filing instructions because the
        hand-off and submission method can vary by location.
      </p>

      <h2>OCI and e-Visa photos are not Indian passport photos</h2>

      <p>
        The{" "}
        <a href={OCI_FAQ} target="_blank" rel="noopener noreferrer">
          official OCI FAQ
        </a>{" "}
        requires an uploaded square photograph: at least 51 × 51 mm, equal height
        and width, 200–900 pixels, JPEG/JPG, no more than 200 KB, with a plain
        light-coloured background that is not white.
      </p>

      <p>
        The{" "}
        <a href={EVISA_GUIDANCE} target="_blank" rel="noopener noreferrer">
          official Indian e-Visa guidance
        </a>{" "}
        also requires a digital square JPEG, but its live instructions set a
        10 KB–1 MB file range and allow a plain light-coloured or white
        background. OCI and e-Visa presets must therefore stay separate from the
        Indian passport preset.
      </p>

      <h2>Where the photo maker is useful</h2>

      <p>
        The{" "}
        <Link href="/india-passport-photo-maker/">India passport photo maker</Link>{" "}
        can prepare the 45 × 35 mm white-background print for a child below four.
        It can also provide a visual preparation reference, but an ordinary adult
        domestic applicant&apos;s actual passport photograph is captured at the
        PSK/POPSK.
      </p>

      <p>
        For an OCI or e-Visa application, select the dedicated specification for
        that service instead of reusing the passport crop. For another country,
        choose that country&apos;s current passport or visa preset and confirm the
        issuing authority&apos;s instructions before submitting.
      </p>

      <p>
        This site is not a government service. It can prepare measurable image
        properties, but it cannot confirm identity, documents, eligibility or an
        application decision.
      </p>
    </BlogPostLayout>
  );
}
