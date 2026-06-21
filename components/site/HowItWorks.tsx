import { Upload, ScanLine, Download } from "lucide-react";

const STEPS = [
  {
    Icon: Upload,
    step: "Step 1",
    title: "Upload your photo",
    desc: "Upload any photo from your device. Stays 100% on your device.",
  },
  {
    Icon: ScanLine,
    step: "Step 2",
    title: "We adjust & verify",
    desc: "Our AI crops, resizes and checks all compliance rules automatically.",
  },
  {
    Icon: Download,
    step: "Step 3",
    title: "Download & use",
    desc: "Download your compliant photo instantly. No watermark, no sign-up.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-14 sm:py-16">
        <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          How it works
        </p>
        <h2 className="mb-12 text-center text-[1.75rem] font-semibold tracking-tight text-ink">
          Get your compliant photo in{" "}
          <span className="mark-gold text-ink">3 simple steps</span>
        </h2>

        <div className="mx-auto grid max-w-3xl grid-cols-[1fr_40px_1fr_40px_1fr] items-start gap-0">
          {STEPS.map((s, i) => (
            <>
              <div key={s.step} className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  <s.Icon className="h-7 w-7 text-brand" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground">
                    {s.step}
                  </p>
                  <p className="mt-1.5 text-[15px] font-semibold text-ink">{s.title}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>

              {i < 2 && (
                <div key={`arr-${i}`} className="flex items-start justify-center pt-8">
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none" aria-hidden="true">
                    <line x1="0" y1="6" x2="32" y2="6" stroke="hsl(var(--hairline))" strokeWidth="1.5" strokeDasharray="4 3" />
                    <path d="M30 2 L36 6 L30 10" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
