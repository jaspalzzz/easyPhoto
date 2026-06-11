import { cn } from "@/lib/utils";

// Country id → ISO flag file (real SVG flags in /public/flags, not emoji).
const CODE: Record<string, string> = {
  us: "us",
  canada: "ca",
  schengen: "eu",
  uk: "gb",
  india: "in",
  australia: "au",
  germany: "de",
  france: "fr",
  italy: "it",
  netherlands: "nl",
  ireland: "ie",
  uae: "ae",
  saudi: "sa",
  "saudi-evisa": "sa",
  pakistan: "pk",
  nepal: "np",
  spain: "es",
  portugal: "pt",
};

/** Genuine SVG flag, rounded with a hairline ring for a premium look. */
export function Flag({
  country,
  className,
}: {
  country: string;
  className?: string;
}) {
  const code = CODE[country] ?? country;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${code}.svg`}
      alt=""
      aria-hidden
      className={cn(
        "inline-block h-4 w-[1.5rem] shrink-0 rounded-[2px] object-cover ring-1 ring-ink/15",
        className
      )}
    />
  );
}
