/**
 * Generate favicon / app-icon / OG PNGs from the source SVGs.
 * Run:  node scripts/gen-icons.mjs
 * Requires: sharp (already a transitive dep).
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";

const PUB = new URL("../public/", import.meta.url);
const icon = readFileSync(new URL("icon.svg", PUB));
const logo = readFileSync(new URL("logo.svg", PUB));
const out = (name) => new URL(name, PUB).pathname;

const ICON_SIZES = {
  "favicon-16x16.png": 16,
  "favicon-32x32.png": 32,
  "apple-touch-icon.png": 180,
  "icon-192.png": 192,
  "icon-512.png": 512,
};

for (const [name, size] of Object.entries(ICON_SIZES)) {
  await sharp(icon, { density: 384 }).resize(size, size).png().toFile(out(name));
}

// Maskable: mark at ~64% on a white square (safe zone for Android masks).
const inner = Math.round(512 * 0.64);
const maskInner = await sharp(icon, { density: 384 })
  .resize(inner, inner)
  .png()
  .toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: "#ffffff" },
})
  .composite([{ input: maskInner, gravity: "centre" }])
  .png()
  .toFile(out("icon-512-maskable.png"));

// OG social card: full logo centred on a 1200×630 white canvas.
const ogLogo = await sharp(logo, { density: 384 })
  .resize(820, null, { fit: "inside" })
  .png()
  .toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: "#ffffff" },
})
  .composite([{ input: ogLogo, gravity: "centre" }])
  .png()
  .toFile(out("og.png"));

console.log("Generated: favicons, app icons, maskable, og.png");
