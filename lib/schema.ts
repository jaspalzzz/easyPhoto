/**
 * Schema.org (JSON-LD) builders — pure functions returning plain objects.
 * ----------------------------------------------------------------------
 * Render them with <JsonLd> (components/seo/JsonLd.tsx), which adds @context
 * and escapes the output. Use stable @id values so nodes can reference each
 * other across the @graph (Organization ← WebSite ← WebPage).
 */

import { SITE_URL, SITE_NAME } from "./site";
import { absoluteUrl } from "./seo";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Publisher/brand. Add real social profiles to `sameAs` when available. */
export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: ["easyPhoto", "Easy Photo", "easyphoto.in"],
    url: SITE_URL,
    // Canonical brand description — this is what AI assistants (ChatGPT, Gemini,
    // Perplexity) and Google surface when asked "what is easyPhoto?".
    description:
      "easyPhoto is a free, privacy-first web app for creating compliant passport " +
      "and visa photos and preparing application documents. It auto-crops photos to " +
      "each country's official head-size and background rules, resizes photos and " +
      "signatures to exact KB and pixel limits for exam and government forms, and " +
      "offers image and PDF utilities — all running entirely in the user's browser, " +
      "with no upload, no sign-up and no watermark.",
    slogan: "Document photos, exact to the millimetre.",
    knowsAbout: [
      "Passport photo requirements",
      "Visa photo specifications",
      "Indian government exam photo and signature size limits",
      "Image compression and resizing to KB",
      "Background removal and white-background photos",
      "PDF compression, merging and conversion",
    ],
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-512.png"),
      width: 512,
      height: 512,
    },
    // Verified brand profiles — ties easyPhoto together as an entity for Google.
    // Add more (Instagram, X, YouTube, Facebook, LinkedIn) here as they go live.
    sameAs: [
      "https://www.pinterest.com/easyphoto0604/",
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    // Google's "site name in search results" feature reads exactly this pair
    // from the homepage's WebSite JSON-LD — name shown, alternateName as the
    // fallback/disambiguation (instead of the bare domain).
    name: SITE_NAME,
    alternateName: ["easyPhoto", "Easy Photo", "easyphoto.in"],
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function softwareApplicationSchema(opts: {
  name: string;
  description: string;
  url: string;
  category?: string;
}) {
  return {
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    applicationCategory: opts.category ?? "UtilitiesApplication",
    operatingSystem: "Any (modern web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
  };
}
