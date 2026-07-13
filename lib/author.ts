/**
 * Blog author identity — the named-author E-E-A-T signal (Google's "Who").
 * Every field is confirmed by the author; this is published on every post and
 * feeds Person schema.
 */
export const AUTHOR = {
  name: "Jaspal Kumar",
  /** A bounded description of Jaspal's role, not an authority credential. */
  title: "easyPhoto developer",
  bio:
    "Jaspal Kumar builds and maintains easyPhoto. With over 10 years of hands-on " +
    "experience in web and mobile development, he focuses on privacy-first " +
    "in-browser image tools and maintains source-linked specification records " +
    "for easyPhoto.",
  knowsAbout: [
    "Web and mobile development",
    "In-browser image processing",
    "Source-linked document photo specifications",
  ],
  /** On-site identity is the byline and Person-schema URL. */
  url: "/authors/jaspal-kumar/",
  /** External identity remains the Person.sameAs reference. */
  linkedIn: "https://www.linkedin.com/in/jaspal-jk/",
  sameAs: ["https://www.linkedin.com/in/jaspal-jk/"],
  /** Headshot in public/authors/. Avatar falls back to "JK" initials if absent. */
  photo: "/authors/jaspal-kumar.jpeg",
} as const;
