"use client";

import * as React from "react";

/**
 * Thin brand reading-progress bar pinned to the very top of the viewport.
 * Fills as the reader scrolls the article — a subtle "sense of progress" cue
 * that measurably improves completion / reduces bounce on long-form pages.
 * Transform-only width via a scaled bar → compositor-thread smooth.
 */
export function ReadingProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(1, el.scrollTop / total) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-brand"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
