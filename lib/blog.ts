/**
 * Blog registry. Drives the /blog index, per-post metadata, sitemap and
 * Article schema. Each post is a page at app/blog/<slug>/page.tsx that renders
 * <BlogPostLayout slug="…">…body…</BlogPostLayout>.
 */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** Display date, e.g. "June 6, 2026". */
  date: string;
  /** ISO date for schema/datetime, e.g. "2026-06-06". */
  dateISO: string;
  excerpt: string;
  readMins: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-exam-photo-signature-rejected",
    title: "Why Your Exam Photo or Signature Keeps Getting Rejected (and the Fix)",
    description:
      "SSC, IBPS and RRB portals reject photos and signatures for a handful of predictable reasons — wrong KB, wrong dimensions, paper showing behind the signature. Here's each one and the 60-second fix, free and in your browser.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    excerpt:
      "“Photo not as per specification.” “Invalid signature.” Exam portals reject for a handful of predictable reasons — here's every one, and the quick fix for each.",
    readMins: 6,
  },
  {
    slug: "add-name-date-on-exam-photo",
    title: "How to Add Your Name and Date on an Exam Photo (UPSC, Army) — No Photoshop",
    description:
      "UPSC, Indian Army and some banking forms want your name and the date the photo was taken printed on the photo itself. Here's exactly what they require and how to add it free in your browser — no Photoshop, no upload.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    excerpt:
      "UPSC and Army forms reject photos that don't have your name and the photo date printed on them. Here's the exact rule and how to add it in under a minute.",
    readMins: 5,
  },
  {
    slug: "ibps-po-2026-photo-signature-checklist",
    title: "IBPS PO 2026: Photo & Signature Checklist Before You Apply",
    description:
      "IBPS PO 2026 prelims are on 22–23 August. Get your photo and signature to the exact size and KB now so you can apply in minutes when registration opens. The full checklist, with the official spec and a free resizer.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    excerpt:
      "IBPS PO 2026 prelims are on 22–23 August. Here's the exact photo and signature checklist to prepare now, so applying takes minutes when the form opens.",
    readMins: 5,
  },
  {
    slug: "schengen-europe-visa-photo-size",
    title: "Schengen & Europe Visa Photo Size (Germany, France, Italy & More)",
    description:
      "The exact photo size and background for Schengen and European visas — 35×45 mm, ICAO biometric, with the key per-country background differences (Germany needs grey, Italy white). Make one free in your browser.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Every Schengen visa photo is 35×45 mm and ICAO-biometric — but the background rule differs by country. Here's the exact spec for Germany, France, Italy and more, and how to make one free.",
    readMins: 5,
  },
  {
    slug: "how-to-mask-aadhaar-before-sharing",
    title: "How to Mask Your Aadhaar Number Before Sharing It (Free)",
    description:
      "UIDAI recommends sharing a masked Aadhaar that hides the first 8 digits. Here's why, when masked Aadhaar is accepted, and how to mask yours free in your browser — without uploading it anywhere.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Sharing your full Aadhaar number is risky. UIDAI says to share a masked copy showing only the last 4 digits. Here's how to do it safely and free, entirely on your device.",
    readMins: 4,
  },
  {
    slug: "how-to-compress-pdf",
    title: "How to Compress a PDF to 50, 100 or 200 KB (Free, No Upload)",
    description:
      "Exam and government portals often cap supporting documents at 50–200 KB. Here's how to compress a PDF to any KB target — marksheets, certificates, Aadhaar — free, in your browser, without any quality loss beyond what the limit requires.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Many portals reject PDFs that are too large. Here's the fastest way to hit exactly 50, 100 or 200 KB, what happens to quality, and the one thing to avoid.",
    readMins: 5,
  },
  {
    slug: "how-to-merge-pdf-free",
    title: "How to Merge PDF Files Free (No Sign-Up, No Upload)",
    description:
      "Combine multiple PDF files into one online for free. No sign-up, no upload, no watermark — everything runs in your browser. Covers documents, marksheets, certificates and multi-page forms.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Need one PDF from many? Drop your files, reorder if needed, and download the merged result in seconds. Nothing leaves your device.",
    readMins: 4,
  },
  {
    slug: "exam-photo-signature-size-guide",
    title: "Photo & Signature Size for Government Exam Forms (SSC, UPSC, IBPS)",
    description:
      "Photo and signature size, dimensions and KB limits for Indian exam and recruitment forms — SSC, UPSC, IBPS, SBI, Railway, NEET/JEE and more — and how to resize yours to fit.",
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    excerpt:
      "Most exam portals cap the photo at 20–50 KB and the signature at 10–20 KB, with set dimensions. Here's what each major exam wants and how to hit it exactly.",
    readMins: 6,
  },
  {
    slug: "linkedin-profile-photo-size-and-tips",
    title: "LinkedIn Profile Photo: Size, Tips & How to Make One Free",
    description:
      "The right LinkedIn profile photo size (400×400 and up), why it's shown in a circle, and what makes a headshot look professional. Plus a free, private way to crop and size yours.",
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    excerpt:
      "Square, at least 400×400, face centred for the circle crop. Here's the exact LinkedIn photo size and the tips that make a headshot look professional.",
    readMins: 5,
  },
  {
    slug: "resume-photo-size-and-rules",
    title: "Resume Photo: Size, Background & Rules (India Guide)",
    description:
      "Whether to put a photo on your resume, the standard passport size used in India, the right background and attire, and how to make a clean resume photo free in your browser.",
    date: "June 7, 2026",
    dateISO: "2026-06-07",
    excerpt:
      "In India a resume photo is usually passport-size on a plain background. Here's when to include one, the exact size, and how to make it look professional.",
    readMins: 5,
  },
  {
    slug: "how-to-take-a-passport-photo-at-home",
    title: "How to Take a Passport Photo at Home (and Get It Accepted)",
    description:
      "A practical, no-studio guide to taking a passport photo at home with your phone. Covers lighting, framing, background, and the mistakes that get photos rejected.",
    date: "June 6, 2026",
    dateISO: "2026-06-06",
    excerpt:
      "You don't need a studio. With a phone, a window and a plain wall, you can take a passport photo that passes. Here's exactly how.",
    readMins: 5,
  },
  {
    slug: "why-passport-photos-get-rejected",
    title: "Why Passport Photos Get Rejected (and How to Avoid It)",
    description:
      "The real reasons passport and visa photos get bounced: wrong size, wrong background, glasses, expression, shadows. Here's how to fix each one before you submit.",
    date: "June 6, 2026",
    dateISO: "2026-06-06",
    excerpt:
      "Most rejections come down to a handful of fixable mistakes. Here's the list, and how to avoid every one of them.",
    readMins: 6,
  },
  {
    slug: "passport-photo-size-by-country",
    title: "Passport Photo Size by Country: US, India, UK, Canada & More",
    description:
      "Passport photo dimensions and head-size rules for the US, India, UK, Canada, Australia and Schengen. What differs, why it matters, and how to get the exact size.",
    date: "June 5, 2026",
    dateISO: "2026-06-05",
    excerpt:
      "2×2 inch, 35×45mm, 50×70mm: passport photo size isn't universal. Here's every major country's spec and how to hit it exactly.",
    readMins: 6,
  },
  {
    slug: "how-to-reduce-passport-photo-size-for-online-forms",
    title: "How to Reduce Passport Photo Size for Online Forms (10–200 KB)",
    description:
      "Online passport, visa and exam portals cap the file size, often at 10–100 KB. Here's how to compress your photo to an exact KB target without making it blurry.",
    date: "June 4, 2026",
    dateISO: "2026-06-04",
    excerpt:
      "Portals reject photos that are too large. Here's how to hit an exact KB limit, whether that's 20, 50 or 100 KB, while keeping your photo sharp.",
    readMins: 5,
  },
  {
    slug: "baby-and-infant-passport-photo-guide",
    title: "How to Take a Baby or Infant Passport Photo at Home",
    description:
      "Babies can't pose, but their passport photo still has to comply. A practical guide to photographing an infant (eyes, background, no hands or toys) and getting it accepted.",
    date: "June 3, 2026",
    dateISO: "2026-06-03",
    excerpt:
      "No studio, no posing, no tears. How to take a compliant baby passport photo on a plain sheet with your phone.",
    readMins: 5,
  },
  {
    slug: "passport-photo-background-color",
    title: "Passport Photo Background Color: White, Grey or Cream?",
    description:
      "White isn't universal. The UK wants light grey or cream, Schengen is wary of pure white, and the US wants plain white. The right background color per country, and how to set it.",
    date: "June 2, 2026",
    dateISO: "2026-06-02",
    excerpt:
      "Using the wrong background shade is a top reason photos bounce. Here's the right color for each country, and how to apply it.",
    readMins: 5,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
