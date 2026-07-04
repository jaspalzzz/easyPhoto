"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ArrowRight,
  SquarePlus, Share,
} from "lucide-react";
import { MENU_COLUMNS } from "@/lib/toolMenu";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/** Top-level destinations mirrored from the desktop nav. */
const PRIMARY_LINKS: { href: string; label: string }[] = [
  { href: "/passport-photo/", label: "Passport" },
  { href: "/tools/exam-package/", label: "Exams" },
  { href: "/blog/", label: "Blog" },
];

/** Selectors for all naturally focusable elements (used by focus trap). */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // PWA install — independent of the one-time popup dismiss flag
  const [installMode, setInstallMode] = React.useState<"hidden" | "native" | "ios">("hidden");
  const deferredPrompt = React.useRef<BeforeInstallPromptEvent | null>(null);

  React.useEffect(() => {
    const ua = navigator.userAgent;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const isIosSafari =
      /iPhone|iPad|iPod/.test(ua) &&
      /Safari/.test(ua) &&
      !/CriOS|FxiOS|EdgiOS|Instagram|FBAV/.test(ua);

    if (isIosSafari) setInstallMode("ios");

    const onBeforeInstall = (e: Event) => {
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setInstallMode("native");
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const handleInstall = async () => {
    const p = deferredPrompt.current;
    if (!p) return;
    try { await p.prompt(); } catch { /* dismissed */ }
    close();
  };

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
        className={
          onDark
            ? "inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
            : "inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
        }
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && createPortal(
        // Portalled to <body>, not rendered in place: this button sits inside
        // the sticky header, which has its own z-40 stacking context — no
        // z-index on a descendant can ever escape that to outrank sibling
        // page content like the homepage search dropdown (ToolSearch, z-50
        // at the root). Rendering into body puts the dialog in the root
        // stacking context too, where z-[60] correctly outranks it.
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Site menu">
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

              {/* ── Category quick-links — same 5 categories as the desktop
                     mega-menu (both render from lib/toolMenu MENU_COLUMNS). ── */}
              <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                Browse by category
              </p>
              <div className="grid grid-cols-2 gap-2">
                {MENU_COLUMNS.map((col) => (
                  <Link
                    key={col.label}
                    href={col.href}
                    onClick={close}
                    className="group flex items-center gap-2.5 rounded-xl border border-hairline bg-surface p-3 transition-colors hover:border-hairline-strong hover:bg-accent/40 active:scale-[.98]"
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${col.tileBg} ${col.tileText}`}>
                      <col.Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </span>
                    <p className="min-w-0 text-[12px] font-bold leading-tight text-ink">{col.label}</p>
                  </Link>
                ))}

                {/* "All tools" spans the full width */}
                <Link
                  href="/tools/"
                  onClick={close}
                  className="col-span-2 flex items-center justify-between rounded-xl border border-brand/30 bg-brand-soft/20 px-3 py-2.5 transition-colors hover:bg-brand-soft/40"
                >
                  <span className="text-[12.5px] font-bold text-brand">View all tools</span>
                  <ArrowRight className="h-4 w-4 text-brand" />
                </Link>
              </div>

              {/* ── Primary links ── */}
              <div className="mt-4 border-t border-hairline pt-4">
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
              </div>

              {/* Detailed tool list — identical categories + tools to the
                  desktop mega-menu, driven by the shared MENU_COLUMNS. */}
              <div className="mt-5 space-y-5 border-t border-hairline pt-5">
                {MENU_COLUMNS.map((col) => (
                  <div key={col.label}>
                    <Link
                      href={col.viewAllHref}
                      onClick={close}
                      className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-brand"
                    >
                      <col.Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      {col.label}
                    </Link>
                    <ul className="space-y-0.5">
                      {col.tools.map((t) => (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            onClick={close}
                            className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent/60"
                          >
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-hairline bg-card text-ink-soft">
                              <t.Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </span>
                            {t.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {/* ── Install app ── */}
              {installMode !== "hidden" && (
                <div className="mt-4 border-t border-hairline pt-4">
                  {installMode === "native" ? (
                    <button
                      type="button"
                      onClick={handleInstall}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-accent"
                    >
                      <SquarePlus className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                      Add easyPhoto to home screen
                    </button>
                  ) : (
                    <p className="px-2 py-2 text-xs leading-relaxed text-muted-foreground">
                      <Share className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-brand" strokeWidth={2} />
                      Tap <strong className="font-semibold text-ink">Share</strong> then{" "}
                      <strong className="font-semibold text-ink">Add to Home Screen</strong> to install easyPhoto.
                    </p>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
