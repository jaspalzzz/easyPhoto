import { Upload, Wand2, Download } from "lucide-react";

export const HOW_IT_WORKS_STEPS = [
  {
    icon: Upload,
    title: "Upload your photo",
    body: "Drop in any clear, front-facing photo. It stays on your device.",
  },
  {
    icon: Wand2,
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
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <p className="mt-1 text-muted-foreground">
          A compliant photo in three steps — no design skills needed.
        </p>
      </div>
      <ol className="grid gap-6 md:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((s, i) => (
          <li key={s.title} className="relative rounded-xl border bg-card p-6">
            <span className="absolute right-5 top-5 text-3xl font-bold text-muted/60">
              {i + 1}
            </span>
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-muted text-brand">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
