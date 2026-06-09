import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { UnlockPdfTool } from "@/components/tools/UnlockPdfTool";

export const metadata = pageMetadata({
  title: "Aadhaar PDF Password — Open & Unlock Your e-Aadhaar (Free)",
  titleAbsolute: true,
  description:
    "The e-Aadhaar PDF password is the first 4 letters of your name in CAPITALS + your birth year (e.g. RAVI1998). Open it, then remove the password to get an unprotected copy — free and 100% private, in your browser.",
  path: "/unlock-aadhaar-pdf/",
});

const STEPS = [
  "Download your e-Aadhaar from the UIDAI site (it comes as a password-protected PDF).",
  "Upload it below and enter the password when asked.",
  "Download the unprotected copy — ready to print, view or upload anywhere.",
];

const FAQS: FaqItem[] = [
  {
    q: "What is the password to open the Aadhaar PDF?",
    a: "The e-Aadhaar PDF password is the first 4 letters of your name in CAPITAL letters followed by your year of birth (YYYY). For example, if your name is Ravi Kumar and you were born in 1998, the password is RAVI1998.",
  },
  {
    q: "How do I remove the password from my Aadhaar PDF?",
    a: "Upload the PDF above, enter the password to open it, and download the unprotected copy. The password is removed from the new file. Everything happens in your browser — your Aadhaar is never uploaded.",
  },
  {
    q: "Aadhaar PDF ka password kaise khole?",
    a: "Aadhaar PDF ka password aapke naam ke pehle 4 letters (CAPITAL me) + birth year hota hai — jaise RAVI1998. Upar PDF upload kare, password daale, aur bina-password wali copy download kar le. Sab kuch aapke browser me hota hai, kahin upload nahi hota.",
  },
  {
    q: "Is it safe to open my Aadhaar here?",
    a: "Yes. Your Aadhaar PDF and its password are processed entirely on your device and are never uploaded to any server. Nothing leaves your browser.",
  },
  {
    q: "What if I forget my Aadhaar PDF password?",
    a: "It's always the first 4 letters of your name as printed on Aadhaar (in CAPITALS) plus your 4-digit birth year. If your name is shorter than 4 letters, use the full name in capitals followed by the year.",
  },
];

export default function Page() {
  return (
    <div className="container max-w-3xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Unlock PDF", path: "/tools/unlock-pdf/" },
            { name: "e-Aadhaar PDF", path: "/unlock-aadhaar-pdf/" },
          ]),
          softwareApplicationSchema({
            name: "Open & Unlock e-Aadhaar PDF",
            description:
              "Open a password-protected e-Aadhaar PDF and remove the password for an unprotected copy — free, private, in your browser.",
            url: "/unlock-aadhaar-pdf/",
          }),
        ]}
      />

      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <Link href="/tools/unlock-pdf/" className="hover:text-foreground">Unlock PDF</Link>
        <span aria-hidden className="text-ink-faint">/</span>
        <span className="text-foreground">e-Aadhaar</span>
      </nav>

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          Open &amp; Unlock Your e-Aadhaar PDF
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The e-Aadhaar you download from UIDAI is a password-protected PDF. Here&apos;s the
          password, and how to remove it for an unprotected copy you can print, view or upload —
          free, and entirely in your browser.
        </p>
      </header>

      {/* The password — the single thing most people are searching for */}
      <div className="flex items-start gap-3 rounded-lg border border-brand/25 bg-brand-soft/20 p-4 sm:p-5">
        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
        <div className="text-sm">
          <p className="font-semibold text-foreground">Your e-Aadhaar PDF password</p>
          <p className="mt-1 text-muted-foreground">
            First <strong>4 letters of your name in CAPITALS</strong> + your{" "}
            <strong>year of birth</strong>. Example: name <em>Ravi Kumar</em>, born 1998 →{" "}
            <code className="rounded bg-card px-1.5 py-0.5 font-mono text-[13px]">RAVI1998</code>
          </p>
        </div>
      </div>

      <UnlockPdfTool />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How to open your e-Aadhaar PDF</h2>
        <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-hairline-strong text-[11px] font-semibold text-ink-soft">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <p className="flex items-start gap-2 text-xs text-ink-soft">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
          Your Aadhaar and its password never leave your device — all processing is in your browser.
        </p>
      </section>

      <section>
        <Faq items={FAQS} />
      </section>
    </div>
  );
}
