import Link from "next/link";
import { Info } from "lucide-react";

interface ToolLimitationsNoticeProps {
  canCheck?: string[];
  cannotCheck?: string[];
  summary?: string;
}

const DEFAULT_CAN_CHECK = [
  "Image dimensions and file size",
  "Background uniformity",
  "Approximate face position and framing",
];

const DEFAULT_CANNOT_CHECK = [
  "Identity, recency, or document authenticity",
  "Every visual requirement a reviewer may assess",
  "The application authority’s final decision",
];

/** Shared disclosure for application-photo result and download surfaces. */
export function ToolLimitationsNotice({
  canCheck = DEFAULT_CAN_CHECK,
  cannotCheck = DEFAULT_CANNOT_CHECK,
  summary = "Checks measurable image properties (dimensions, file size, background uniformity, approximate face position). It cannot guarantee acceptance — verify the current application instructions on the official portal.",
}: ToolLimitationsNoticeProps) {
  return (
    <aside
      aria-label="Photo-checking scope and limitations"
      className="rounded-lg border border-hairline bg-paper p-4 text-sm"
    >
      <p className="flex items-start gap-2 leading-relaxed text-ink-soft">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
        <span>{summary}</span>
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-ink">Can check</p>
          <ul className="mt-1 space-y-1 text-xs leading-relaxed text-muted-foreground">
            {canCheck.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink">Cannot check</p>
          <ul className="mt-1 space-y-1 text-xs leading-relaxed text-muted-foreground">
            {cannotCheck.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 border-t border-hairline pt-3 text-xs leading-relaxed text-muted-foreground">
        easyPhoto is an independent tool and is not affiliated with any government,
        passport office, exam board, or application authority. {" "}
        <Link
          href="/how-photo-checking-works/"
          className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          See how photo checking works
        </Link>
        .
      </p>
    </aside>
  );
}
