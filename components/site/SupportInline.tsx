"use client";

import * as React from "react";
import { deviceClass } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { isSupportSnoozed, supportConfig, supportVariant } from "@/lib/supportCard";
import { SUPPORT_CLOSE_EVENT } from "@/lib/supportEvents";
import type { SupportOfferProps } from "@/components/site/SupportOffer";

type Shown = Pick<SupportOfferProps, "config" | "variant"> & {
  Offer: React.ComponentType<SupportOfferProps>;
};

/** The page's own slug (e.g. "resize-kb"), as ToolPage derives it for the pop-up. */
function pageSlug(): string | undefined {
  return window.location.pathname.split("/").filter(Boolean).pop();
}

/**
 * The tip offer that stays in the page, right under the Download button, once
 * a file is saved — for anyone who closed or missed the pop-up (owner request,
 * 7 Oct 2026). Same ask as the pop-up (SupportOffer), in the bordered paper
 * box the tools use for their "Next steps" notes. It takes no focus and has no
 * dismiss control, because it never covers anything.
 *
 * Mounted by WorkflowNextSteps (the "Continue editing" block under most tools'
 * Download button) and directly by the tools that have no such block. Renders
 * nothing in the static HTML and nothing until the global "ep:download" event;
 * it does not show while a tap is snoozing the offer (SUPPORT_SNOOZE_MS) and
 * hides when the pop-up is closed by a tap. The ask is fetched on first show.
 */
export function SupportInline({ className }: { className?: string }) {
  const [shown, setShown] = React.useState<Shown | null>(null);
  const headingId = React.useId();

  React.useEffect(() => {
    const config = supportConfig();
    if (!config) return;
    const variant = supportVariant(deviceClass(), config);
    if (!variant) return;

    let active = true;
    const onDownload = (e: Event) => {
      const detail = (e as CustomEvent<{ filename?: string }>).detail;
      if (!detail?.filename || isSupportSnoozed()) return;
      import("@/components/site/SupportOffer")
        .then(({ SupportOffer }) => {
          if (active) setShown({ Offer: SupportOffer, config, variant });
        })
        .catch((err: unknown) => {
          // Offline or a stale deploy: the offer is optional, the file is saved.
          console.warn("[support-inline] could not load the offer", err);
        });
    };
    // A tap in the pop-up snoozes the offer; don't keep asking under the button.
    const onSupportClose = () => {
      if (isSupportSnoozed()) setShown(null);
    };
    window.addEventListener("ep:download", onDownload);
    window.addEventListener(SUPPORT_CLOSE_EVENT, onSupportClose);
    return () => {
      active = false;
      window.removeEventListener("ep:download", onDownload);
      window.removeEventListener(SUPPORT_CLOSE_EVENT, onSupportClose);
    };
  }, []);

  if (!shown) return null;
  const { Offer, config, variant } = shown;
  return (
    <section
      aria-labelledby={headingId}
      className={cn("ep-fade-in rounded-xl border border-hairline bg-paper p-4", className)}
    >
      <p id={headingId} className="text-base font-semibold text-ink">
        Glad we could help!
      </p>
      <Offer
        config={config}
        variant={variant}
        tool={pageSlug()}
        onTapped={() => setShown(null)}
        layout="inline"
      />
    </section>
  );
}
