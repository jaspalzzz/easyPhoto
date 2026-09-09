import Link from "next/link";
import { AlertTriangle, ExternalLink, ShieldCheck, BadgeInfo } from "lucide-react";
import {
  COUNTRY_SPECS_VERIFIED_ON,
  type CountrySpec,
} from "@/lib/countrySpecs";

function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (!year || !month || !day || month < 1 || month > 12) return iso;
  return `${day} ${months[month - 1]} ${year}`;
}

function sourceName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Published source";
  }
}

export function SpecificationProvenance({
  verified,
  verifiedOn,
  sourceUrl,
  sourceLabel,
}: {
  verified: boolean;
  verifiedOn?: string;
  sourceUrl?: string;
  sourceLabel?: string;
}) {
  // Three states, deliberately not two. A confirmed spec is reassuring; an
  // unconfirmed spec that still cites an official source is advice, not an
  // alarm ("Source needs review" above the fold read as "this page is broken"
  // and depressed clicks on pages that were otherwise correct). Only a spec
  // with no source at all still warrants the caution icon.
  const hasSource = Boolean(sourceUrl);
  const Icon = verified && verifiedOn ? ShieldCheck : hasSource ? BadgeInfo : AlertTriangle;
  const status =
    verified && verifiedOn
      ? `Verified ${formatIsoDate(verifiedOn)}`
      : hasSource
        ? "Confirm on the official source before you submit"
        : "Source needs review";

  return (
    <div className="flex flex-col gap-1.5 text-xs text-ink-soft sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
      <p className="flex flex-wrap items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        <span>{status}</span>
        {sourceUrl && (
          <>
            <span aria-hidden className="text-ink-faint">·</span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {sourceLabel ?? sourceName(sourceUrl)}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </>
        )}
      </p>
      <Link
        href="/contact/"
        className="w-fit font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
      >
        Report outdated information
      </Link>
    </div>
  );
}

export function CountrySpecificationProvenance({ spec }: { spec: CountrySpec }) {
  const verified = spec.verified === "gov";
  return (
    <SpecificationProvenance
      verified={verified}
      verifiedOn={verified ? COUNTRY_SPECS_VERIFIED_ON : undefined}
      sourceUrl={spec.source}
    />
  );
}
