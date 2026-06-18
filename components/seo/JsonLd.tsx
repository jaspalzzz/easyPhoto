/**
 * Renders JSON-LD structured data. Pass one schema object or an array (emitted
 * as an @graph). `<` is escaped so content can never break out of the script.
 */
export function JsonLd({ schema }: { schema: unknown }) {
  // Filter out nullish entries (e.g. deprecated builders that emit nothing) so a
  // skipped schema never leaves a `null` in the @graph or an empty script tag.
  const items = (Array.isArray(schema) ? schema : [schema]).filter(
    Boolean
  ) as object[];
  if (items.length === 0) return null;
  const json =
    items.length === 1
      ? { "@context": "https://schema.org", ...items[0] }
      : { "@context": "https://schema.org", "@graph": items };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}
