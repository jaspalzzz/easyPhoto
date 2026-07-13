export type PhotoComplianceVariant =
  | "correct-baseline"
  | "background-busy"
  | "background-wrong-colour"
  | "head-too-small"
  | "head-too-large"
  | "off-centre"
  | "head-tilted"
  | "shadow-behind"
  | "uneven-lighting"
  | "smiling"
  | "eyes-closed"
  | "glasses-glare"
  | "hair-over-face"
  | "crop-cutoff";

export interface PhotoComplianceCase {
  status: "pass" | "fail";
  title: string;
  reason: string;
  variant: PhotoComplianceVariant;
  /** Specification background colour, or the deliberately wrong comparison colour. */
  background?: string;
  /** Midpoint of the specification's recorded head-percentage band. */
  headPercent?: number;
}

interface FaceProps {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  expression?: "neutral" | "smile";
  eyesClosed?: boolean;
  glasses?: boolean;
  hairOverFace?: boolean;
  uneven?: boolean;
}

function Face({
  x = 100,
  y = 83,
  scale = 1,
  rotate = 0,
  expression = "neutral",
  eyesClosed = false,
  glasses = false,
  hairOverFace = false,
  uneven = false,
}: FaceProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M-49 79 C-45 44 -25 30 0 30 C25 30 45 44 49 79 Z" fill="hsl(var(--brand))" />
      <rect x="-13" y="20" width="26" height="25" rx="10" fill="hsl(var(--cta-muted))" />
      <ellipse cx="0" cy="-5" rx="32" ry="40" fill="hsl(var(--cta-muted))" />
      <path d="M-31 -10 C-30 -43 27 -53 33 -10 C19 -22 2 -25 -13 -20 C-20 -17 -26 -13 -31 -10 Z" fill="hsl(var(--ink))" />
      {hairOverFace && <path d="M-22 -30 C5 -25 12 5 4 31 C-2 15 -8 -2 -20 -8 Z" fill="hsl(var(--ink))" />}
      {eyesClosed ? (
        <>
          <path d="M-20 -5 Q-13 1 -6 -5" fill="none" stroke="hsl(var(--ink))" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M6 -5 Q13 1 20 -5" fill="none" stroke="hsl(var(--ink))" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="-13" cy="-5" r="2.8" fill="hsl(var(--ink))" />
          <circle cx="13" cy="-5" r="2.8" fill="hsl(var(--ink))" />
        </>
      )}
      <path
        d={expression === "smile" ? "M-13 13 Q0 27 13 13" : "M-10 17 L10 17"}
        fill="none"
        stroke="hsl(var(--ink))"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {glasses && (
        <g fill="none" stroke="hsl(var(--ink))" strokeWidth="2">
          <rect x="-27" y="-14" width="23" height="17" rx="5" />
          <rect x="4" y="-14" width="23" height="17" rx="5" />
          <path d="M-4 -7 H4" />
          <path d="M-22 -11 L-10 0 M9 -11 L21 0" stroke="hsl(var(--paper))" strokeWidth="4" />
        </g>
      )}
      {uneven && <path d="M0 -45 A45 45 0 0 1 0 42 Z" fill="hsl(var(--ink) / 0.28)" />}
    </g>
  );
}

function facePropsFor(item: PhotoComplianceCase): FaceProps {
  const baselineScale = item.headPercent ? 0.72 + item.headPercent / 220 : 0.9;
  switch (item.variant) {
    case "head-too-small": return { scale: 0.55 };
    case "head-too-large": return { scale: 1.35, y: 85 };
    case "off-centre": return { x: 139, scale: baselineScale };
    case "head-tilted": return { rotate: 18, scale: baselineScale };
    case "smiling": return { expression: "smile", scale: baselineScale };
    case "eyes-closed": return { eyesClosed: true, scale: baselineScale };
    case "glasses-glare": return { glasses: true, scale: baselineScale };
    case "hair-over-face": return { hairOverFace: true, scale: baselineScale };
    case "crop-cutoff": return { y: 58, scale: 1.25 };
    case "uneven-lighting": return { uneven: true, scale: baselineScale };
    default: return { scale: baselineScale };
  }
}

function CaseIllustration({ item }: { item: PhotoComplianceCase }) {
  const label = `${item.status === "pass" ? "Correct" : "Incorrect"}: ${item.reason}`;
  const background = item.background ?? "#FFFFFF";
  const busy = item.variant === "background-busy";
  const shadow = item.variant === "shadow-behind";

  return (
    <svg
      viewBox="0 0 200 220"
      role="img"
      aria-label={label}
      className="block aspect-[10/11] w-full bg-paper"
    >
      <svg x="20" y="16" width="160" height="176" viewBox="20 16 160 176" overflow="hidden">
        <rect x="20" y="16" width="160" height="176" fill={busy ? "hsl(var(--brand-soft))" : background} />
        {busy && [-20, 20, 60, 100, 140, 180].map((x) => (
          <path key={x} d={`M${x} 192 L${x + 95} 16`} stroke="hsl(var(--brand-muted))" strokeWidth="14" />
        ))}
        {shadow && <ellipse cx="118" cy="91" rx="42" ry="55" fill="hsl(var(--ink) / 0.3)" />}
        <Face {...facePropsFor(item)} />
      </svg>
      <rect x="20" y="16" width="160" height="176" rx="4" fill="none" stroke="hsl(var(--hairline-strong))" strokeWidth="2" />
      <circle cx="166" cy="184" r="17" fill={item.status === "pass" ? "hsl(var(--success))" : "hsl(var(--destructive))"} stroke="hsl(var(--paper))" strokeWidth="3" />
      <text x="166" y="190" textAnchor="middle" fontSize="19" fontWeight="800" fill="hsl(var(--paper))" aria-hidden>
        {item.status === "pass" ? "✓" : "×"}
      </text>
    </svg>
  );
}

export function PhotoComplianceDiagram({
  cases,
  caption,
}: {
  cases: PhotoComplianceCase[];
  caption: string;
}) {
  return (
    <figure className="my-8 rounded-xl border border-hairline bg-card p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cases.map((item) => (
          <div key={`${item.variant}-${item.title}`} className="overflow-hidden rounded-lg border border-hairline bg-paper">
            <CaseIllustration item={item} />
            <div className="space-y-1 border-t border-hairline p-3">
              <p className="!mt-0 text-sm font-semibold text-ink">{item.title}</p>
              <p className="!mt-0 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
