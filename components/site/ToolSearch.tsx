"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ExternalLink } from "lucide-react";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { MAKER_PAGES } from "@/lib/makerPages";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

interface SearchItem {
  title: string;
  category: string;
  path: string;
  keywords: string[];
}

export function ToolSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Index search items once
  const searchIndex = React.useMemo(() => {
    const items: SearchItem[] = [];

    // 1. Country Maker Pages
    MAKER_PAGES.forEach((maker) => {
      const spec = COUNTRY_SPECS[maker.countryId];
      if (!spec) return;
      const docType = maker.kind === "visa" ? "Visa" : "Passport";
      items.push({
        title: `${spec.label} ${docType} Photo Maker`,
        category: "Passport & Visa Specs",
        path: `/${maker.slug}/`,
        keywords: [spec.label.toLowerCase(), maker.kind, "photo", "spec", maker.countryId],
      });
    });

    // 2. Standalone Catalog Tools
    TOOLS_CATALOG.forEach((group) => {
      group.tools.forEach((tool) => {
        if (!tool.ready) return;
        items.push({
          title: tool.title,
          category: group.group,
          path: `/tools/${tool.slug}/`,
          keywords: [tool.title.toLowerCase(), tool.blurb.toLowerCase(), group.group.toLowerCase(), tool.slug],
        });
      });
    });

    // 3. Portal Resizers
    Object.entries(PORTAL_PRESETS).forEach(([key, spec]) => {
      items.push({
        title: `${spec.name} Form Resizer`,
        category: "Government Portals",
        path: `/tools/form-resizer/${key}/`,
        keywords: [spec.name.toLowerCase(), "ssc", "upsc", "ds160", "form", "portal", "resizer", key],
      });
    });

    // 4. Exact Size Presets
    [10, 20, 30, 50, 100, 200].forEach((kb) => {
      items.push({
        title: `Resize Image to ${kb} KB`,
        category: "Image Compressors",
        path: `/photo-resize-to-${kb}kb/`,
        keywords: ["photo", "image", "resize", "compress", `${kb}kb`, `${kb} kb`, "size", "limit"],
      });
    });

    [10, 20, 50, 100].forEach((kb) => {
      items.push({
        title: `Resize Signature to ${kb} KB`,
        category: "Signature Tools",
        path: `/signature-resize-to-${kb}kb/`,
        keywords: ["signature", "sign", "resize", "compress", `${kb}kb`, `${kb} kb`, "size", "limit", "transparent"],
      });
    });

    return items;
  }, []);

  // Filter search results
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = searchIndex.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((kw) => kw.includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 5)); // Limit to 5 results
  }, [query, searchIndex]);

  // Click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft opacity-60" strokeWidth={2} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search tools: '20kb', 'signature', 'SSC'..."
          className="h-11 w-full rounded-full border border-hairline-strong bg-paper pl-10 pr-4 text-sm font-medium placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand-soft/20 focus:outline-none shadow-sm transition-all"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 rounded-lg border border-hairline bg-paper p-1.5 shadow-pop overflow-hidden">
          <ul className="divide-y divide-hairline">
            {results.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.path}
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between rounded px-3 py-2 text-sm transition-colors hover:bg-accent/40 group"
                >
                  <div>
                    <span className="font-medium text-foreground block leading-tight">{item.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5 block">{item.category}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-brand opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
