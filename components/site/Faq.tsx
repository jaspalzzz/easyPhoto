import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: "Is my photo uploaded to a server?",
    a: "No. Every step (face detection, cropping, background replacement and file compression) runs entirely in your browser. Your image is never sent to or stored on any server.",
  },
  {
    q: "Is it really free? Is there a watermark?",
    a: "Yes, it's completely free with no watermark, no sign-up and no payment. You download the full-quality photo.",
  },
  {
    q: "What can the photo checks confirm?",
    a: "The tool can size the head, apply the selected background and review measurable image properties before download. It cannot predict acceptance. Check the linked source and the current application instructions before submitting.",
  },
  {
    q: "Why isn't the background pure white for the UK and Schengen?",
    a: "Because pure white is a common rejection reason there. UK guidance asks for a light grey or cream background, and a light grey is the safest universal choice for Schengen visas. We default to the correct colour for each country automatically.",
  },
  {
    q: "What photo should I use?",
    a: "A clear, front-facing photo in good, even lighting with a neutral expression and your whole head and the top of your shoulders visible. Higher-resolution photos give sharper, more compliant results.",
  },
  {
    q: "Can I use this for both printing and online upload?",
    a: "Yes. You get a print-ready file at the correct millimetre size and DPI, and a separate upload-ready file compressed under the portal's file-size limit.",
  },
];

export function Faq({
  items = HOME_FAQ,
  noSchema = false,
}: {
  items?: FaqItem[];
  /** Pass true when the parent already emits FAQPage in its @graph to avoid a
   *  duplicate orphaned <script> block. The accordion is still rendered. */
  noSchema?: boolean;
}) {
  return (
    <section>
      <div className="border-b border-hairline pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
      </div>
      <div className="divide-y divide-hairline">
        {items.map((item) => (
          <details key={item.q} className="group py-4 [&_summary]:list-none">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-medium leading-snug">
              {item.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
      {!noSchema && <FaqJsonLd items={items} />}
    </section>
  );
}

/** FAQPage structured data — eligible for rich results in search. */
export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so catalog/FAQ text can never break out of the <script> tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}
