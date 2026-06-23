"use client";

import * as React from "react";
import { Share, SquarePlus, X } from "lucide-react";
import { LogoMark } from "@/components/site/LogoMark";

const DISMISS_KEY = "ep:pwa-hint-dismissed";

/** The non-standard beforeinstallprompt event (Chrome/Edge/Android). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function dismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return true; // private mode — don't nag
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* private mode */
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's legacy flag
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/.test(ua) &&
    /Safari/.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|Instagram|FBAV|FBAN/.test(ua)
  );
}

/**
 * One-time "add to home screen" suggestion, shown after the user's FIRST
 * successful download — the moment the product has proven its value, and the
 * person most likely to need it again (an applicant mid-application-season).
 * Native install prompt where the browser offers one (Chrome/Android/desktop);
 * share-sheet instructions on iOS Safari; nothing anywhere else. Dismiss once,
 * never shown again.
 */
export function PwaInstallHint() {
  const [mode, setMode] = React.useState<"hidden" | "native" | "ios">("hidden");
  const deferredPrompt = React.useRef<BeforeInstallPromptEvent | null>(null);
  const downloaded = React.useRef(false);

  React.useEffect(() => {
    if (dismissed() || isStandalone()) return;

    const maybeShow = () => {
      if (!downloaded.current || dismissed()) return;
      if (deferredPrompt.current) setMode("native");
      else if (isIosSafari()) setMode("ios");
    };

    const onBeforeInstall = (e: Event) => {
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      maybeShow();
    };
    const onDownload = () => {
      downloaded.current = true;
      // Let the download toast have its moment first.
      setTimeout(maybeShow, 5000);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("ep:download", onDownload);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("ep:download", onDownload);
    };
  }, []);

  const close = () => {
    markDismissed();
    setMode("hidden");
  };

  const install = async () => {
    const p = deferredPrompt.current;
    close(); // either way, this was its one showing
    if (p) {
      try {
        await p.prompt();
      } catch {
        /* user dismissed the native dialog */
      }
    }
  };

  if (mode === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-label="Add easyPhoto to your home screen"
      className="ep-toast-in fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex w-full max-w-md items-start gap-3 rounded-xl border border-hairline bg-card p-4 shadow-lg">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-paper">
          <LogoMark className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">
            Keep easyPhoto one tap away
          </p>
          {mode === "native" ? (
            <>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Add it to your home screen — handy when the next form opens.
              </p>
              <button
                type="button"
                onClick={install}
                className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-cta px-3.5 py-1.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
              >
                <SquarePlus className="h-4 w-4" strokeWidth={2} /> Add to home screen
              </button>
            </>
          ) : (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Tap <Share className="inline h-3.5 w-3.5 align-[-2px] text-brand" strokeWidth={2} />{" "}
              <strong className="font-semibold text-ink">Share</strong>, then{" "}
              <strong className="font-semibold text-ink">Add to Home Screen</strong> — handy
              when the next form opens.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-accent/50 hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
