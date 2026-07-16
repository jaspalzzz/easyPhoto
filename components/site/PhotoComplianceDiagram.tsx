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

interface HeadBand {
  top: number;
  bottom: number;
  eyeY: number;
  height: number;
  centreY: number;
}

const FRAME = { x: 20, y: 16, width: 160, height: 176 } as const;
const FACE_CROWN_Y = -50;
const FACE_CHIN_Y = 38;
const FACE_HEAD_HEIGHT = FACE_CHIN_Y - FACE_CROWN_Y;
const FACE_HEAD_MIDPOINT = (FACE_CROWN_Y + FACE_CHIN_Y) / 2;
const DEFAULT_HEAD_PERCENT = 65;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function headBandFor(item: PhotoComplianceCase): HeadBand {
  const percentage = clamp(item.headPercent ?? DEFAULT_HEAD_PERCENT, 45, 85);
  const height = FRAME.height * (percentage / 100);
  const centreY = 92;
  const top = centreY - height / 2;

  return {
    top,
    bottom: top + height,
    eyeY: top + height * 0.49,
    height,
    centreY,
  };
}

function Face({
  x = 100,
  y = 92,
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
      {/* A single portrait primitive supplies every variant. */}
      <path
        d="M-55 84 C-52 61 -41 47 -20 39 C-14 47 -7 51 0 51 C7 51 14 47 20 39 C41 47 52 61 55 84 Z"
        fill="hsl(var(--brand))"
      />
      <path
        d="M-49 83 C-43 61 -33 51 -18 45 C-9 53 9 53 18 45 C33 51 43 61 49 83"
        fill="none"
        stroke="hsl(var(--brand-foreground) / 0.14)"
        strokeWidth="2"
      />
      <path
        d="M-15 21 C-15 34 -18 40 -22 44 C-13 54 13 54 22 44 C18 40 15 34 15 21 Z"
        fill="hsl(var(--cta-muted))"
        stroke="hsl(var(--ink) / 0.12)"
        strokeWidth="1"
      />
      <path d="M-15 27 C-7 33 7 33 15 27 L15 36 C7 42 -7 42 -15 36 Z" fill="hsl(var(--ink) / 0.1)" />

      <ellipse cx="-32" cy="-4" rx="5" ry="9" fill="hsl(var(--cta-muted))" stroke="hsl(var(--ink) / 0.12)" />
      <ellipse cx="32" cy="-4" rx="5" ry="9" fill="hsl(var(--cta-muted))" stroke="hsl(var(--ink) / 0.12)" />
      <path
        d="M0 -47 C20 -47 32 -32 33 -10 C35 12 23 32 0 39 C-23 32 -35 12 -33 -10 C-32 -32 -20 -47 0 -47 Z"
        fill="hsl(var(--cta-muted))"
        stroke="hsl(var(--ink) / 0.14)"
        strokeWidth="1.25"
      />

      {/* Token-opacity planes add depth while remaining theme aware. */}
      <path d="M0 -46 C21 -43 31 -27 31 -7 C31 13 19 29 0 36 Z" fill="hsl(var(--ink) / 0.075)" />
      <path d="M-24 -20 C-19 -33 -8 -39 4 -39 C-7 -29 -10 -12 -8 7 C-11 20 -18 25 -24 20 C-31 8 -31 -7 -24 -20 Z" fill="hsl(var(--paper) / 0.18)" />

      <path
        d="M-32 -7 C-36 -31 -24 -50 -2 -52 C20 -54 35 -37 33 -11 C26 -18 19 -25 9 -28 C-3 -32 -13 -27 -21 -20 C-25 -16 -29 -11 -32 -7 Z"
        fill="hsl(var(--ink))"
      />
      <path d="M-23 -30 C-12 -43 8 -47 22 -34" fill="none" stroke="hsl(var(--paper) / 0.16)" strokeWidth="2.5" strokeLinecap="round" />

      <path d="M-22 -12 Q-14 -17 -6 -12" fill="none" stroke="hsl(var(--ink))" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 -12 Q14 -17 22 -12" fill="none" stroke="hsl(var(--ink))" strokeWidth="2" strokeLinecap="round" />
      {eyesClosed ? (
        <>
          <path d="M-21 -5 Q-14 0 -7 -5" fill="none" stroke="hsl(var(--ink))" strokeWidth="2.25" strokeLinecap="round" />
          <path d="M7 -5 Q14 0 21 -5" fill="none" stroke="hsl(var(--ink))" strokeWidth="2.25" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M-21 -5 Q-14 -10 -7 -5 Q-14 1 -21 -5 Z" fill="hsl(var(--paper) / 0.72)" stroke="hsl(var(--ink))" strokeWidth="1.2" />
          <path d="M7 -5 Q14 -10 21 -5 Q14 1 7 -5 Z" fill="hsl(var(--paper) / 0.72)" stroke="hsl(var(--ink))" strokeWidth="1.2" />
          <circle cx="-14" cy="-5" r="2.4" fill="hsl(var(--ink))" />
          <circle cx="14" cy="-5" r="2.4" fill="hsl(var(--ink))" />
        </>
      )}

      <path d="M0 -2 C-2 5 -4 10 -2 12 C0 14 3 13 5 12" fill="none" stroke="hsl(var(--ink) / 0.52)" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d={expression === "smile" ? "M-13 19 Q0 31 13 19" : "M-11 21 Q0 23 11 21"}
        fill="none"
        stroke="hsl(var(--ink))"
        strokeWidth="2.25"
        strokeLinecap="round"
      />

      {glasses && (
        <g fill="none" stroke="hsl(var(--ink))" strokeWidth="2">
          <rect x="-28" y="-14" width="25" height="18" rx="5" />
          <rect x="3" y="-14" width="25" height="18" rx="5" />
          <path d="M-3 -7 H3" />
          <path d="M-24 -11 L-10 1 M8 -11 L22 1" stroke="hsl(var(--brand-foreground) / 0.9)" strokeWidth="3.5" />
        </g>
      )}
      {hairOverFace && (
        <path
          d="M-22 -31 C-5 -25 1 -11 -1 10 C-3 23 -8 32 -13 35 C-10 15 -15 -3 -27 -10 Z"
          fill="hsl(var(--ink))"
        />
      )}
      {uneven && <path d="M0 -47 C21 -44 33 -27 33 -8 C35 13 23 32 0 39 Z" fill="hsl(var(--ink) / 0.24)" />}
    </g>
  );
}

