/**
 * ComplianceEngine — AI Compliance Check section
 * Dark navy panel: photo with scan effect | 10-item checklist | 100% score card
 */

const CHECKS = [
  "Face Position",
  "Brightness",
  "Eye Height",
  "Contrast",
  "Background Color",
  "Shadow Detection",
  "Head Size",
  "Expression",
  "Resolution",
  "Pose & Alignment",
];

export function ComplianceEngine() {
  return (
    <section className="border-t border-hairline bg-[hsl(222_60%_6%)]">
      <div className="container py-14 sm:py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[2rem]">
            AI Compliance Check
          </h2>
          <p className="mt-2 text-[15px] text-white/50">
            Every photo is verified against official biometric requirements
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">

          {/* Left — photo with scan overlay */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="relative h-64 w-48 overflow-hidden rounded-2xl border-2 border-[hsl(var(--cta))]/30 shadow-2xl">
                <img
                  src="/images/selfie_compliant.png"
                  alt="AI scanning for compliance"
                  className="h-full w-full object-cover object-top"
                />
                {/* Scanning beam overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.06) 48%, rgba(34,197,94,0.12) 50%, rgba(34,197,94,0.06) 52%, transparent 100%)",
                  }}
                />
                {/* Corner scan marks */}
                <div className="absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-green-400" />
                <div className="absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-green-400" />
                <div className="absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-green-400" />
                <div className="absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-green-400" />
              </div>
              {/* Green check badge */}
              <div className="absolute -bottom-3 -right-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white shadow-lg">
                ✓
              </div>
            </div>
          </div>

          {/* Center — checklist */}
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {CHECKS.map((item) => (
                <div key={item} className="flex items-center gap-2 text-[13px] text-green-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-[10px] font-bold text-green-400">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — score card */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[hsl(var(--cta))]/20 bg-[hsl(222_60%_8%)] p-6 text-center">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-white/40">
              Compliance Score
            </p>
            <div className="my-3 text-[4.5rem] font-black leading-none text-[hsl(var(--cta))]">
              100%
            </div>
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-green-500" />
            </div>
            <p className="mb-5 text-[13px] leading-relaxed text-white/50">
              Your photo meets all official requirements.
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5">
              <span className="text-xl">🛡️</span>
              <span className="text-[13px] font-bold text-green-400">Government Compliant</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
