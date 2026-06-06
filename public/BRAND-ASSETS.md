# Brand assets to add to /public

The site metadata, manifest, and header already reference these files. Drop the
exported logo assets here with these exact names and everything wires up
automatically (no code change needed):

| File | Size | Used by |
|------|------|---------|
| `favicon.ico` | 16/32/48 multi | browser tab icon |
| `icon.svg` | vector | modern browsers (sharp at any size) |
| `apple-touch-icon.png` | 180×180 | iOS home-screen icon |
| `icon-192.png` | 192×192 | PWA manifest |
| `icon-512.png` | 512×512 | PWA manifest |
| `icon-512-maskable.png` | 512×512 (safe-zone padded) | Android maskable icon |
| `og.png` | 1200×630 | social share card (OpenGraph/Twitter) |
| `logo.svg` | vector | full header logo (optional) |

Tips
- Use the **simplified camera+frame mark** (drop the small silhouette detail) for
  the favicon/icon sizes so it stays legible at 16–32px.
- For the maskable icon, keep the mark inside the central ~80% safe zone.
- To show the full SVG logo in the header instead of the text wordmark, replace
  `<Wordmark />` in `app/layout.tsx` and `components/site/Footer.tsx` with:
  `<img src="/logo.svg" alt="easyPhoto" className="h-7 w-auto" />`
