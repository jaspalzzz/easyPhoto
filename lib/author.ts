/**
 * Blog author identity — the named-author E-E-A-T signal (Google's "Who").
 * Every field is confirmed by the author; this is published on every post and
 * feeds Person schema.
 */
export const AUTHOR = {
  name: "Jaspal Kumar",
  /**
   * What Jaspal does for readers, as a heading or a line under his name. A
   * plain description of the job, not an authority credential.
   */
  title: "Developer of easyPhoto",
  /** The same, for use mid-sentence: "Reviewed by Jaspal Kumar, who builds …". */
  byline: "who builds easyPhoto and checks each requirement against its published source",
  bio:
    "Jaspal Kumar builds and runs easyPhoto. He has more than ten years of " +
    "experience in web and mobile development. For each exam, ID and passport " +
    "requirement on the site, he compares the figures with the authority's " +
    "published notice where one exists, links that source on the page, and marks " +
    "any figure that still needs a check.",
  knowsAbout: [
    "Web and mobile development",
    "In-browser image processing",
    "Indian exam and document photo requirements",
  ],
  /** On-site identity is the byline and Person-schema URL. */
  url: "/authors/jaspal-kumar/",
  /** External identity remains the Person.sameAs reference. */
  linkedIn: "https://www.linkedin.com/in/jaspal-jk/",
  sameAs: ["https://www.linkedin.com/in/jaspal-jk/"],
  /** Headshot in public/authors/. Avatar falls back to "JK" initials if absent. */
  photo: "/authors/jaspal-kumar.jpeg",
} as const;