function facePropsFor(item: PhotoComplianceCase, band: HeadBand): Required<Pick<FaceProps, "x" | "y" | "scale">> & FaceProps {
  const baselineScale = (band.height * 0.9) / FACE_HEAD_HEIGHT;
  const baselineY = band.centreY - FACE_HEAD_MIDPOINT * baselineScale;

  switch (item.variant) {
    case "head-too-small": {
      const scale = baselineScale * 0.57;
      return { x: 100, y: band.bottom - FACE_CHIN_Y * scale - 2, scale };
    }
    case "head-too-large": {
      const scale = baselineScale * 1.28;
      return { x: 100, y: band.bottom - FACE_CHIN_Y * scale, scale };
    }
    case "off-centre": return { x: 136, y: baselineY, scale: baselineScale };
    case "head-tilted": return { x: 100, y: baselineY, rotate: 18, scale: baselineScale };
    case "smiling": return { x: 100, y: baselineY, expression: "smile", scale: baselineScale };
    case "eyes-closed": return { x: 100, y: baselineY, eyesClosed: true, scale: baselineScale };
    case "glasses-glare": return { x: 100, y: baselineY, glasses: true, scale: baselineScale };
    case "hair-over-face": return { x: 100, y: baselineY, hairOverFace: true, scale: baselineScale };
    case "crop-cutoff": {
      const scale = baselineScale * 1.12;
      return { x: 100, y: FRAME.y - FACE_CROWN_Y * scale - 9, scale };
    }
    case "uneven-lighting": return { x: 100, y: baselineY, uneven: true, scale: baselineScale };
    default: return { x: 100, y: baselineY, scale: baselineScale };
  }
}

