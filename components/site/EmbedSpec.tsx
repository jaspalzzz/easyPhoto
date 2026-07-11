"use client";

import { useState } from "react";
import { Code2, Check, Copy } from "lucide-react";

/**
 * "Embed this spec" affordance — gives coaching blogs and exam sites a
 * copy-paste widget at /embed/exam-spec/{id}. The iframe provides referral and
 * brand exposure; the conventional parent-document attribution anchor links to
 * the indexable exam-requirements page.
 */
export function EmbedSpec({
  id,
  name,
  hasSig,
}: {
  id: string;
  name: string;
  hasSig: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const short = name.split(" (")[0];
  const height = hasSig ? 330 : 240;
  // `id` is the canonical exam slug: both this embed and
  // /exam-requirements/[exam] are generated from PORTAL_KEYS, and the caller
  // passes the registry's spec.id. Keep the attribution as literal parent-page
  // HTML so hosts publish a conventional crawlable anchor alongside the iframe.
  const code = `<iframe src="https://easyphoto.in/embed/exam-spec/${id}" width="360" height="${height}" loading="lazy" style="border:0;max-width:100%" title="${short} photo${hasSig ? " & signature" : ""} size — easyPhoto"></iframe>\n<p><a href="https://easyphoto.in/exam-requirements/${id}/">${short} photo${hasSig ? " and signature" : ""} requirements — easyPhoto</a></p>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the code is selectable in the box as a fallback */
    }
  };

  return (
    <details className="group mt-6 rounded-xl border border-hairline bg-card/40 p-4 [&_summary]:list-none">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
        <Code2 className="h-4 w-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
        Embed this spec on your site
        <span className="ml-auto text-xs font-normal text-ink-faint group-open:hidden">
          free · 1 click
        </span>
      </summary>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
        Running an exam-prep or coaching site? Drop this always-up-to-date{" "}
        {short} spec card into your page. Free to use — a link back to easyPhoto
        keeps it coming.
      </p>
      <div className="mt-3 flex items-stretch gap-2">
        <code className="flex-1 overflow-x-auto whitespace-pre rounded-md border border-hairline bg-ink/[0.03] px-3 py-2 font-mono text-[11px] leading-relaxed text-ink-soft">
          {code}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md bg-brand px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand/90"
          aria-label="Copy embed code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" strokeWidth={2.25} /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" strokeWidth={2} /> Copy
            </>
          )}
        </button>
      </div>
    </details>
  );
}
