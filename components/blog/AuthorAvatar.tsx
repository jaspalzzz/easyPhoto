"use client";

import * as React from "react";

/** Author headshot with a graceful initials fallback if the image is missing. */
export function AuthorAvatar({
  src,
  name,
  className = "h-9 w-9",
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!src || failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-hairline bg-brand-soft/40 text-xs font-semibold text-brand ${className}`}
      >
        {initials}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={120}
      height={112}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full border border-hairline object-cover ${className}`}
    />
  );
}