function GuideOverlay({ band }: { band: HeadBand }) {
  return (
    <g aria-hidden="true" fill="none" vectorEffect="non-scaling-stroke">
      <g stroke="hsl(var(--ink) / 0.28)" strokeWidth="1.25" strokeDasharray="5 5">
        <line x1={FRAME.x + 8} y1={band.top} x2={FRAME.x + FRAME.width - 8} y2={band.top} />
        <line x1={FRAME.x + 8} y1={band.bottom} x2={FRAME.x + FRAME.width - 8} y2={band.bottom} />
        <line x1="100" y1={FRAME.y + 7} x2="100" y2={FRAME.y + FRAME.height - 7} />
      </g>
      <g stroke="hsl(var(--brand) / 0.42)" strokeWidth="1.25">
        <line x1="93" y1={band.eyeY} x2="107" y2={band.eyeY} />
        <line x1="100" y1={band.eyeY - 7} x2="100" y2={band.eyeY + 7} />
        <circle cx="100" cy={band.eyeY} r="3" />
      </g>
    </g>
  );
}

function MarkerRing({ x, y, radius = 10 }: { x: number; y: number; radius?: number }) {
  return (
    <g aria-hidden="true" fill="none">
      <circle cx={x} cy={y} r={radius} stroke="hsl(var(--paper) / 0.86)" strokeWidth="5" />
      <circle cx={x} cy={y} r={radius} stroke="hsl(var(--destructive))" strokeWidth="2.5" />
      <circle cx={x} cy={y} r="2.8" fill="hsl(var(--destructive))" stroke="none" />
    </g>
  );
}

function MarkerLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g aria-hidden="true" fill="none" strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--paper) / 0.86)" strokeWidth="5" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--destructive))" strokeWidth="2.25" />
      <circle cx={x1} cy={y1} r="2.8" fill="hsl(var(--destructive))" stroke="none" />
      <circle cx={x2} cy={y2} r="2.8" fill="hsl(var(--destructive))" stroke="none" />
    </g>
  );
}

function ProblemCallout({
  item,
  face,
  band,
}: {
  item: PhotoComplianceCase;
  face: Required<Pick<FaceProps, "x" | "y" | "scale">> & FaceProps;
  band: HeadBand;
}) {
  if (item.status === "pass") return null;

  const crownY = face.y + FACE_CROWN_Y * face.scale;
  const eyeY = face.y - 5 * face.scale;

  switch (item.variant) {
    case "background-busy":
    case "background-wrong-colour":
      return <MarkerRing x={43} y={43} radius={11} />;
    case "head-too-small":
      return <MarkerLine x1={78} y1={band.top + 2} x2={78} y2={crownY - 2} />;
    case "head-too-large":
      return <MarkerLine x1={78} y1={band.top} x2={78} y2={Math.max(FRAME.y + 3, crownY)} />;
    case "off-centre":
      return <MarkerLine x1={100} y1={band.eyeY} x2={face.x} y2={band.eyeY} />;
    case "head-tilted":
      return (
        <g aria-hidden="true" fill="none" strokeLinecap="round">
          <path d="M72 69 Q100 42 129 67" stroke="hsl(var(--paper) / 0.86)" strokeWidth="5" />
          <path d="M72 69 Q100 42 129 67" stroke="hsl(var(--destructive))" strokeWidth="2.25" />
          <path d="M124 59 L129 67 L120 68" fill="hsl(var(--destructive))" stroke="none" />
          <circle cx="72" cy="69" r="2.8" fill="hsl(var(--destructive))" stroke="none" />
        </g>
      );
    case "shadow-behind":
      return <MarkerRing x={face.x + 34 * face.scale} y={face.y - 4 * face.scale} radius={11} />;
    case "uneven-lighting":
      return <MarkerRing x={face.x + 18 * face.scale} y={face.y - 2 * face.scale} radius={12} />;
    case "smiling":
      return <MarkerRing x={face.x} y={face.y + 22 * face.scale} radius={12} />;
    case "eyes-closed":
      return <MarkerRing x={face.x} y={eyeY} radius={22} />;
    case "glasses-glare":
      return <MarkerRing x={face.x - 15 * face.scale} y={face.y - 6 * face.scale} radius={11} />;
    case "hair-over-face":
      return <MarkerRing x={face.x - 10 * face.scale} y={face.y - 3 * face.scale} radius={13} />;
    case "crop-cutoff":
      return <MarkerRing x={face.x} y={FRAME.y + 7} radius={11} />;
    case "correct-baseline":
      return <MarkerRing x={face.x} y={band.eyeY} radius={12} />;
  }
}

