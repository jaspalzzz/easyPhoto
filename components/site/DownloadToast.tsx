"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { formatKb } from "@/lib/utils";

interface ToastState {
  filename: string;
  bytes: number;
  key: number;
}

/**
 * Global download confirmation. Downloads are otherwise silent — on phones
 * especially, users can't tell whether the file actually saved, which is a
 * real anxiety moment when the file is their exam photo. Listens for the
 * "ep:download" event dispatched by lib/download.ts, so every tool gets the
 * confirmation with no per-tool wiring.
 */
export function DownloadToast() {
  const [toast, setToast] = React.useState<ToastState | null>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const onDownload = (e: Event) => {
      const detail = (e as CustomEvent<{ filename: string; bytes: number }>)
        .detail;
      if (!detail?.filename) return;
      setToast({ filename: detail.filename, bytes: detail.bytes, key: Date.now() });
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setToast(null), 4500);
    };
    window.addEventListener("ep:download", onDownload);
    return () => {
      window.removeEventListener("ep:download", onDownload);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      key={toast.key}
      role="status"
      aria-live="polite"
      className="ep-toast-in fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex max-w-full items-center gap-2.5 rounded-xl border border-hairline bg-ink px-4 py-3 text-sm text-paper shadow-lg">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </span>
        <span className="min-w-0 truncate">
          Saved <strong className="font-semibold">{toast.filename}</strong>
          {" · "}
          {formatKb(toast.bytes)} — on your device, never uploaded
        </span>
      </div>
    </div>
  );
}
