import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck, EyeOff, LockOpen } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID, faqSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Faq, type FaqItem } from "@/components/site/Faq";

export const metadata = pageMetadata({
  title: "Aadhaar Photo: How to Change It (You Can't Upload One Online)",
  titleAbsolute: true,
  description:
    "Your Aadhaar photo is captured in person and can't be uploaded or changed online — here's how to actually update it at an Aadhaar centre, and the Aadhaar things you CAN do online (mask your number, open the password-protected PDF).",
  path: "/aadhaar-photo/",
});

const FAQS: FaqItem[] = [
  {
    q: "Can I change my Aadhaar photo online?",
    a: "No. UIDAI captures the Aadhaar photo live (it's a biometric) at an enrolment or update centre. There is no online photo upload — the myAadhaar portal only allows demographic updates (name, address, date of birth, mobile) and document uploads, not the photograph.",
  },
  {
    q: "How do I update my Aadhaar photo then?",
    a: "Visit an Aadhaar Seva Kendra or an authorised enrolment/update centre with your Aadhaar number. They recapture your photo (and biometrics) on the spot. There's a small biometric-update fee (around ₹100 — check the current UIDAI fee). No appointment is strictly required at most centres, but booking a slot on the UIDAI site can save time.",
  },
  {
    q: "Is there an 'Aadhaar photo maker' tool I can use?",
    a: "Be careful — any tool claiming to let you 'upload' or 'submit' an Aadhaar photo is misleading, because UIDAI doesn't accept self-uploaded photos. The only legitimate way to change it is in person at a centre.",
  },
  {
    q: "What CAN I do with my Aadhaar online and safely?",
    a: "Two genuinely useful things, both 100% in your browser with nothing uploaded: mask your Aadhaar number (hide the first 8 digits) before sharing a copy, and open/remove the password on the official e-Aadhaar PDF so you can view or print it.",
  },
];

export default function AadhaarPhotoPage() {
  return (
    <div className="container max-w-3xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Aadhaar Photo", path: "/aadhaar-photo/" },
          ]),
          {
            "@type": "WebPage",
            url: `${SITE_URL}/aadhaar-photo/`,
            name: `Aadhaar Photo — ${SITE_NAME}`,
            publisher: { "@id": ORG_ID },
          },
          faqSchema(FAQS),
        ]}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      <header className="space-y-3 border-b border-hairline pb-7">
        <span className="eyebrow block text-brand">Aadhaar</span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-[2.25rem]">
          Aadhaar Photo: How to Change It
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Looking to make or update your Aadhaar photo? Here&apos;s the honest
          answer most tools won&apos;t tell you — and the Aadhaar tasks you{" "}
          <em>can</em> do safely online.
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
          <li className="flex gap-2"><span className="font-semibold text-ink">1.</span> Go to an Aadhaar Seva Kendra or an authorised enrolment/update centre with your Aadhaar number.</li>
          <li className="flex gap-2"><span className="font-semibold text-ink">2.</span> Your photo (and biometrics) are recaptured on the spot — you don&apos;t bring or submit a photo.</li>
          <li className="flex gap-2"><span className="font-semibold text-ink">3.</span> Pay the small biometric-update fee (around ₹100 — confirm the current UIDAI fee).</li>
          <li className="flex gap-2"><span className="font-semibold text-ink">4.</span> The updated Aadhaar is generated after processing; you can download the e-Aadhaar online afterward.</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          The myAadhaar online portal handles name, address, date-of-birth and
          mobile updates — but not the photograph. Always confirm the process on{" "}
          <a href="https://uidai.gov.in" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            uidai.gov.in
          </a>.
        </p>
      </section>

      {/* The real, honest Aadhaar tools we DO offer */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          What you can do with Aadhaar online — safely, here
        </h2>
        <p className="text-sm text-muted-foreground">
          Both run entirely in your browser. Your Aadhaar is never uploaded.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/tools/mask-aadhaar/" className="ep-card group flex items-start gap-3 p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(142_55%_34%/0.12)] text-[hsl(142_55%_30%)] dark:bg-[hsl(142_55%_34%/0.20)] dark:text-[hsl(142_55%_60%)]">
              <EyeOff className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 font-semibold text-ink">
                Mask Aadhaar number
                <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" strokeWidth={1.75} />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                Hide the first 8 digits before sharing a copy — UIDAI&apos;s own
                recommendation.
              </span>
            </span>
          </Link>
          <Link href="/unlock-aadhaar-pdf/" className="ep-card group flex items-start gap-3 p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(215_70%_50%/0.12)] text-[hsl(215_70%_45%)] dark:bg-[hsl(215_70%_50%/0.20)] dark:text-[hsl(215_70%_70%)]">
              <LockOpen className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 font-semibold text-ink">
                Open e-Aadhaar PDF
                <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" strokeWidth={1.75} />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                Remove the password from the official e-Aadhaar PDF to view or
                print it.
              </span>
            </span>
          </Link>
        </div>
      </section>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Everything on easyPhoto runs in your browser — your documents never leave your device.
      </p>

      <section>
        <Faq items={FAQS} noSchema />
      </section>
    </div>
  );
}
