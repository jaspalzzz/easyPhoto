/**
 * Renders JSON-LD structured data. Pass one schema object or an array (emitted
 * as an @graph). `<` is escaped so content can never break out of the script.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const json = Array.isArray(schema)
    ? { "@context": "https://schema.org", "@graph": schema }
    : { "@context": "https://schema.org", ...schema };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}
