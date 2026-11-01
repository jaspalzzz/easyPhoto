/**
 * Single source of truth for the primary tool navigation.
 * --------------------------------------------------------
 * Both the desktop mega-menu (components/site/MainNav) and the mobile drawer
 * (components/site/MobileNav) render from MENU_COLUMNS, so the category
 * taxonomy and tool lists are identical on every device. Previously each nav
 * kept its own hand-maintained list and they had drifted apart (desktop said
 * "Document Photos" / "Image Tools", mobile said "Passport & Visa" / "Photo
 * Tools" and surfaced different groups entirely). Edit here once; both update.
 */

import type { LucideIcon } from "lucide-react";
import {
  User, CreditCard, UserCircle, FileText, ScanLine, Globe, Baby,
  GraduationCap, Package, Award, Train, Landmark,
  Aperture, Eraser, Maximize2, FileDown, Gauge, CalendarDays,
  Files,
  PenLine, ImageOff, Maximize, Crop, Wand2,
} from "lucide-react";

export interface ColTool {
  title: string;
  tag: string;
  href: string;
  Icon: LucideIcon;
}

export interface MenuColumn {
  label: string;
  Icon: LucideIcon;
  href: string;
  viewAllLabel: string;
  viewAllHref: string;
  /* Tailwind classes for icon tile bg + text + bar accent */
  tileBg: string;
  tileText: string;
  barCls: string;
  tools: ColTool[];
}

export const MENU_COLUMNS: MenuColumn[] = [
  {
    label: "Document Photos",
    Icon: User,
    href: "/passport-photo/",
    viewAllLabel: "View all document tools",
    viewAllHref: "/passport-photo/",
    tileBg: "bg-amber-100 dark:bg-amber-900/30", tileText: "text-amber-700 dark:text-amber-400", barCls: "bg-amber-400 dark:bg-amber-500",
    tools: [
      { title: "Passport Photo Maker",  tag: "All countries",        href: "/passport-photo/",            Icon: CreditCard   },
      { title: "Visa Photo Maker",      tag: "By country",           href: "/visa-photo/",                Icon: Globe        },
      { title: "Baby Passport Photo",   tag: "Under-4 print rules",  href: "/baby-passport-photo/",       Icon: Baby         },
      { title: "Resume / CV Photo",     tag: "Job applications",     href: "/tools/resume-photo/",        Icon: UserCircle   },
      { title: "Pre-submission Check",  tag: "Check before submit",  href: "/tools/compliance-checker/", Icon: ScanLine     },
    ],
  },
  {
    label: "Exam Tools",
    Icon: GraduationCap,
    href: "/tools/exam-package/",
    viewAllLabel: "View all exam tools",
    viewAllHref: "/tools/exam-package/",
    tileBg: "bg-blue-100 dark:bg-blue-900/30", tileText: "text-blue-700 dark:text-blue-400", barCls: "bg-blue-500",
    tools: [
      { title: "Exam Application Kit",  tag: "All exam presets",     href: "/tools/exam-package/",        Icon: Package      },
      { title: "SSC Photo Tool",        tag: "SSC MTS, CGL, CHSL",  href: "/exam-requirements/ssc/",    Icon: GraduationCap},
      { title: "UPSC Photo Tool",       tag: "Civil Services Exam",  href: "/exam-requirements/upsc/",   Icon: Award        },
      { title: "Railway Photo Tool",    tag: "RRB, NTPC, Group D",  href: "/exam-requirements/rrb/",    Icon: Train        },
      { title: "Banking Photo Tool",    tag: "IBPS, SBI, RBI, PO",  href: "/exam-requirements/ibps/",   Icon: Landmark     },
    ],
  },
  {
    label: "Image Tools",
    Icon: Aperture,
    href: "/tools/#photo",
    viewAllLabel: "View all image tools",
    viewAllHref: "/tools/#photo",
    tileBg: "bg-emerald-100 dark:bg-emerald-900/30", tileText: "text-emerald-700 dark:text-emerald-400", barCls: "bg-emerald-500",
    tools: [
      { title: "Background Remover",    tag: "Remove background",   href: "/tools/background-removal/",  Icon: Eraser       },
      { title: "Compress Image to KB",  tag: "Reduce file size",    href: "/tools/resize-kb/",           Icon: FileDown     },
      { title: "White Background",      tag: "Plain white backdrop", href: "/tools/white-background/",   Icon: Maximize2    },
      { title: "Change Image DPI",      tag: "200, 300 or custom",  href: "/tools/dpi-converter/",       Icon: Gauge        },
      { title: "Photo with Name & Date",tag: "Strip under the photo",href: "/tools/photo-with-name-date/", Icon: CalendarDays },
    ],
  },
  {
    label: "ID & Documents",
    Icon: FileText,
    href: "/tools/#document",
    viewAllLabel: "View all document tools",
    viewAllHref: "/tools/#document",
    tileBg: "bg-violet-100 dark:bg-violet-900/30", tileText: "text-violet-700 dark:text-violet-400", barCls: "bg-violet-500",
    tools: [
      { title: "Scan Photo Online",     tag: "JPG to scanned copy", href: "/tools/document-scanner/",    Icon: ScanLine     },
      { title: "Aadhaar Card OCR",      tag: "Number, name, DOB",   href: "/tools/aadhaar-ocr/",         Icon: FileText     },
      { title: "PAN Card OCR",          tag: "PAN number, name",    href: "/tools/pan-card-ocr/",        Icon: CreditCard   },
      { title: "Aadhaar Photo",         tag: "Update or enrol",     href: "/aadhaar-photo/",             Icon: User         },
      { title: "Merge Photo & Signature",tag: "One image for forms", href: "/tools/photo-signature-merge/", Icon: Files      },
    ],
  },
  {
    label: "Signature Tools",
    Icon: PenLine,
    href: "/tools/#signature",
    viewAllLabel: "View all signature tools",
    viewAllHref: "/tools/#signature",
    tileBg: "bg-orange-100 dark:bg-orange-900/30", tileText: "text-orange-700 dark:text-orange-400", barCls: "bg-orange-500",
    tools: [
      { title: "Signature Background Remover", tag: "PNG with no bg", href: "/tools/signature-background-removal/", Icon: ImageOff },
      { title: "Signature Resize",      tag: "Resize to any size",  href: "/tools/signature-resize/",    Icon: Maximize     },
      { title: "Signature Crop",        tag: "Crop signature",      href: "/tools/signature-crop/",      Icon: Crop         },
      { title: "Signature Cleaner",     tag: "Remove background",   href: "/tools/signature-cleaner/",   Icon: Wand2        },
      { title: "Sign Image / Photo",    tag: "Add signature",       href: "/tools/sign-image/",          Icon: PenLine      },
    ],
  },
];
