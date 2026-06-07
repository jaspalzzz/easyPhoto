/**
 * easyPhoto logo mark — the camera + ID-photo icon (no wordmark).
 * Brand colours: document teal #157F75, orange #F57819. Crisp at any size.
 * Keep this in sync with /public/icon.svg (used for favicons/app icons).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="easyPhoto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* camera body */}
      <rect x="4" y="22" width="52" height="30" rx="5" fill="#157F75" />
      {/* viewfinder prism + window */}
      <path d="M25 22 L29 15 L39 15 L43 22 Z" fill="#157F75" />
      <rect x="29.5" y="16.5" width="9" height="3" rx="1.5" fill="#fff" />
      {/* hot shoe (left) */}
      <rect x="9" y="17" width="9" height="5" rx="1.5" fill="#157F75" />
      <rect x="10.5" y="18.5" width="6" height="2" rx="1" fill="#fff" />
      {/* ID photo print (juts below the body) */}
      <rect
        x="23.5"
        y="27.5"
        width="25"
        height="29"
        rx="1.5"
        fill="#fff"
        stroke="#157F75"
        strokeWidth="2.6"
      />
      {/* person silhouette */}
      <circle cx="36" cy="37" r="5" fill="#F57819" />
      <path d="M27 54 C27 45 45 45 45 54 Z" fill="#F57819" />
    </svg>
  );
}
