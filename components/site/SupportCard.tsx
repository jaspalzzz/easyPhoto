"use client";

import * as React from "react";
import { deviceClass, track } from "@/lib/analytics";
import {
  canShowSupport,
  markSupportShown,
  supportConfig,
  supportVariant,
} from "@/lib/supportCard";
import type { SupportCardPanelProps } from "@/components/site/SupportCardPanel";

type Shown = Omit<SupportCardPanelProps, "onDismiss"> & {
  Panel: React.ComponentType<SupportCardPanelProps>;
};

/**
 * "Support easyPhoto" — a tip pop-up shown right after a download. Placed in
 * each tool's template so `tool` attributes the analytics; the pop-up itself
 * is a modal dialog, so where it sits in the DOM doesn't affect where it shows.
 *
 * Renders nothing in the static HTML (not SEO-visible) and nothing until the
 * global "ep:download" or "ep:share" event (lib/download.ts) confirms a file was
 * saved or shared, so it
 * never stands between the user and their file. At most once per browser
 * session; the rules live in lib/supportCard.ts. With no payment option
 * configured for the visitor's device it never renders.
 *
 * Only this listener ships with the page; the card itself (SupportCardPanel)
 * is fetched the first time it is actually going to show, which keeps the
 * first-load cost on every tool page to a few hundred bytes.
 */
export function SupportCard({ tool }: { tool?: string }) {
  const [shown, setShown] = React.useState<Shown | null>(null);

  React.useEffect(() => {
    const config = supportConfig();
    if (!config) return;
    const device = deviceClass();
    const variant = supportVariant(device, config);
    if (!variant) return;

    let active = true;
    const onDownload = (e: Event) => {
      const detail = (e as CustomEvent<{ filename?: string }>).detail;
      if (!detail?.filename || !canShowSupport()) return;
      // "Saved on your device" is only true for a download; a share may have
      // sent the file to another app.
      const saved = e.type === "ep:download";
      markSupportShown();
      import("@/components/site/SupportCardPanel")
        .then(({ SupportCardPanel }) => {
          if (!active) return;
          setShown({ Panel: SupportCardPanel, config, variant, tool, saved });
          track({ name: "support_view", tool, device });
        })
        .catch((err: unknown) => {
          // Offline or a stale deploy: the card is optional, the file is saved.
          console.warn("[support-card] could not load the card", err);
        });
    };
    window.addEventListener("ep:download", onDownload);
    window.addEventListener("ep:share", onDownload);
    return () => {
      active = false;
      window.removeEventListener("ep:download", onDownload);
      window.removeEventListener("ep:share", onDownload);
    };
  }, [tool]);

  if (!shown) return null;
  const { Panel, ...props } = shown;
  return <Panel {...props} onDismiss={() => setShown(null)} />;
}
