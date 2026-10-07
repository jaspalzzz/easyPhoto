"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { SupportOffer } from "@/components/site/SupportOffer";
import { cn } from "@/lib/utils";
import type { SupportConfig, SupportVariant } from "@/lib/supportCard";
import { SUPPORT_CLOSE_EVENT, SUPPORT_OPEN_EVENT } from "@/lib/supportEvents";

export interface SupportCardPanelProps {
  config: SupportConfig;
  variant: SupportVariant;
  tool?: string;
  onDismiss: () => void;
}

/**
 * The visible "Support easyPhoto" pop-up (owner-approved 7 Oct 2026: centred
 * on desktop, a bottom sheet on phones; one "Help keep it free" button, any
 * amount, no fixed tiers). Loaded on demand by
 * SupportCard right after a download, so the offer is in view at the moment
 * the tool has proved itself — not below the fold.
 *
 * A native modal <dialog>: the browser supplies the top layer, focus
 * containment, Esc and the backdrop. Closing is always one action away
 * (✕, "Maybe later", Esc or a click outside), and it announces itself with
 * SUPPORT_OPEN_EVENT / SUPPORT_CLOSE_EVENT so the download toast and the
 * install hint never stack on top of it. The ask itself is SupportOffer,
 * shared with the card that stays under the Download button.
 */
export function SupportCardPanel({ config, variant, tool, onDismiss }: SupportCardPanelProps) {
  const headingId = React.useId();
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // jsdom and very old browsers lack showModal; an open non-modal dialog
    // still shows the offer and every close control still works.
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    window.dispatchEvent(new Event(SUPPORT_OPEN_EVENT));
    return () => {
      if (typeof dialog.close === "function" && dialog.open) dialog.close();
      window.dispatchEvent(new Event(SUPPORT_CLOSE_EVENT));
    };
  }, []);

  const onCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    // Esc: let React state close it, so the unmount path is the only one.
    e.preventDefault();
    onDismiss();
  };

  const onBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // The dialog box has no padding of its own (the inner div does), so a
    // click whose target is the <dialog> itself landed on the backdrop.
    if (e.target === e.currentTarget) onDismiss();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onCancel={onCancel}
      onClick={onBackdropClick}
      className={cn(
        "ep-toast-in w-[calc(100%-1.5rem)] max-w-md overflow-visible rounded-2xl border border-hairline bg-card p-0 text-ink shadow-xl",
        // Phones: a bottom sheet within thumb reach. Desktop: centred.
        "mb-[max(1rem,env(safe-area-inset-bottom))] mt-auto md:my-auto",
        "backdrop:bg-black/30 md:backdrop:bg-black/45"
      )}
    >
      <div className="relative px-5 pb-4 pt-4 md:px-7 md:pb-6 md:pt-6 md:text-center">
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <p className="flex items-center gap-1.5 pr-10 text-xs text-muted-foreground md:justify-center md:px-10">
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </span>
          Saved on your device
        </p>

        <h2 id={headingId} className="mt-2.5 text-lg font-semibold text-ink md:mt-3.5 md:text-xl">
          Glad we could help!
        </h2>
        <SupportOffer config={config} variant={variant} tool={tool} onTapped={onDismiss} layout="dialog" />

        {/* Phones: the reassurance and the skip share one row under the
            button. Desktop: stacked and centred, the skip first. */}
        <div className="mt-3 flex items-center justify-between gap-3 md:flex-col-reverse md:gap-1">
          <p className="text-xs text-muted-foreground">No pressure. Every little bit helps.</p>
          <button
            type="button"
            onClick={onDismiss}
            className="min-h-11 shrink-0 rounded-md px-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Maybe later
          </button>
        </div>
      </div>
    </dialog>
  );
}
