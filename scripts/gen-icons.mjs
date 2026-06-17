/**
 * Generate favicon / app-icon / OG PNGs from the source SVGs.
 * Run:  node scripts/gen-icons.mjs
 * Requires: sharp (already a transitive dep).
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

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

// favicon.ico — sharp can't write .ico, so pack PNGs into a PNG-in-ICO container
// (supported by all modern browsers + Google's favicon picker). Regenerated from
// icon.svg so it can never drift from the rest of the icon set again.
{
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((s) => sharp(icon, { density: 384 }).resize(s, s).png().toBuffer())
  );
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  const dir = pngs.map((png, i) => {
    const e = Buffer.alloc(16);
    const s = sizes[i];
    e.writeUInt8(s >= 256 ? 0 : s, 0); // width  (0 == 256)
    e.writeUInt8(s >= 256 ? 0 : s, 1); // height
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8); // size of PNG data
    e.writeUInt32LE(offset, 12); // offset of PNG data
    offset += png.length;
    return e;
  });
  writeFileSync(out("favicon.ico"), Buffer.concat([header, ...dir, ...pngs]));
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
