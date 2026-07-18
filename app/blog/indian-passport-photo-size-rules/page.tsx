import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("indian-passport-photo-size-rules")!;

const GETTING_STARTED = "https://www.passportindia.gov.in/psp/GettingStarted";
const APPLY = "https://www.passportindia.gov.in/psp/Apply";
const MINOR_GUIDELINES =
  "https://www.passportindia.gov.in/AppOnlineProject/pdf/GUIDELINES%20FOR%20CAPTURING%20PHOTOGRAPHS%20FOR%20MINORS_v2.1.pdf";
const OVERSEAS_GUIDELINES =
  "https://portal4.passportindia.gov.in/Online/pdf/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf";
const OCI_FAQ = "https://ociservices.gov.in/onlineOCI/onlineOCI/faq";
const EVISA_GUIDANCE = "https://indianvisaonline.gov.in/evisa/tvoa.html";

const FAQ_ITEMS = [
  {
    q: "Is the Indian passport photo size 35 × 45 mm or 2 × 2 inches?",
    a: "For an ordinary passport applicant below four years, Passport Seva requires a 45 × 35 mm printed photo on a white background. Ordinary adult applicants in India are photographed at the PSK/POPSK instead of supplying a photo. A 2 × 2 inch square is used by other services, including OCI, not by the under-four passport-photo exception.",
  },
  {
    q: "What digital photo size does an ordinary adult upload to Passport Seva?",
    a: "None. The current ordinary domestic fresh/reissue workflow does not include a passport-photo upload. Passport Seva obtains the adult applicant's photograph and biometrics at the PSK/POPSK.",
  },
  {
    q: "Where does the 630 × 810 pixel size apply?",
    a: "The current Passport Seva at Indian Embassies ICAO guidance specifies 630 × 810 pixels for photograph capture or upload in the overseas mission workflow. It should not be described as the ordinary domestic PSK/POPSK upload size.",
  },
  {
    q: "Can the same photo be used for OCI or an Indian e-Visa?",
    a: "Do not assume so. OCI and e-Visa use separate square digital specifications. OCI requires a plain light-coloured background that is not white, while the e-Visa guidance allows a plain light-coloured or white background.",
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
        There is no universal photo file that every Indian passport applicant
        uploads. The correct requirement depends on the workflow: adult domestic
        applicants are photographed at the PSK/POPSK, children below four carry a
        45 × 35 mm print, and overseas missions use separate ICAO guidance.
      </p>

      <h2>Indian passport photo size at a glance</h2>

      <div className="my-6 overflow-x-auto rounded-xl border border-hairline text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-accent/30">
              <th className="px-4 py-3 text-left font-semibold text-ink">Workflow</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Photo requirement</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">Confirmed format</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Adult fresh/reissue in India</td>
              <td className="px-4 py-3 text-ink-soft">Captured with biometrics at PSK/POPSK</td>
              <td className="px-4 py-3 text-ink-soft">No uploaded or carried photo</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Child below four</td>
              <td className="px-4 py-3 text-ink-soft">Carry a recent colour print</td>
              <td className="px-4 py-3 text-ink-soft">45 × 35 mm, white background</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">Overseas mission</td>
              <td className="px-4 py-3 text-ink-soft">Follow selected mission&apos;s filing steps</td>
              <td className="px-4 py-3 text-ink-soft">ICAO guide: 630 × 810 px, white</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="px-4 py-3 font-medium text-ink">OCI</td>
              <td className="px-4 py-3 text-ink-soft">Square digital upload</td>
              <td className="px-4 py-3 text-ink-soft">200–900 px, up to 200 KB</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Indian e-Visa</td>
              <td className="px-4 py-3 text-ink-soft">Square digital upload</td>
              <td className="px-4 py-3 text-ink-soft">JPEG, 10 KB–1 MB</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Adult domestic applications: no photo upload or print</h2>

      <p>
        Passport Seva&apos;s{" "}
        <a href={GETTING_STARTED} target="_blank" rel="noopener noreferrer">
          Getting Started page
        </a>{" "}
        says applicants must appear at the PSK/POPSK so the Passport Issuing
        Authority can obtain their photographs and biometrics. Its visit guidance
        also states that a photograph is not required.
      </p>

      <p>
        The online form, payment and appointment booking happen before the visit,
        but that does not make the process a passport-photo upload workflow. This
        distinction applies to ordinary adult fresh and reissue applications,
        including Tatkaal appointments.
      </p>

      <h2>Children below four: 45 × 35 mm printed photo</h2>

      <p>
        The{" "}
        <a href={APPLY} target="_blank" rel="noopener noreferrer">
          Passport Seva fresh/reissue instructions
        </a>{" "}
        identify the exception: a minor applicant below four must carry a recent
        passport-size photograph measuring <strong>4.5 × 3.5 cm</strong> with a
        white background. Written as height × width, that is{" "}
        <strong>45 × 35 mm</strong>.
      </p>

      <p>
        The official{" "}
        <a href={MINOR_GUIDELINES} target="_blank" rel="noopener noreferrer">
          under-four photograph guidelines
        </a>{" "}
        specify a colour photo, white background, frontal and centred view, open
        eyes, even lighting, no background shadow and 80–85% face coverage. These
        composition rules belong to the printed-photo exception; they should not
        be turned into an adult domestic upload requirement.
      </p>

      <h2>Overseas mission applications: 630 × 810 pixels</h2>

      <p>
        Indian embassies and consulates use a separate passport service. Their{" "}
        <a href={OVERSEAS_GUIDELINES} target="_blank" rel="noopener noreferrer">
          current ICAO photograph guidance
        </a>{" "}
        specifies a colour photograph measuring <strong>630 × 810 pixels</strong>,
        with a white background and the face occupying 80–85% of the photograph.
        It describes photographs being captured or uploaded.
      </p>

      <p>
        That official PDF does not publish the previously claimed 250 KB cap.
        The site therefore treats the stored 10–250 KB setting as an unverified,
        conditional compatibility output—not as an ordinary Passport Seva rule.
        Applicants abroad should follow the instructions for their selected
        mission or service provider.
      </p>

      <h2>OCI and e-Visa use different square photos</h2>

      <p>
        The{" "}
        <a href={OCI_FAQ} target="_blank" rel="noopener noreferrer">
          OCI Services FAQ
        </a>{" "}
        requires a square photo at least 51 × 51 mm, with equal pixel height and
        width from 200 to 900 pixels, JPEG/JPG, up to 200 KB. Its background must
        be plain and light-coloured, but not white.
      </p>

      <p>
        The{" "}
        <a href={EVISA_GUIDANCE} target="_blank" rel="noopener noreferrer">
          Indian e-Visa instructions
        </a>{" "}
        require a square JPEG between 10 KB and 1 MB and allow a plain
        light-coloured or white background. This service is for foreign nationals
        applying for an Indian e-Visa, not Indian citizens applying for a passport.
      </p>

      <h2>Using the India photo maker accurately</h2>

      <p>
        Use the{" "}
        <Link href="/india-passport-photo-maker/">India passport photo maker</Link>{" "}
        to prepare the 45 × 35 mm under-four print or as a visual preparation
        reference. It is not a required photo-upload step for an ordinary adult
        domestic passport application. Use the dedicated OCI or Indian e-Visa
        preset for those services.
      </p>

      <p>
        For the fuller workflow explanation, see the{" "}
        <Link href="/blog/indian-passport-photo-requirements/">
          Indian passport photo requirements guide
        </Link>
        . Always check the current instructions for the application channel that
        will actually process the case.
      </p>
    </BlogPostLayout>
  );
}
