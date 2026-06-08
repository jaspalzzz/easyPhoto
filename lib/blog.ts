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
