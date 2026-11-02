import { ArrowRight, AlertTriangle, EyeOff, LockOpen } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID, faqSchema, type Crumb } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = pageMetadata({
  title: "Aadhaar Photo: How to Change It (You Can't Upload One Online)",
  titleAbsolute: true,
  description:
    "Your Aadhaar photo is captured in person and can't be uploaded or changed online — here's how to actually update it at an Aadhaar centre, and the Aadhaar things you CAN do online (mask your number, open the password-protected PDF).",
  path: "/aadhaar-photo/",
});

// Each answer adds something the page body doesn't already say (CLAUDE.md §3:
// never state the same fact twice). Fees change, so the page names no amount.
const FAQS: FaqItem[] = [
  {
    q: "Can I use my Aadhaar photo for an exam or job application?",
    a: "It's better not to. The printed Aadhaar photo is tiny, so it turns blurry when a form needs it bigger, and it may be years old while exam forms ask for a recent photo. Take a new passport-style photo instead.",
  },
];

export default function AadhaarPhotoPage() {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Aadhaar Photo", path: "/aadhaar-photo/" },
  ];

  return (
    <div className="container max-w-3xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          {
            "@type": "WebPage",
            url: `${SITE_URL}/aadhaar-photo/`,
            name: `Aadhaar Photo — ${SITE_NAME}`,
            publisher: { "@id": ORG_ID },
          },
          faqSchema(FAQS),
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-[36px]">
          Aadhaar Photo: How to Change It
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          How to get the photo on your Aadhaar changed, why no website can do it
          for you, and two Aadhaar tasks you <em>can</em> do online.
        </p>
      </header>

      {/* The honest headline, up top */}
      <div className="flex items-start gap-3 rounded-xl border border-[hsl(38_92%_50%/0.35)] bg-[hsl(38_92%_50%/0.08)] p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(32_80%_42%)] dark:text-[hsl(32_80%_62%)]" strokeWidth={1.9} />
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">You cannot upload or make your own
          Aadhaar photo.</strong>{" "}
          UIDAI captures it live as a biometric at an enrolment/update centre.
          Any &quot;Aadhaar photo maker&quot; that asks you to upload one is
          misleading — so we don&apos;t offer one.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          How to actually update your Aadhaar photo
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-2"><span className="font-semibold text-ink">1.</span> Go to an Aadhaar Seva Kendra or an authorised enrolment/update centre with your Aadhaar number. You can book a slot at a UIDAI-run Aadhaar Seva Kendra on the UIDAI website.</li>
          <li className="flex gap-2"><span className="font-semibold text-ink">2.</span> Your photo (and biometrics) are recaptured on the spot — you don&apos;t bring or submit a photo.</li>
          <li className="flex gap-2"><span className="font-semibold text-ink">3.</span> Pay the current biometric-update fee shown by UIDAI or the authorised centre.</li>
          <li className="flex gap-2"><span className="font-semibold text-ink">4.</span> The updated Aadhaar is generated after processing; you can download the e-Aadhaar online afterward.</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          The myAadhaar website has no option to change the photograph. Check the
          current process on{" "}
          <a href="https://uidai.gov.in" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            uidai.gov.in
          </a>.
        </p>
      </section>

      {/* The real, honest Aadhaar tools we DO offer */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Two Aadhaar tasks you can do online
        </h2>
        <p className="text-sm text-muted-foreground">
          Both use UIDAI&apos;s own e-Aadhaar download, so your Aadhaar never passes
          through any other website.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://myaadhaar.uidai.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="ep-card support group flex items-start gap-3 p-4"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(142_55%_34%/0.12)] text-[hsl(142_55%_30%)] dark:bg-[hsl(142_55%_34%/0.20)] dark:text-[hsl(142_55%_60%)]">
              <EyeOff className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 font-semibold text-ink">
                Download a masked Aadhaar
                <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" strokeWidth={1.75} />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                When you download e-Aadhaar on myAadhaar, choose the masked
                version: it hides the first 8 digits, so you can share a copy
                that shows only the last 4.
              </span>
            </span>
          </a>
          <div className="ep-card support flex items-start gap-3 p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(215_70%_50%/0.12)] text-[hsl(215_70%_45%)] dark:bg-[hsl(215_70%_50%/0.20)] dark:text-[hsl(215_70%_70%)]">
              <LockOpen className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="font-semibold text-ink">Open e-Aadhaar PDF</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                The password is the first four letters of your name in capitals
                followed by your year of birth, for example RAVI1998.
              </span>
            </span>
          </div>
        </div>
      </section>

      <section>
        <Faq items={FAQS} noSchema />
      </section>
    </div>
  );
}
