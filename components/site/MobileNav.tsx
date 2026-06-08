"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { ToolIcon } from "@/components/site/ToolIcon";

/** Top-level destinations mirrored from the desktop nav. */
const PRIMARY_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Passport" },
  { href: "/tools/exam-package/", label: "Exams" },
  { href: "/blog/", label: "Blog" },
];

/**
 * Mobile navigation drawer.
 * ------------------------
 * The desktop header is a hover/click mega-menu that overflows off-screen on
 * phones — leaving the entire tool library unreachable except via the footer.
 * This hamburger → slide-in drawer exposes every tool (grouped) plus the
 * primary links, so all 20 tools are one tap away on mobile. Shown only below
 * the `md` breakpoint; the inline MainNav handles wider screens.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  // Lock body scroll + close on Escape while the drawer is open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Site menu">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-black/50"
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col bg-paper shadow-pop">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
              <span className="text-sm font-semibold tracking-tight">Menu</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-0.5">
                {PRIMARY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={close}
                      className="block rounded-md px-2 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/tools/"
                onClick={close}
                className="mt-3 flex items-center justify-between rounded-md border border-brand/25 bg-brand-soft/20 px-3 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft/40"
              >
                All tools
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-5 space-y-5 border-t border-hairline pt-5">
                {TOOLS_CATALOG.map((group) => (
                  <div key={group.slug}>
                    <Link
                      href={`/tools/${group.slug}/`}
                      onClick={close}
                      className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-brand"
                    >
                      {group.group}
                    </Link>
                    <ul className="space-y-0.5">
                      {group.tools
                        .filter((t) => t.ready)
                        .map((t) => (
                          <li key={t.slug}>
                            <Link
                              href={`/tools/${t.slug}/`}
                              onClick={close}
                              className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent/60"
                            >
                              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-hairline bg-card text-ink-soft">
                                <ToolIcon name={t.icon} className="h-3.5 w-3.5" />
                              </span>
                              {t.title}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
