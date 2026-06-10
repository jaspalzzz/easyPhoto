import { Upload, ScanFace, Download } from "lucide-react";

export const HOW_IT_WORKS_STEPS = [
  {
    icon: Upload,
    title: "Upload your photo",
    body: "Drop in any clear, front-facing photo. It stays on your device.",
  },
  {
    icon: ScanFace,
    title: "We do the work",
    body: "We detect the face, size the head to the spec, and set the correct background.",
  },
  {
    icon: Download,
    title: "Download & submit",
    body: "Get a print-ready file and an upload-ready file that pass the size checks.",
  },
];

export function HowItWorks() {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <span className="eyebrow hidden sm:block">Three steps</span>
      </div>
      <ol className="grid md:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((s, i) => (
          <li
            key={s.title}
            className="border-hairline py-7 md:px-7 md:py-8 md:[&:first-child]:pl-0 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0 md:[&:not(:last-child)]:border-r"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-medium text-ink-faint">
                0{i + 1}
              </span>
              <s.icon className="h-[18px] w-[18px] text-brand" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
