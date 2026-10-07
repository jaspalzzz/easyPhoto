"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  buildUpiLink,
  markSupportTapped,
  type SupportConfig,
  type SupportMethod,
  type SupportVariant,
} from "@/lib/supportCard";
import { SUPPORT_CLOSE_EVENT, SUPPORT_OPEN_EVENT } from "@/lib/supportEvents";

const QR_SIZE_PX = 160;

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
 * install hint never stack on top of it.
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

  const onTip = (method: SupportMethod) => {
    markSupportTapped();
    track({ name: "support_tap", tool, method });
    // Close after the click has finished, so the link's own navigation
    // (the UPI app, or Razorpay in a new tab) is never cancelled by the unmount.
    window.setTimeout(onDismiss, 0);
  };

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

  const tipClass = buttonVariants({
    variant: "cta",
    className: "min-h-12 w-full px-6 text-base font-semibold md:w-auto",
  });

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
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
          easyPhoto is free for everyone, and your photos never leave your device. If it saved you
          a trip to the cyber café, a small tip helps keep it free for the next person filling a form.
        </p>

        <div className="mt-4 md:mt-5">
          {variant === "deeplink" && config.upi ? (
            <>
              <a
                href={buildUpiLink(config.upi)}
                onClick={() => onTip("upi")}
                aria-label="Help keep it free: opens your UPI app, where you choose the amount"
                className={tipClass}
              >
                Help keep it free
              </a>
              <p className="mt-2 text-xs text-muted-foreground">Opens your UPI app. You choose the amount.</p>
            </>
          ) : variant === "link" && config.link ? (
            <>
              {/* The payment page opens in a new tab so the user's tool and
                  file stay put; noopener keeps the two pages independent. */}
              <a
                href={config.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onTip("link")}
                aria-label="Help keep it free: opens Razorpay in a new tab, where you choose the amount"
                className={tipClass}
              >
                Help keep it free
              </a>
              <p className="mt-2 text-xs text-muted-foreground">You choose the amount on the next screen.</p>
            </>
          ) : (
            <div className="flex items-center gap-3 md:flex-col">
              {/* A static same-origin file from public/; next/image adds nothing
                  here (images are unoptimized in the static export). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.qrSrc ?? ""}
                alt="UPI QR code to support easyPhoto"
                width={QR_SIZE_PX}
                height={QR_SIZE_PX}
                className="h-40 w-40 shrink-0 rounded-md bg-white p-1.5"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Scan with any UPI app on your phone. You choose the amount.
              </p>
            </div>
          )}
        </div>

        {/* Phones: the reassurance and the skip share one row under the
            button. Desktop: stacked and centred, the skip first. */}
        <div className="mt-3 flex items-center justify-between gap-3 md:flex-col-reverse md:gap-1">
          <p className="text-xs text-muted-foreground">No pressure. easyPhoto stays free either way.</p>
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