const FLAW_LOCATIONS: Record<PhotoComplianceVariant, string> = {
  "correct-baseline": "the marked area shows the stated issue",
  "background-busy": "a pattern appears behind the head",
  "background-wrong-colour": "the background colour is incorrect",
  "head-too-small": "the head sits below the target height band",
  "head-too-large": "the head exceeds the target height band",
  "off-centre": "the head sits to the right of the centre guide",
  "head-tilted": "the head axis is visibly tilted",
  "shadow-behind": "a shadow appears behind the right side of the head",
  "uneven-lighting": "one side of the face is visibly darker",
  smiling: "the mouth is curved into a smile",
  "eyes-closed": "the eyelids are closed",
  "glasses-glare": "glare crosses the left lens",
  "hair-over-face": "hair crosses the left side of the face",
  "crop-cutoff": "the crown is clipped by the top edge",
};

function CaseIllustration({ item }: { item: PhotoComplianceCase }) {
  const label = item.status === "pass"
    ? `Correct: ${item.reason}`
    : `Incorrect: ${FLAW_LOCATIONS[item.variant]}. ${item.reason}`;
  const background = item.background ?? "#FFFFFF";
  const busy = item.variant === "background-busy";
  const shadow = item.variant === "shadow-behind";
  const band = headBandFor(item);
  const face = facePropsFor(item, band);

  return (
    <svg
      viewBox="0 0 200 220"
      role="img"
      aria-label={label}
      className="block aspect-[10/11] w-full bg-paper"
    >
      <title>{label}</title>
      <svg x="20" y="16" width="160" height="176" viewBox="20 16 160 176" overflow="hidden">
        <rect x="20" y="16" width="160" height="176" fill={busy ? "hsl(var(--brand-soft))" : background} />
        {busy && [-20, 20, 60, 100, 140, 180].map((x) => (
          <path key={x} d={`M${x} 192 L${x + 95} 16`} stroke="hsl(var(--brand-muted))" strokeWidth="14" />
        ))}
        {shadow && (
          <ellipse
            cx={face.x + 20 * face.scale}
            cy={face.y - 5 * face.scale}
            rx={35 * face.scale}
            ry={47 * face.scale}
            fill="hsl(var(--ink) / 0.28)"
          />
        )}
        <Face {...face} />
        <GuideOverlay band={band} />
        <ProblemCallout item={item} face={face} band={band} />
      </svg>
      <rect x="20" y="16" width="160" height="176" rx="4" fill="none" stroke="hsl(var(--hairline-strong))" strokeWidth="2" />
      <circle
        cx="166"
        cy="184"
        r="17"
        fill={item.status === "pass" ? "hsl(var(--success))" : "hsl(var(--destructive))"}
        stroke="hsl(var(--paper))"
        strokeWidth="3"
      />
      <text x="166" y="190" textAnchor="middle" fontSize="19" fontWeight="800" fill="hsl(var(--paper))" aria-hidden="true">
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
    <figure className="my-8 min-w-0 rounded-xl border border-hairline bg-card p-4 sm:p-5">
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cases.map((item) => (
          <div key={`${item.variant}-${item.title}`} className="min-w-0 overflow-hidden rounded-lg border border-hairline bg-paper">
            <CaseIllustration item={item} />
            <div className="space-y-1 border-t border-hairline p-3">
              <p className="!mt-0 break-words text-sm font-semibold text-ink">{item.title}</p>
              <p className="!mt-0 break-words text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
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
