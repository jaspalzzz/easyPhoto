# Fonts

The four typefaces the site uses, as the subset files `next/font/google`
produced for the 20 Nov 2026 build. They are served from here so the build does
not download them from Google (see the header of `fonts.css` for why).

| Family | Used for | Source | Licence |
|---|---|---|---|
| Inter | body text (`--font-sans`) | https://fonts.google.com/specimen/Inter | SIL Open Font License 1.1 |
| Space Grotesk | headings (`--font-display`) | https://fonts.google.com/specimen/Space+Grotesk | SIL Open Font License 1.1 |
| Outfit | homepage hero figures (`--font-outfit`) | https://fonts.google.com/specimen/Outfit | SIL Open Font License 1.1 |
| JetBrains Mono | labels and code (`--font-mono`) | https://fonts.google.com/specimen/JetBrains+Mono | SIL Open Font License 1.1 |

Licence text: https://openfontlicense.org/open-font-license-official-text/

Each file is a variable font covering one script (`latin`, `latin-ext`,
`cyrillic`, ...). `fonts.css` maps them to weights and character ranges.

## Updating a font

1. Replace the `.woff2` file, keeping its name.
2. If the new version's character ranges or metrics differ, update the matching
   `@font-face` rules and the `... Fallback` overrides in `fonts.css`.
3. `test/selfHostedFonts.test.ts` checks every rule points at a file that
   exists and that nothing imports `next/font/google` again.
