"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, User, GraduationCap, Aperture, FileText, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  CreditCard, UserCircle, Printer, ScanLine, Camera,
  Package, Award, Train, Landmark,
  Eraser, Maximize2, FileDown, Gauge, RefreshCw,
  Files, Scissors, FileImage, FilePlus, FileSignature,
  ImageOff, Maximize, Crop, Wand2,
} from "lucide-react";

interface TabTool { title: string; desc: string; href: string; Icon: LucideIcon; }
interface Tab     { id: string; label: string; Icon: LucideIcon; tools: TabTool[]; }

const TABS: Tab[] = [
  {
    id: "document", label: "Document Photos", Icon: User,
    tools: [
      { title: "Passport Photo Maker",  desc: "All countries & official specs",        href: "/passport-photo/",               Icon: CreditCard    },
      { title: "LinkedIn Photo Maker",  desc: "Professional headshots",                href: "/tools/linkedin-photo/",         Icon: UserCircle    },
      { title: "Resume / CV Photo",     desc: "Job applications & CVs",                href: "/tools/resume-photo/",           Icon: FileText      },
      { title: "Photo Print Sheet",     desc: "4×6 inch, A4 & more sizes",            href: "/tools/print-sheet/",            Icon: Printer       },
      { title: "Photo Validator",       desc: "Check before you submit",               href: "/tools/photo-validator/",        Icon: ScanLine      },
      { title: "Camera Capture",        desc: "Take photo directly in browser",        href: "/tools/camera-capture/",         Icon: Camera        },
    ],
  },
  {
    id: "exam", label: "Exam Tools", Icon: GraduationCap,
    tools: [
      { title: "Exam Application Kit",  desc: "All exam presets in one flow",          href: "/tools/exam-package/",           Icon: Package       },
      { title: "SSC Photo Tool",        desc: "SSC MTS, CGL, CHSL",                   href: "/tools/form-resizer/ssc/",       Icon: GraduationCap },
      { title: "UPSC Photo Tool",       desc: "Civil Services Exam",                   href: "/tools/form-resizer/upsc/",      Icon: Award         },
      { title: "Railway Photo Tool",    desc: "RRB, NTPC, Group D",                   href: "/tools/form-resizer/rrb/",       Icon: Train         },
      { title: "Banking Photo Tool",    desc: "IBPS, SBI, RBI, PO",                   href: "/tools/form-resizer/ibps/",      Icon: Landmark      },
      { title: "Photo + Signature Kit", desc: "Both in correct size together",         href: "/tools/photo-signature-merge/",  Icon: Package       },
    ],
  },
  {
    id: "image", label: "Image Tools", Icon: Aperture,
    tools: [
      { title: "Background Remover",    desc: "Remove background from any photo",      href: "/tools/background-removal/",     Icon: Eraser        },
      { title: "Resize Image",          desc: "By pixels, mm or cm",                  href: "/tools/resize-dimensions/",      Icon: Maximize2     },
      { title: "Compress Image to KB",  desc: "Shrink to exact file size",            href: "/tools/resize-kb/",              Icon: FileDown      },
      { title: "Change Image DPI",      desc: "Set to 200, 300 or custom DPI",        href: "/tools/dpi-converter/",          Icon: Gauge         },
      { title: "Image Format Converter",desc: "JPG, PNG, WEBP and more",              href: "/tools/format-converter/",       Icon: RefreshCw     },
      { title: "Red-Eye Removal",       desc: "Fix red eye in photos instantly",       href: "/tools/red-eye-removal/",        Icon: Eraser        },
    ],
  },
  {
    id: "pdf", label: "PDF Tools", Icon: FileText,
    tools: [
      { title: "Compress PDF",          desc: "Reduce PDF size to target KB",         href: "/tools/pdf-compress/",           Icon: FileDown      },
      { title: "Merge PDF",             desc: "Combine multiple PDFs into one",        href: "/tools/pdf-merge/",              Icon: Files         },
      { title: "Split PDF",             desc: "Extract specific pages",                href: "/tools/pdf-split/",              Icon: Scissors      },
      { title: "PDF to JPG",            desc: "Convert PDF pages to images",           href: "/tools/pdf-to-jpg/",             Icon: FileImage     },
      { title: "JPG to PDF",            desc: "Combine images into a PDF",             href: "/tools/jpg-to-pdf/",             Icon: FilePlus      },
      { title: "Sign PDF",              desc: "Add signature to PDF document",         href: "/tools/sign-pdf/",               Icon: FileSignature },
    ],
  },
  {
    id: "signature", label: "Signature Tools", Icon: PenLine,
    tools: [
      { title: "Transparent Signature", desc: "PNG with no background",                href: "/tools/transparent-signature/",  Icon: ImageOff      },
      { title: "Signature Resize",      desc: "Resize to any pixel or KB size",        href: "/tools/signature-resize/",       Icon: Maximize      },
      { title: "Signature Crop",        desc: "Crop signature to content",             href: "/tools/signature-crop/",         Icon: Crop          },
      { title: "Signature Cleaner",     desc: "Remove background from signature",      href: "/tools/signature-cleaner/",      Icon: Wand2         },
      { title: "Sign Image / Photo",    desc: "Add signature to any image",            href: "/tools/sign-image/",             Icon: PenLine       },
      { title: "Photo + Signature Merge",desc: "Merge photo & signature side by side", href: "/tools/photo-signature-merge/",  Icon: Files         },
    ],
  },
];

/* Single icon language across the whole page — dark navy tile + gold icon */
const ICON_STYLE = { background: "hsl(222 60% 8%)" } as const;

export function ToolsTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-10 sm:py-12">
        <h2 className="mb-7 text-[1.6rem] font-semibold tracking-tight text-ink">
          All tools at your fingertips
        </h2>

        {/* Tab bar — gold underline on active, same cta accent throughout */}
        <div className="mb-6 flex items-center gap-1 overflow-x-auto border-b border-hairline scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 px-4 py-3 text-[13px] font-semibold transition-colors",
                active === t.id
                  ? "border-b-2 border-cta text-ink"
                  : "border-b-2 border-transparent text-muted-foreground hover:text-ink"
              )}
            >
              <t.Icon
                className={cn("h-4 w-4", active === t.id ? "text-cta" : "text-muted-foreground")}
                strokeWidth={1.75}
              />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tab.tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-xl border border-hairline bg-card p-4 transition-all hover:border-hairline-strong hover:shadow-sm"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={ICON_STYLE}
              >
                <tool.Icon className="h-5 w-5 text-cta" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-tight text-ink">{tool.title}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{tool.desc}</p>
              </div>
              <span className="flex items-center gap-1 text-[11.5px] font-semibold text-brand">
                Open tool <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/tools/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline"
          >
            View all 34 tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
