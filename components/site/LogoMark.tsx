/**
 * easyPhoto logo mark — corner crop-marks framing a head ("crop to the exact
 * size", the precision/scan motif that runs through the whole product).
 * Brand colours: document navy #163A6B, stamp gold #F4C63F. Crisp at any size.
 * Keep this in sync with /public/icon.svg (used for favicons/app icons).
 */
export function LogoMark({ className }: { className?: string }) {
  const teal = "#163A6B";
  const orange = "#F4C63F";
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="easyPhoto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Corner crop marks */}
      <g
        fill="none"
        stroke={teal}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 17 V8 Q6 6 8 6 H17" />
        <path d="M47 6 H56 Q58 6 58 8 V17" />
        <path d="M58 47 V56 Q58 58 56 58 H47" />
        <path d="M17 58 H8 Q6 58 6 56 V47" />
      </g>
      {/* Head + shoulders (the framed subject) */}
      <circle cx="32" cy="26" r="8.5" fill={teal} />
      <path d="M18 49 C18 37 46 37 46 49 Z" fill={orange} />
    </svg>
  );
}
