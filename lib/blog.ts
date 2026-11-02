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
  /** The closing call-to-action sentence, written for this post. */
  ctaText: string;
  /**
   * True when the post quotes sizes or format rules from an authority, with a link to
   * the source; shows the "where these figures come from" note. Lifestyle and
   * how-to posts leave it unset.
   */
  citesOfficialSources?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "sir-enumeration-form-photo-2026",
    title: "SIR Form Photo Size 2026 — What the ECI Actually Requires",
    description:
      "The online SIR enumeration form has no photo-upload step and the ECI publishes no SIR photo size. Here is what is actually required, and when a standard voter photo genuinely applies.",
    date: "July 22, 2026",
    dateISO: "2026-07-22",
    updatedISO: "2026-11-02",
    excerpt:
      "The online SIR enumeration form has no photo upload and the ECI publishes no SIR photo size. Here is what the form asks for, and when a voter photo does apply.",
    readMins: 5,
    ctaText: "Filing a new registration (Form 6) instead? Prepare the voter photo on white, under 2 MB.",
    citesOfficialSources: true,
  },
  {
    slug: "indian-government-id-photo-requirements",
    title: "Indian Government ID Photo Size 2026: PAN, Voter ID, DL & Aadhaar",
    description:
      "PAN, voter ID, driving-licence and Aadhaar photo rules side by side: the file-size limits, pixel sizes and crop shapes each official portal publishes.",
    date: "July 4, 2026",
    dateISO: "2026-07-04",
    updatedISO: "2026-11-02",
    excerpt:
      "PAN, voter ID, Aadhaar and driving-licence applications each set their own photo rules. Compare the limits each portal publishes before you prepare a file.",
    readMins: 8,
    ctaText: "Make a separate file for each ID: enter the KB limit your portal shows and download a JPG.",
    citesOfficialSources: true,
  },
  {
    slug: "indian-passport-photo-requirements",
    title: "Indian Passport Photo Rules 2026: Adults vs Children Under 4",
    description:
      "Indian passport photo rules explained: adults are photographed at the PSK/POPSK, children below four need a 35×45 mm print, and overseas, OCI and e-Visa rules differ.",
    date: "June 24, 2026",
    dateISO: "2026-06-24",
    updatedISO: "2026-11-02",
    excerpt:
      "Ordinary adults do not upload or carry a passport photo to a PSK/POPSK: it is captured at the centre. The 35×45 mm white-background print is the below-four exception.",
    readMins: 6,
    ctaText: "Applying for a child under four? Make the 35 × 45 mm white-background print.",
    citesOfficialSources: true,
  },
  {
    slug: "best-free-passport-photo-maker-india-2026",
    title: "Best Free Passport Photo Maker Online India (2026)",
    description:
      "Free and paid passport photo tools compared for India's under-four 35×45 mm print, overseas photos and exam forms: cost, privacy and the sizes each covers.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-11-02",
    excerpt:
      "Photo tools compared on cost, privacy and whether they cover India's under-four passport print and exam forms.",
    readMins: 6,
    ctaText: "Need the under-four 35 × 45 mm print? Make it in your browser, free.",
  },
  {
    slug: "upsc-cse-ias-photo-signature-guide-2026",
    title: "UPSC CSE / IAS Photo & Signature Requirements 2026",
    description:
      "UPSC CSE 2026: a 20–200 KB JPG photo on white, a live photo taken in the form, and three black-ink signatures in one 20–100 KB, 350–500 px JPG.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    // Re-checked against UPSC's upload instructions: live photo added (15 Oct 2026).
    updatedISO: "2026-11-02",
    excerpt:
      "UPSC uses one OTR portal for CSE, NDA and CDS. Here are the limits it publishes, how the three-signature sheet and the live photo work, and the upload steps in order.",
    readMins: 7,
    ctaText: "Make the 20–200 KB UPSC photo and the three-signature JPG.",
    citesOfficialSources: true,
  },
  {
    slug: "ssc-cgl-chsl-photo-signature-guide-2026",
    // Searchers ask how the live photo works ("ssc chsl live photo upload", "ssc
    // live photo capture instructions"); the SSC exam page owns "signature size".
    // Re-checked against SSC's 2026 notices (as on the SSC page, 8 Oct 2026).
    title: "SSC CHSL & CGL Live Photo 2026: How the Photo Step Works",
    description:
      "SSC CHSL and CGL 2026 capture your photo live through the camera, so there is no photo file to upload. How the photo step works, what gets rejected, and the signature.",
    date: "June 18, 2026",
    dateISO: "2026-06-18",
    updatedISO: "2026-11-02",
    excerpt:
      "SSC captures your photo live in the form, so there is no photo file. How the camera step works, what gets it rejected, and the one file you do upload: the signature.",
    readMins: 7,
    ctaText: "The signature is the only SSC file you upload: make it a 10–20 KB JPG.",
    citesOfficialSources: true,
  },
  {
    slug: "why-exam-photo-signature-rejected",
    title: "Exam Photo Rejected? 6 Reasons SSC, IBPS & UPSC Say No (2026)",
    description:
      "Why SSC, IBPS and UPSC portals refuse a photo or signature: KB band, pixel size, file format, signature crop, name and date text, and the live photo, with a fix for each.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    updatedISO: "2026-11-02",
    excerpt:
      "“Photo not as per specification” can mean six different things. Here is how to tell which one, and the fix for each.",
    readMins: 6,
    ctaText: "Pick your exam to see whether it takes a photo file or a live photo, then prepare what it asks for.",
    citesOfficialSources: true,
  },
  {
    slug: "add-name-date-on-exam-photo",
    title: "How to Add Name & Date to an Exam Photo (2026)",
    description:
      "Add a name-and-date strip only when your notice asks for one. Which exams want it (TNPSC, APPSC, Kerala PSC), which don't (UPSC, SSC, IBPS), and which use a chalk slate.",
    date: "June 13, 2026",
    dateISO: "2026-06-13",
    updatedISO: "2026-11-02",
    excerpt:
      "APPSC and Kerala PSC ask for the name and photo date printed on the photo; UPSC, SSC and IBPS do not, and Navy and Air Force Agniveer use a chalk slate instead.",
    readMins: 5,
    ctaText: "Only if your notice asks for it: add your name and the photo date below the photo.",
    citesOfficialSources: true,
  },
  {
    slug: "schengen-europe-visa-photo-size",
    title: "Schengen Visa Photo Size: Germany, France, Italy & More",
    description:
      "Schengen visa photos are 35×45 mm and ICAO-biometric. Background rules differ by country — Germany grey, Italy white. Get the exact spec and make one free.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    updatedISO: "2026-11-02",
    excerpt:
      "Every Schengen visa photo is 35×45 mm and ICAO-biometric — but the background rule differs by country. Here's the exact spec for Germany, France, Italy and more, and how to make one free.",
    readMins: 5,
    ctaText: "Make a 35 × 45 mm Schengen photo with the background your mission asks for.",
    citesOfficialSources: true,
  },
  {
    slug: "how-to-mask-aadhaar-before-sharing",
    title: "How to Mask Your Aadhaar Number Before Sharing It (Free)",
    description:
      "UIDAI recommends sharing a masked Aadhaar hiding the first 8 digits. Here's when to share it and how to mask yours free, entirely on your device.",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    updatedISO: "2026-11-02",
    excerpt:
      "Sharing your full Aadhaar number is risky. UIDAI says to share a masked copy showing only the last 4 digits. Here's how to do it safely and free, entirely on your device.",
    readMins: 4,
    ctaText: "Masked copy too big for the form? Bring it under the portal's KB limit.",
  },
  {
    slug: "how-to-sign-exam-application-forms-india",
    title: "How to Sign an Exam Application Form in India (SSC, UPSC, IBPS Rules)",
    description:
      "Signature upload rules for SSC, UPSC, IBPS, SBI and RRB: KB bands, pixel sizes, ink and paper, and why UPSC wants three signatures in one image.",
    date: "June 21, 2026",
    dateISO: "2026-06-21",
    updatedISO: "2026-11-02",
    excerpt:
      "SSC, IBPS, SBI and RRB each want one signature file with its own KB band; UPSC wants three signatures in one image. How to sign, scan and size yours.",
    readMins: 8,
    ctaText: "Clean your signature scan and export a white-background JPG for the portal.",
    citesOfficialSources: true,
  },
  {
    slug: "how-to-sign-on-image-online",
    title: "How to Sign on Image Online: Add a Signature to Any Photo",
    description:
      "Add a signature to a photo or image online: draw, upload a transparent signature PNG, place it, resize it and download the signed image in your browser.",
    date: "July 8, 2026",
    dateISO: "2026-07-08",
    updatedISO: "2026-11-02",
    excerpt:
      "Put a handwritten signature on a JPG or PNG: make a transparent signature, place it, and download the signed image without printing and scanning again.",
    readMins: 5,
    ctaText: "Place your signature on a JPG or PNG and download it, without uploading the file.",
  },
  {
    slug: "how-to-prepare-documents-for-exam-applications-india",
    title: "How to Prepare Documents for Online Exam Applications in India",
    description:
      "Prepare the photo, signature, certificate scans and masked Aadhaar for SSC, UPSC, IBPS and Railway forms, in an order that avoids redoing work.",
    date: "June 21, 2026",
    dateISO: "2026-06-21",
    updatedISO: "2026-11-02",
    excerpt:
      "A checklist for the four uploads most exam forms ask for: photo, signature, certificate PDFs and a masked Aadhaar.",
    readMins: 10,
    ctaText: "Prepare the photo and signature for the exam you pick, at the sizes its notice gives.",
    citesOfficialSources: true,
  },
  {
    slug: "exam-photo-signature-size-guide",
    title: "Exam Photo & Signature Size 2026: SSC, UPSC, IBPS, RRB — Full Guide",
    description:
      "Photo and signature sizes for SSC, UPSC, IBPS, SBI, RRB and NTA side by side: which exams take a live photo, the KB bands, and the pixel sizes each publishes.",
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    // UPSC signature pixels and live photo corrected, SBI link fixed (15 Oct 2026).
    updatedISO: "2026-11-02",
    excerpt:
      "Which exams take a live photo, which want a prepared file, and the KB band and pixel size each one publishes, in one table.",
    readMins: 10,
    ctaText: "Pick your exam and download a photo and signature at the sizes it publishes.",
    citesOfficialSources: true,
  },
  {
    slug: "linkedin-profile-photo-size-and-tips",
    title: "LinkedIn Profile Photo: Size, Tips & How to Make One Free",
    description:
      "LinkedIn shows your photo in a circle: use a square image of at least 400×400 px, under 8 MB. What looks professional, and how to crop one free.",
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    updatedISO: "2026-11-02",
    excerpt:
      "Square, at least 400×400, face centred for the circle crop. Here's the exact LinkedIn photo size and the tips that make a headshot look professional.",
    readMins: 5,
    ctaText: "Want a plain backdrop behind your headshot? Remove the background in your browser.",
  },
  {
    slug: "resume-photo-size-and-rules",
    title: "Resume Photo: Size, Background & Rules (India Guide)",
    description:
      "In India a resume photo is usually passport-size (35×45 mm). When to include one by region, the size, background and attire, and a free maker.",
    date: "June 7, 2026",
    dateISO: "2026-06-07",
    updatedISO: "2026-11-02",
    excerpt:
      "In India a resume photo is usually passport-size on a plain background. Here's when to include one, the exact size, and how to make it look professional.",
    readMins: 5,
    ctaText: "Make a 35 × 45 mm resume photo on a plain white background.",
  },
  {
    slug: "how-to-take-a-passport-photo-at-home",
    title: "How to Take a Passport Photo at Home (and Get It Accepted)",
    description:
      "Take a passport photo at home: a plain wall, soft window light, the right background colour for your country, and the faults to avoid before you crop.",
    date: "June 6, 2026",
    dateISO: "2026-06-06",
    updatedISO: "2026-11-02",
    excerpt:
      "With a phone, a window and a plain wall you can take a usable passport photo at home. Here's the setup, step by step.",
    readMins: 5,
    ctaText: "Pick your country and crop your home photo to its size and background.",
    citesOfficialSources: true,
  },
  {
    slug: "why-passport-photos-get-rejected",
    title: "Why Passport Photos Get Rejected (and How to Avoid It)",
    description:
      "Why passport photos are refused: wrong size or head height, wrong background, glasses, expression, shadows, file size and an old photo, with the fix for each.",
    date: "June 6, 2026",
    dateISO: "2026-06-06",
    updatedISO: "2026-11-02",
    excerpt:
      "Most refusals come from a few fixable faults: size, background, glasses, lighting, file size and age. Here is each one and how to avoid it.",
    readMins: 6,
    ctaText: "Crop your photo to your country's size and head height, and set its background.",
    citesOfficialSources: true,
  },
  {
    slug: "passport-photo-size-by-country",
    title: "Passport Photo Size by Country: US, India, UK, Canada & More",
    description:
      "Passport photo sizes vary by country: 35×45 mm for most, 2×2 in for the US, 50×70 mm for Canada. Head height matters too. Get the exact spec per country.",
    date: "June 5, 2026",
    dateISO: "2026-06-05",
    updatedISO: "2026-11-02",
    excerpt:
      "2×2 inch, 35×45 mm, 50×70 mm: passport photo size isn't universal. Here are the sizes and head heights for six major destinations.",
    readMins: 6,
    ctaText: "Pick your country and get its print size and head height without measuring.",
    citesOfficialSources: true,
  },
  {
    slug: "how-to-reduce-passport-photo-size-for-online-forms",
    title: "How to Reduce Passport Photo File Size (10–200 KB)",
    description:
      "Passport, visa and exam portals each set a file-size limit, and some a minimum too. How to compress a photo to the limit your form shows without making it blurry.",
    date: "June 4, 2026",
    dateISO: "2026-06-04",
    updatedISO: "2026-11-02",
    excerpt:
      "Portals reject photos that are too large. Here's how to hit an exact KB limit, whether that's 20, 50 or 100 KB, while keeping your photo sharp.",
    readMins: 5,
    ctaText: "Enter the KB limit your portal shows and download a JPG that fits it.",
    citesOfficialSources: true,
  },
  {
    slug: "baby-and-infant-passport-photo-guide",
    title: "How to Take a Baby or Infant Passport Photo at Home",
    description:
      "How to photograph a baby for a passport at home: lay them on a plain white sheet, shoot from above, keep hands out of frame, and know which rules are relaxed for infants.",
    date: "June 3, 2026",
    dateISO: "2026-06-03",
    updatedISO: "2026-11-02",
    excerpt:
      "No studio needed: how to take a baby passport photo on a plain sheet with your phone, and which adult rules are relaxed for infants.",
    readMins: 5,
    ctaText: "Crop your baby's photo to the destination country's size and background.",
    citesOfficialSources: true,
  },
  {
    slug: "passport-photo-background-color",
    title: "Passport Photo Background Color: White, Grey or Cream?",
    description:
      "White isn't universal: the US wants white, the UK accepts any plain light colour, and Schengen missions differ. The background for each country and how to set it.",
    date: "June 2, 2026",
    dateISO: "2026-06-02",
    updatedISO: "2026-11-02",
    excerpt:
      "The US wants white, the UK accepts any plain light colour, and Schengen missions set their own. Here's the background for each country and how to apply it.",
    readMins: 5,
    ctaText: "Pick your country and its background colour is applied for you.",
    citesOfficialSources: true,
  },
  {
    slug: "pan-card-photo-size",
    title: "PAN Card Photo Size: Exact Dimensions, KB Limit & Signature Spec (NSDL / UTIITSL)",
    description:
      "PAN card photo is 25×35 mm, JPEG, max 20 KB for Protean (NSDL) or under 30 KB for UTIITSL. Signature specs differ too. Official figures and a free resizer.",
    date: "June 23, 2026",
    dateISO: "2026-06-23",
    updatedISO: "2026-11-02",
    excerpt:
      "Protean (NSDL) and UTIITSL publish different PAN photo and signature sizes. Here are both side by side, and which one your route needs.",
    readMins: 7,
    ctaText: "Make the Protean PAN photo (under 20 KB) and signature (under 10 KB) in one place.",
    citesOfficialSources: true,
  },
  {
    slug: "what-is-dpi-and-how-to-change-it",
    title: "What Is DPI and How to Change It — Image Resolution Explained",
    description:
      "DPI is a print setting, not a measure of quality. When it matters (Protean PAN asks for 200 DPI, UTIITSL for 300 and 600 dpi), when it doesn't, and how to change it without re-saving the JPEG.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    updatedISO: "2026-11-02",
    excerpt:
      "Most portals check file size and pixel size, not DPI. PAN is the main exception: Protean asks for 200 DPI, UTIITSL for 300 dpi (photo) and 600 dpi (signature).",
    readMins: 6,
    ctaText: "Change the DPI number in your JPEG without re-saving the image.",
    citesOfficialSources: true,
  },
  {
    slug: "how-to-print-passport-photos-at-home",
    title: "How to Print Passport Photos at Home — Sheet Layout, DPI & Paper Guide",
    description:
      "Print passport photos at home: tile them on a 4×6 inch or A4 sheet at 300 DPI, use photo paper, switch off 'fit to page', and cut along the guides.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    updatedISO: "2026-11-02",
    excerpt:
      "Printing passport photos at home comes down to a correctly cropped image, photo paper, and 'fit to page' switched off so each photo prints at its real size.",
    readMins: 6,
    ctaText: "Tile your photo on an A4 or 4×6 inch sheet with cut guides, ready to print.",
  },
  {
    slug: "how-to-remove-background-from-photo-free",
    title: "How to Remove Background from Photo Free — No Upload, No Watermark",
    description:
      "Remove a photo background in your browser: no upload, no account, no watermark. Download a transparent PNG or put the photo on white for an ID form.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    updatedISO: "2026-11-02",
    excerpt:
      "The background remover runs in your browser, so your photo is never uploaded. Download a transparent PNG, or switch to a white background for ID photos.",
    readMins: 6,
    ctaText: "Remove a background in your browser and download a transparent PNG or a white-background photo.",
  },
  {
    slug: "voter-id-photo-requirements-2026",
    title: "Voter ID Photo Size 2026: 4.5 cm × 3.5 cm, Under 2 MB JPG",
    description:
      "Voter ID photo: 4.5 × 3.5 cm, colour, white background, unsigned; uploaded on the Voters' Service Portal as a JPG or JPEG of up to 2 MB.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    updatedISO: "2026-11-02",
    excerpt:
      "What ECI's Form 6 asks of the photo, the portal's 2 MB JPG upload limit, and why uploads get refused.",
    readMins: 6,
    ctaText: "Crop to 4.5 × 3.5 cm on white and save a JPG under 2 MB for the Form 6 upload.",
    citesOfficialSources: true,
  },
  {
    slug: "driving-licence-photo-size-sarathi",
    title: "Driving Licence Photo Size for Sarathi Portal 2026 — RTO Upload Spec",
    description:
      "Sarathi's scan guide asks for 10–20 KB JPG photo and signature files, at a preferred 420×525 px and 256×64 px. Confirm the screen for your state and service.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    updatedISO: "2026-11-02",
    excerpt:
      "Sarathi's scan guide asks for a 10–20 KB JPG photo at 420×525 px and a 10–20 KB signature at 256×64 px, signed in black pen.",
    readMins: 6,
    ctaText: "Make the 420 × 525 px photo and 256 × 64 px signature, each 10–20 KB.",
    citesOfficialSources: true,
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
  govId: [
    "sir-enumeration-form-photo-2026",
    "indian-government-id-photo-requirements",
    "pan-card-photo-size",
    "voter-id-photo-requirements-2026",
    "driving-licence-photo-size-sarathi",
    "how-to-mask-aadhaar-before-sharing",
  ],
  signature: [
    "how-to-sign-on-image-online",
    "how-to-sign-exam-application-forms-india",
  ],
  exam: [
    "how-to-prepare-documents-for-exam-applications-india",
    "exam-photo-signature-size-guide",
    "upsc-cse-ias-photo-signature-guide-2026",
    "ssc-cgl-chsl-photo-signature-guide-2026",
    "why-exam-photo-signature-rejected",
    "add-name-date-on-exam-photo",
  ],
  passport: [
    "indian-passport-photo-requirements",
    "how-to-print-passport-photos-at-home",
    "what-is-dpi-and-how-to-change-it",
    "how-to-remove-background-from-photo-free",
    "best-free-passport-photo-maker-india-2026",
    "schengen-europe-visa-photo-size",
    "how-to-take-a-passport-photo-at-home",
    "why-passport-photos-get-rejected",
    "passport-photo-size-by-country",
    "how-to-reduce-passport-photo-size-for-online-forms",
    "baby-and-infant-passport-photo-guide",
    "passport-photo-background-color",
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
 *
 * The cluster is rotated by this post's own position in it. Slicing the
 * unrotated list returned the first `n` members of the cluster to every post in
 * that cluster, so a 16-member cluster surfaced the same two posts 16 times and
 * left 20 of 39 posts with no inbound "Keep reading" link at all. Rotating by
 * index spreads the same number of links evenly and stays deterministic, which
 * a static export needs for reproducible builds.
 */
export function relatedPosts(slug: string, n = 2): BlogPost[] {
  const cluster = clusterOf(slug);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug);
  const sameCluster = cluster
    ? others.filter((p) => clusterOf(p.slug) === cluster)
    : [];
  const offset = cluster ? Math.max(0, CLUSTERS[cluster].indexOf(slug)) : 0;
  const rotated = sameCluster.map(
    (_, i) => sameCluster[(i + offset) % sameCluster.length]
  );
  const sameSlugs = new Set(sameCluster.map((p) => p.slug));
  const rest = others.filter((p) => !sameSlugs.has(p.slug));
  return [...rotated, ...rest].slice(0, n);
}
