"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { ToolIcon } from "@/components/site/ToolIcon";

/** Top-level destinations mirrored from the desktop nav. */
const PRIMARY_LINKS: { href: string; label: string }[] = [
  { href: "/passport-photo/", label: "Passport" },
  { href: "/tools/exam-package/", label: "Exams" },
  { href: "/blog/", label: "Blog" },
];

/** Selectors for all naturally focusable elements (used by focus trap). */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  /** Ref for the hamburger trigger so focus can return to it on close. */
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  /** Ref for the close button inside the panel — receives focus on open. */
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  /** Ref for the panel div used to scope the focus trap. */
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll + close on Escape while the drawer is open.
  // Also moves initial focus into the panel and returns it on close.
  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the drawer.
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      // Focus trap: keep Tab/Shift+Tab inside the panel.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => el.offsetParent !== null); // exclude hidden elements

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    // Return focus to the hamburger button that opened the drawer.
    triggerRef.current?.focus();
  };

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
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
          <div ref={panelRef} className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col bg-paper shadow-pop">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
              <span className="text-sm font-semibold tracking-tight">Menu</span>
              <button
                ref={closeButtonRef}
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
                {PRIMARY_LINKS.map((l) => {
                  const isActive =
                    l.href === "/"
                      ? pathname === "/"
                      : pathname === l.href || pathname.startsWith(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={close}
                        aria-current={isActive ? "page" : undefined}
                        className={`block rounded-md px-2 py-2.5 text-base font-medium transition-colors hover:bg-accent ${
                          isActive
                            ? "bg-accent text-brand font-semibold"
                            : "text-foreground"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
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
