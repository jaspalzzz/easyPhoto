/**
 * Blog author identity — the named-author E-E-A-T signal (Google's "Who").
 * Keep every field TRUE and confirmed by the person; this is published on every
 * post and feeds Person schema. DRAFT fields (title/bio) await owner sign-off.
 */
export const AUTHOR = {
  name: "Jaspal Kumar",
  /** DRAFT — confirm the exact public title. */
  title: "Founder, easyPhoto",
  /** DRAFT — confirm/edit. Grounded in verifiable facts (he builds the product). */
  bio:
    "Jaspal Kumar is the founder of easyPhoto. He builds privacy-first, in-browser " +
    "tools for passport, visa and exam photos, and maintains the photo- and " +
    "signature-spec data the site verifies against official government sources.",
  /** Public profile — used as the byline link and Person.sameAs. */
  url: "https://www.linkedin.com/in/jaspal-jk/",
  /**
   * Headshot served from /public. EMPTY for now → the avatar shows clean "JK"
   * initials (no broken-image flash). Save the supplied photo to
   * public/authors/jaspal-kumar.jpg, then set this to "/authors/jaspal-kumar.jpg".
   */
  photo: "",
};
