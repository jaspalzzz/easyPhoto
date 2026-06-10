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
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((s, i) => (
          <li
            key={s.title}
            className="relative flex flex-col gap-3.5 rounded-xl border border-hairline bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_2px_8px_rgb(0_0_0/0.04)]"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <s.icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
              </span>
              <span className="font-mono text-[28px] font-bold leading-none text-hairline-strong">
                0{i + 1}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
