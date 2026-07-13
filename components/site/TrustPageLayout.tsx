import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function TrustPageLayout({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-3xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      <header className="mt-5 space-y-4 border-b border-hairline pb-9">
        <span className="eyebrow text-brand">{eyebrow}</span>
        <h1 className="text-balance text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[2.6rem]">
          {title}
        </h1>
        <p className="max-w-2xl text-pretty text-[17px] leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </header>

      <div className="mt-10 space-y-10 text-[16px] leading-[1.75] text-ink-soft">
        {children}
      </div>
    </div>
  );
}
