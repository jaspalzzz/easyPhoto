import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: "Is it really free? Is there a watermark?",
    a: "Yes, it is free, with no watermark and no sign-up. You download the full-quality file. Optional tips help pay for the site, which will also carry ads.",
  },
  {
    q: "What can the photo checks confirm?",
    a: "Pixel size, file size and format are measured exactly. Head size, face position, background and lighting are estimates that can warn you about a likely problem. Neither kind of check can tell you whether the authority will accept the photo, so compare the result with the current application instructions before submitting.",
  },
  {
    q: "Why isn't the background plain white for the UK and Schengen?",
    a: "For a Schengen visa the shade is set by the consulate handling your application, so easyPhoto starts with light grey and you can change it. For a UK passport, HM Passport Office accepts any plain light background and names cream, ivory, vanilla and light grey among its examples; easyPhoto starts with a light cream. In both cases the starting shade is easyPhoto's choice, not a rule.",
  },
  {
    q: "What photo should I use?",
    a: "A recent photo taken from about two metres away, facing the camera, in even light, with a neutral expression and your whole head and the top of your shoulders in the frame. Arm's-length selfies distort the face and leave too little room to crop.",
  },
  {
    q: "Can I use one photo for printing and for an online form?",
    a: "Usually, yes. The passport and visa makers give a file at the printed millimetre size for a photo lab, and the resize tools bring a copy under a form's KB limit. Some applications, such as an adult Indian passport at a PSK, take the photo at the counter, so check what yours asks for first.",
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
          <details key={item.q} className="group [&_summary]:list-none">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-1 py-[18px] text-[15px] font-semibold leading-snug transition-colors hover:text-brand group-open:text-brand">
              {item.q}
              <ChevronDown className="h-7 w-7 shrink-0 rounded-full bg-muted p-1.5 text-ink-soft transition-transform group-open:rotate-180 group-open:bg-brand/[0.12] group-open:text-brand" />
            </summary>
            <p className="max-w-2xl pb-5 pl-1 pr-11 text-sm leading-[1.7] text-muted-foreground">
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
