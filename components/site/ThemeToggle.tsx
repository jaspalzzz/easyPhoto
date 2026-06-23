"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "ep-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  /* Read actual DOM state after hydration to stay in sync with the
     beforeInteractive script that may have already applied .dark */
  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }

  /* Avoid a layout-shift flash before we know the actual theme */
  if (!mounted) return <div className="h-9 w-9" aria-hidden />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
      ) : (
        <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
      )}
    </button>
  );
}
