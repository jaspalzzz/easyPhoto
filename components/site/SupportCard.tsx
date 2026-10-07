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
 * "Support easyPhoto" — a quiet tip card placed directly below a tool.
 *
 * Renders nothing in the static HTML (not SEO-visible) and nothing until the
 * global "ep:download" event (lib/download.ts) confirms a file was saved, so it
 * never stands between the user and their file. At most once per browser
 * session; the rules live in lib/supportCard.ts. With neither valid payment
 * pages nor a valid NEXT_PUBLIC_UPI_VPA it never renders anywhere.
 *
 * Only this listener ships with the page; the card itself (SupportCardPanel)
 * is fetched the first time it is actually going to show, which keeps the
 * first-load cost on every tool page to a few hundred bytes.
 */
export function SupportCard({ tool, className }: { tool?: string; className?: string }) {
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
      markSupportShown();
      import("@/components/site/SupportCardPanel")
        .then(({ SupportCardPanel }) => {
          if (!active) return;
          setShown({ Panel: SupportCardPanel, config, variant, tool, className });
          track({ name: "support_view", tool, device });
        })
        .catch((err: unknown) => {
          // Offline or a stale deploy: the card is optional, the file is saved.
          console.warn("[support-card] could not load the card", err);
        });
    };
    window.addEventListener("ep:download", onDownload);
    return () => {
      active = false;
      window.removeEventListener("ep:download", onDownload);
    };
  }, [tool, className]);

  if (!shown) return null;
  const { Panel, ...props } = shown;
  return <Panel {...props} onDismiss={() => setShown(null)} />;
}
