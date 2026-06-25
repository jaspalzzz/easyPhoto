"use client";

import * as React from "react";
import { Copy, CheckCircle2 } from "lucide-react";

/**
 * One extracted-field row for the ID OCR tools: an inline-editable value (OCR is
 * never perfect — let users fix it), an optional validation/status badge, and a
 * copy button. Shared by the Aadhaar and PAN tools so the two stay consistent.
 */
export function OcrResultField({
  label,
  value,
  onChange,
  mono = false,
  badge,
  placeholder = "Not detected",
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  mono?: boolean;
  badge?: React.ReactNode;
  placeholder?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </label>
          {badge}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className={`mt-0.5 w-full bg-transparent font-medium text-ink placeholder:font-normal placeholder:italic placeholder:text-muted-foreground focus:outline-none ${
            mono ? "font-mono" : ""
          }`}
        />
      </div>
      <button
        onClick={copy}
        disabled={!value}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
