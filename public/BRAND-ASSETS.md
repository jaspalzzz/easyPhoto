# Brand assets

The logo lives as editable vector source:
- `public/icon.svg` — the camera + ID-photo mark (also `components/site/LogoMark.tsx`)
- `public/logo.svg` — full logo (mark + "easyPhoto" wordmark)

## Generated raster assets

All PNGs below are produced from the SVGs by `scripts/gen-icons.mjs`
(`node scripts/gen-icons.mjs`). Re-run it whenever the SVGs change.

| File | Size | Used by |
|------|------|---------|
| `favicon-16x16.png`, `favicon-32x32.png` | 16 / 32 | browser tab |
| `icon.svg` | vector | modern browsers |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `icon-192.png`, `icon-512.png` | PWA manifest |
| `icon-512-maskable.png` | 512 (safe-zone) | Android maskable |
| `og.png` | 1200×630 | social share card |

> These are a faithful vector recreation of the supplied logo in the exact brand
> palette (document teal #157F75, orange #F57819). To use a precise raster instead, drop
> your file at `public/logo.svg` (or edit the SVGs) and re-run the script.
