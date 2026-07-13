"use client";
import { useState } from "react";

const TABS = [
  { id: "passport", icon: "📄", label: "Passport" },
  { id: "visa", icon: "🛂", label: "Visa" },
  { id: "oci", icon: "🇮🇳", label: "OCI" },
  { id: "greencard", icon: "💳", label: "Green Card" },
  { id: "exam", icon: "📝", label: "Exam Applications" },
  { id: "govid", icon: "🪪", label: "Government IDs" },
];

export function UsedForTabs() {
  const [active, setActive] = useState("passport");
  return (
    <section className="border-t border-hairline bg-paper py-3">
      <div className="container">
        <div className="flex items-center gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Used For
          </span>
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                  active === tab.id
                    ? "bg-[hsl(222_60%_8%)] text-[hsl(var(--cta))]"
                    : "bg-accent text-ink hover:bg-accent/80"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
