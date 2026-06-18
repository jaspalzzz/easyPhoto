/**
 * Blog author identity — the named-author E-E-A-T signal (Google's "Who").
 * Every field is confirmed by the author; this is published on every post and
 * feeds Person schema.
 */
export const AUTHOR = {
  name: "Jaspal Kumar",
  /** Credential-forward title (the Expertise signal). */
  title: "Web & mobile developer",
  /** Leads with hands-on experience; ties to the product he builds. */
  bio:
    "Jaspal Kumar builds and maintains easyPhoto. With over 10 years of hands-on " +
    "experience in web and mobile development, he focuses on privacy-first, " +
    "in-browser tools for passport, visa and exam photos — and on verifying every " +
    "photo and signature spec against the official government sources.",
  /** Topics for Person.knowsAbout — entity clarity for search + AI. */
  knowsAbout: [
    "Passport and visa photo requirements",
    "Document and image processing",
    "Web and mobile development",
  ],
  /** Public profile — byline link and Person.sameAs. */
  url: "https://www.linkedin.com/in/jaspal-jk/",
  /**
   * Headshot served from /public. EMPTY for now → the avatar shows clean "JK"
   * initials (no broken-image flash). Save the photo to
   * public/authors/jaspal-kumar.jpg, then set this to "/authors/jaspal-kumar.jpg".
   */
  photo: "",
};
