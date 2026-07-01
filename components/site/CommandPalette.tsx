"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { MAKER_PAGES } from "@/lib/makerPages";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

interface CmdItem {
  title: string;
  category: string;
  path: string;
  keywords: string[];
}

/** Mirror of ToolSearch's index — same 4 data sources, same logic. */
function buildIndex(): CmdItem[] {
  const items: CmdItem[] = [];

  MAKER_PAGES.forEach((maker) => {
    const spec = COUNTRY_SPECS[maker.countryId];
    if (!spec) return;
    const docType = maker.kind === "visa" ? "Visa" : "Passport";
    items.push({
      title: `${spec.label} ${docType} Photo Maker`,
      category: "Passport & Visa",
      path: `/${maker.slug}/`,
      keywords: [spec.label.toLowerCase(), maker.kind, "photo", "spec", maker.countryId],
    });
  });

  TOOLS_CATALOG.forEach((group) => {
    group.tools.forEach((tool) => {
      if (!tool.ready) return;
      items.push({
        title: tool.title,
        category: group.group,
        path: `/tools/${tool.slug}/`,
        keywords: [
          tool.title.toLowerCase(),
          (tool.blurb ?? "").toLowerCase(),
          group.group.toLowerCase(),
          tool.slug,
        ],
      });
    });
  });

  Object.entries(PORTAL_PRESETS).forEach(([key, spec]) => {
    items.push({
      title: `${spec.name} Form Resizer`,
      category: "Government Portals",
      path: `/tools/form-resizer/${key}/`,
      keywords: [spec.name.toLowerCase(), key, "form", "portal", "resizer"],
    });
  });

  [10, 20, 30, 50, 100, 200].forEach((kb) => {
    items.push({
      title: `Resize Image to ${kb} KB`,
      category: "Image Tools",
      path: `/photo-resize-to-${kb}kb/`,
      keywords: ["photo", "image", "resize", "compress", `${kb}kb`, `${kb} kb`, "size", "limit"],
    });
  });

  [10, 20, 50, 100].forEach((kb) => {
    items.push({
      title: `Resize Signature to ${kb} KB`,
      category: "Signature Tools",
      path: `/signature-resize-to-${kb}kb/`,
      keywords: ["signature", "sign", "resize", "compress", `${kb}kb`, `${kb} kb`],
    });
  });

  return items;
}

const MAX_RESULTS = 8;

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const index = React.useMemo(buildIndex, []);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return index
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.keywords.some((kw) => kw.includes(q)) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS);
  }, [query, index]);

  /* ── Reset selection when results change ── */
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  /* ── Scroll selected item into view ── */
  React.useEffect(() => {
    if (!listRef.current) return;
    const li = listRef.current.children[selectedIndex] as HTMLElement | undefined;
    li?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  /* ── Open: focus input ── */
  React.useEffect(() => {
    if (open) {
      // rAF ensures the element is mounted and transition has started
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  /* ── Global keyboard shortcut: ⌘K / Ctrl+K ── */
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Custom event from ToolSearch's ⌘K badge ── */
  React.useEffect(() => {
    function onCustom() { setOpen(true); }
    document.addEventListener("cmd-palette-open", onCustom);
    return () => document.removeEventListener("cmd-palette-open", onCustom);
  }, []);

  /* ── Prevent body scroll when open ── */
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function navigate(path: string) {
    setOpen(false);
    router.push(path);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      navigate(results[selectedIndex].path);
    }
  }

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      role="presentation"
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
      onClick={() => setOpen(false)}
      style={{ background: "hsl(222 60% 8% / 0.65)", backdropFilter: "blur(4px)" }}
    >
      {/* Panel — stop propagation so clicking inside doesn't close */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-hairline bg-card shadow-[0_24px_80px_rgb(0_0_0/0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search row */}
        <div className="flex items-center gap-3 border-b border-hairline px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search tools, countries, exams…"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-muted-foreground"
            aria-autocomplete="list"
            aria-controls="cp-listbox"
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-md border border-hairline px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground hover:border-ink-soft hover:text-ink"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul
            ref={listRef}
            id="cp-listbox"
            role="listbox"
            aria-label="Search results"
            className="max-h-[calc(8*52px)] overflow-y-auto p-1.5"
          >
            {results.map((item, i) => (
              <li key={item.path} role="option" aria-selected={i === selectedIndex}>
                <button
                  type="button"
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={[
                    "group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    i === selectedIndex ? "bg-brand/10 text-ink" : "text-ink hover:bg-accent/40",
                  ].join(" ")}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold leading-snug">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {item.category}
                    </span>
                  </span>
                  <ArrowRight
                    className={[
                      "h-4 w-4 shrink-0 transition-all",
                      i === selectedIndex
                        ? "translate-x-0 text-brand opacity-100"
                        : "-translate-x-1 text-ink-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    ].join(" ")}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : query.trim() ? (
          <p className="px-4 py-8 text-center text-[13.5px] text-muted-foreground">
            No tools found for <strong className="text-ink">&quot;{query}&quot;</strong>
          </p>
        ) : (
          <p className="px-4 py-8 text-center text-[13.5px] text-muted-foreground">
            Try <span className="text-ink">&quot;passport&quot;</span>,{" "}
            <span className="text-ink">&quot;SSC&quot;</span>,{" "}
            <span className="text-ink">&quot;20kb&quot;</span>…
          </p>
        )}

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-hairline px-4 py-2.5">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <kbd className="rounded border border-hairline px-1 py-0.5 text-[10px] font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <kbd className="rounded border border-hairline px-1 py-0.5 text-[10px] font-mono">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <kbd className="rounded border border-hairline px-1 py-0.5 text-[10px] font-mono">Esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
