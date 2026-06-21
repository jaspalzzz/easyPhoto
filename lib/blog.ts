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
  /**
   * ISO date of last significant content update — set this when a post is
   * refreshed so dateModified in the BlogPosting schema reflects real freshness
   * rather than the original publish date. Leave unset for new posts.
   */
  updatedISO?: string;
  excerpt: string;
  readMins: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "indian-passport-photo-size-rules",
    title: "Indian Passport Photo Size & Rules (Passport Seva 2026)",
    description:
      "Indian passport photos are 45×35 mm in print and exactly 630×810 px / under 250 KB online, on a plain white background. Full Passport Seva rules and a free maker.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "The Passport Seva spec is exact: a 45×35 mm printed photo or a 630×810 px JPEG under 250 KB, plain white background, face filling 80–85% of the frame. Here's every rule — plus how OCI and NRI applications differ.",
    readMins: 8,
  },
  {
    slug: "cutout-pro-alternative-india",
    title: "Free Cutout Pro Alternative India: No Subscription, No Watermark, No Upload",
    description:
      "Cutout.pro's passport photo feature costs 2 credits — free credits run out fast, then it's ₹246.50/month or more. Three free, on-device alternatives.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "Cutout.pro starts free but caps you at 5 credits — a passport photo costs 2. Once they're gone, it's a monthly subscription. Here are three tools that are free permanently, don't upload to a server, and work for India.",
    readMins: 5,
  },
  {
    slug: "best-free-exam-photo-resizer-india",
    title: "Best Free Exam Photo & Signature Resizer India (2026)",
    description:
      "Resize SSC, IBPS, UPSC, or RRB exam photos to exact KB and px specs for free. Five on-device tools compared: ExamMint, myexamphoto.in, govtphotoresizer.com, SarkariResizer, and easyPhoto.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-06-18",
    excerpt:
      "Every exam portal has its own KB and pixel spec — a general resize tool won't hit it. Five free tools that know the exact SSC, IBPS, UPSC, and RRB requirements, compared honestly on coverage, privacy, and breadth.",
    readMins: 7,
  },
  {
    slug: "best-free-passport-photo-maker-india-2026",
    title: "Best Free Passport Photo Maker Online India (2026)",
    description:
      "Seven free tools that make a compliant 35×45 mm Indian passport photo — compared on privacy, spec accuracy, and exam support. No ₹600 fees, no account required.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-06-18",
    excerpt:
      "Most tools either charge ₹600, upload your photo to a server, or use the wrong India spec. Here are five options compared on cost, privacy, and whether they actually know the 35×45 mm Seva requirement.",
    readMins: 6,
  },
  {
    slug: "visafoto-alternative-india-free",
    title: "Free Visafoto Alternative India: 4 Tools That Won't Charge ₹600",
    description:
      "Visafoto charges ₹600 per photo and uploads your image to a server. Four free alternatives that make India-compliant 35×45 mm passport photos in your browser — no payment, no upload.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "Visafoto is accurate, but ₹600 per photo and a server upload aren't necessary for most Indian passport or exam photos. Here are four free alternatives and when Visafoto is actually worth it.",
    readMins: 5,
  },
  {
    slug: "upsc-cse-ias-photo-signature-guide-2026",
    title: "UPSC CSE / IAS Photo & Signature Requirements 2026",
    description:
      "UPSC CSE: 20–300 KB JPG, min 350×350 px square, name and date mandatory, three signatures on one sheet. Live photo matching and 10-day recency rule explained.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "UPSC CSE 2026 added live webcam matching and a 10-day photo recency rule. Here are the confirmed specs, why three signatures are required, and the complete upload workflow.",
    readMins: 7,
  },
  {
    slug: "nda-cds-photo-signature-guide-2026",
    title: "NDA & CDS Photo and Signature Requirements 2026",
    description:
      "NDA and CDS: 20–300 KB JPG, min 350×350 px square, plain white background, name and date required at bottom. Rejection checklist and free UPSC resizer.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "NDA and CDS require a square photo — 350×350 px minimum — plus your name and date printed on the image. Here are the exact specs, the square vs portrait trap, and the complete upload workflow.",
    readMins: 7,
  },
  {
    slug: "ssc-cgl-chsl-photo-signature-guide-2026",
    title: "SSC CGL / CHSL Photo & Signature Size 2026",
    description:
      "SSC CGL and CHSL require a 20–50 KB JPG photo (live capture only, no gallery) and 10–20 KB signature. Spec table, rejection checklist, and free resizer.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    excerpt:
      "SSC now requires live photo capture — no gallery uploads. Here are the exact specs for CGL and CHSL, the six rejection reasons, and how to prepare your signature in one step.",
    readMins: 7,
  },
  {
    slug: "why-exam-photo-signature-rejected",
    title: "Why Exam Photos & Signatures Get Rejected (and the Fix)",
    description:
      "SSC, IBPS and RRB portals reject for predictable reasons: wrong KB, wrong dimensions, signature background. Here's each rejection reason and the quick fix.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    excerpt:
      "“Photo not as per specification.” “Invalid signature.” Exam portals reject for a handful of predictable reasons — here's every one, and the quick fix for each.",
    readMins: 6,
  },
  {
    slug: "add-name-date-on-exam-photo",
    title: "How to Add Name & Date on an Exam Photo (UPSC, Army)",
    description:
      "UPSC and Indian Army require your name and the photo date printed on the image. Here's the exact rule and how to add it free — no Photoshop needed.",
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
      "IBPS PO 2026 prelims are 22–23 August. The exact photo and signature spec, what gets rejected, and a free resizer to prepare now — before registration opens.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    excerpt:
      "IBPS PO 2026 prelims are on 22–23 August. Here's the exact photo and signature checklist to prepare now, so applying takes minutes when the form opens.",
    readMins: 5,
  },
  {
    slug: "schengen-europe-visa-photo-size",
    title: "Schengen Visa Photo Size: Germany, France, Italy & More",
    description:
      "Schengen visa photos are 35×45 mm and ICAO-biometric. Background rules differ by country — Germany grey, Italy white. Get the exact spec and make one free.",
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
      "UIDAI recommends sharing a masked Aadhaar hiding the first 8 digits. Here's when it's accepted and how to mask yours free, entirely on your device.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Sharing your full Aadhaar number is risky. UIDAI says to share a masked copy showing only the last 4 digits. Here's how to do it safely and free, entirely on your device.",
    readMins: 4,
  },
  {
    slug: "how-to-sign-exam-application-forms-india",
    title: "How to Sign an Exam Application Form in India (SSC, UPSC, IBPS Rules)",
    description:
      "Sign on white paper in black or blue ink, scan to JPG, keep it under 10–20 KB. Full portal-by-portal rules for SSC, UPSC, IBPS, RRB and Army Agniveer — plus why some forms need a transparent background.",
    date: "June 21, 2026",
    dateISO: "2026-06-21",
    excerpt:
      "Every major exam portal has its own KB limit and pixel dimension for your signature. Here's the exact spec for SSC, UPSC, IBPS, RRB and Army Agniveer — and why a transparent background matters for some forms.",
    readMins: 8,
  },
  {
    slug: "how-to-prepare-documents-for-exam-applications-india",
    title: "How to Prepare Documents for Online Exam Applications in India",
    description:
      "Photo 20–50 KB, signature 10–20 KB, certificates under 100 KB, Aadhaar masked. The complete workflow to prepare every document before you open an SSC, UPSC, IBPS or Railway portal.",
    date: "June 21, 2026",
    dateISO: "2026-06-21",
    excerpt:
      "Most exam application rejections come from the same four documents: photo, signature, certificates and Aadhaar. Here's the complete preparation workflow for every major Indian exam portal.",
    readMins: 10,
  },
  {
    slug: "how-to-compress-pdf",
    title: "How to Compress a PDF to 50, 100 or 200 KB (Free)",
    description:
      "Exam portals cap documents at 50–200 KB. How to compress a PDF to any KB target — marksheets, certificates, Aadhaar — free, without uploads.",
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
      "Merge PDF files into one, free. No sign-up, no upload, no watermark — everything runs in your browser. Covers marksheets, certificates and forms.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    excerpt:
      "Need one PDF from many? Drop your files, reorder if needed, and download the merged result in seconds. Nothing leaves your device.",
    readMins: 4,
  },
  {
    slug: "exam-photo-signature-size-guide",
    title: "Photo & Signature Size for Govt Exams: SSC, UPSC, IBPS",
    description:
      "Exact photo and signature KB limits, pixel dimensions and background rules for SSC, IBPS, SBI, UPSC, RRB and NTA exams — plus how to prepare your signature and resize to spec.",
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    updatedISO: "2026-06-18",
    excerpt:
      "Wrong KB, wrong pixels, grey signature background — these three mistakes account for nearly every upload rejection. Here's the exact spec for every major Indian exam and how to fix each failure.",
    readMins: 10,
  },
  {
    slug: "linkedin-profile-photo-size-and-tips",
    title: "LinkedIn Profile Photo: Size, Tips & How to Make One Free",
    description:
      "LinkedIn photos must be square, at least 400×400 px, under 8 MB. Here's why it displays as a circle, what looks professional, and how to crop one free.",
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
      "In India a resume photo is passport-size (35×45 mm). The US, UK and Canada omit it to avoid bias claims — the rules by region, the exact size, and a free maker.",
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
      "How to take a compliant passport photo at home: plain wall, good light, correct background colour, and the mistakes that get photos rejected.",
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
      "The real reasons passport photos bounce: wrong size, wrong background, glasses, expression, shadows — and how to fix each one before you submit.",
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
      "Passport photo sizes vary by country: 35×45 mm for most, 2×2 in for the US, 50×70 mm for Canada. Head height matters too. Get the exact spec per country.",
    date: "June 5, 2026",
    dateISO: "2026-06-05",
    excerpt:
      "2×2 inch, 35×45mm, 50×70mm: passport photo size isn't universal. Here's every major country's spec and how to hit it exactly.",
    readMins: 6,
  },
  {
    slug: "how-to-reduce-passport-photo-size-for-online-forms",
    title: "How to Reduce Passport Photo File Size (10–200 KB)",
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
      "Passport photos for babies must still comply. How to photograph an infant at home — white background, eyes open, no hands or toys — and get it accepted.",
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
      "White isn't universal. The UK requires grey or cream, Schengen prefers grey, the US wants white. The correct background per country and how to set it.",
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

/**
 * Topic clusters — used to make "Keep reading" relevant (same-topic posts
 * first) instead of just showing whichever posts sit first in the array. Keep a
 * post in exactly one cluster; any slug not listed falls back to array order.
 */
const CLUSTERS: Record<string, string[]> = {
  exam: [
    "how-to-prepare-documents-for-exam-applications-india",
    "exam-photo-signature-size-guide",
    "best-free-exam-photo-resizer-india",
    "how-to-sign-exam-application-forms-india",
    "upsc-cse-ias-photo-signature-guide-2026",
    "nda-cds-photo-signature-guide-2026",
    "ssc-cgl-chsl-photo-signature-guide-2026",
    "ibps-po-2026-photo-signature-checklist",
    "why-exam-photo-signature-rejected",
    "add-name-date-on-exam-photo",
  ],
  passport: [
    "indian-passport-photo-size-rules",
    "best-free-passport-photo-maker-india-2026",
    "visafoto-alternative-india-free",
    "cutout-pro-alternative-india",
    "schengen-europe-visa-photo-size",
    "how-to-take-a-passport-photo-at-home",
    "why-passport-photos-get-rejected",
    "passport-photo-size-by-country",
    "how-to-reduce-passport-photo-size-for-online-forms",
    "baby-and-infant-passport-photo-guide",
    "passport-photo-background-color",
  ],
  pdf: [
    "how-to-compress-pdf",
    "how-to-merge-pdf-free",
    "how-to-mask-aadhaar-before-sharing",
  ],
  professional: [
    "linkedin-profile-photo-size-and-tips",
    "resume-photo-size-and-rules",
  ],
};

/** The cluster a post belongs to, or undefined if it isn't grouped. */
export function clusterOf(slug: string): string | undefined {
  for (const [cluster, slugs] of Object.entries(CLUSTERS)) {
    if (slugs.includes(slug)) return cluster;
  }
  return undefined;
}

/**
 * Up to `n` posts to show as "Keep reading": same-cluster posts first (most
 * relevant), then fill any remaining slots in array order. Never returns the
 * current post.
 */
export function relatedPosts(slug: string, n = 2): BlogPost[] {
  const cluster = clusterOf(slug);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug);
  const sameCluster = cluster
    ? others.filter((p) => clusterOf(p.slug) === cluster)
    : [];
  const sameSlugs = new Set(sameCluster.map((p) => p.slug));
  const rest = others.filter((p) => !sameSlugs.has(p.slug));
  return [...sameCluster, ...rest].slice(0, n);
}
