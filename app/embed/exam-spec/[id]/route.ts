/**
 * Embeddable exam spec widget — referral and brand exposure.
 * ----------------------------------------------------------
 * A self-contained, chrome-free HTML card per exam portal that coaching blogs
 * and exam sites can <iframe> into their pages. The framed card links users back
 * to easyPhoto; the separate parent-document anchor in the copied snippet is the
 * conventional backlink to the canonical exam-requirements page.
 *
 * Why a Route Handler (not a page): it renders raw HTML with ZERO site layout
 * (no header/footer/CSS bundle), inline styles only, ~3 KB. Statically exported
 * (force-static + generateStaticParams) so it ships as a plain file on the CDN.
 * Framing is allowed for /embed/* via a public/_headers override (the site-wide
 * CSP is frame-ancestors 'none').
 */
import { getPortalSpec, specProvenance } from "@/lib/specRegistry";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import type { PortalSpec } from "@/lib/portalPresets";

export const dynamic = "force-static";

export function generateStaticParams() {
  return PORTAL_KEYS.map((id) => ({ id: String(id) }));
}

const SITE = "https://easyphoto.in";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const kb = (min: number | undefined, max: number) =>
  typeof min === "number" ? `${min}–${max} KB` : `≤ ${max} KB`;

function renderEmbed(spec: PortalSpec): string {
  const short = spec.name.split(" (")[0];
  const prov = specProvenance(spec);
  const photoDim =
    spec.photoWidthPx && spec.photoHeightPx ? `${spec.photoWidthPx}×${spec.photoHeightPx} px` : null;
  const sigDim =
    spec.sigWidthPx && spec.sigHeightPx ? `${spec.sigWidthPx}×${spec.sigHeightPx} px` : null;
  const hasSig = spec.sigLimitKb !== undefined;
  const resizer = `${SITE}/exam-requirements/${spec.id}/`;

  const row = (label: string, value: string) =>
    `<div class="r"><span class="l">${esc(label)}</span><span class="v">${esc(value)}</span></div>`;

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,follow">
<title>${esc(short)} photo & signature size — easyPhoto</title>
<style>
  :root{color-scheme:light}
  *{box-sizing:border-box}
  body{margin:0;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;background:transparent}
  .card{max-width:360px;margin:0 auto;border:1px solid #e6e3dd;border-radius:14px;background:#fff;overflow:hidden}
  .hd{padding:14px 16px 10px;border-bottom:1px solid #f0eee9}
  .ey{font:600 11px/1 system-ui;letter-spacing:.08em;text-transform:uppercase;color:#c2410c;margin:0 0 6px}
  h1{font-size:16px;font-weight:700;margin:0;letter-spacing:-.01em}
  .bd{padding:8px 16px 14px}
  .grp{margin-top:8px}
  .grp .t{font:600 11px/1 system-ui;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;margin:8px 0 4px}
  .r{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid #f4f2ee}
  .r:last-child{border-bottom:0}
  .l{color:#6b7280}
  .v{font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums;text-align:right}
  .ft{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 16px;background:#fbfaf8;border-top:1px solid #f0eee9}
  .src{font-size:11px;color:#9ca3af;text-decoration:none}
  .cta{font:600 12px/1 system-ui;color:#fff;background:#c2410c;padding:8px 12px;border-radius:8px;text-decoration:none;white-space:nowrap}
  .brand{color:#c2410c;font-weight:700}
</style></head>
<body>
<div class="card">
  <div class="hd">
    <p class="ey">Official requirement</p>
    <h1>${esc(short)} photo${hasSig ? " &amp; signature" : ""} size</h1>
  </div>
  <div class="bd">
    <div class="grp">
      <div class="t">Photograph</div>
      ${row("File size", kb(spec.photoMinKb, spec.photoLimitKb))}
      ${photoDim ? row("Dimensions", photoDim) : ""}
      ${spec.dpi ? row("Scan DPI", String(spec.dpi)) : ""}
      ${row("Format", "JPG / JPEG")}
    </div>
    ${
      hasSig
        ? `<div class="grp">
      <div class="t">Signature</div>
      ${row("File size", kb(spec.sigMinKb, spec.sigLimitKb!))}
      ${sigDim ? row("Dimensions", sigDim) : ""}
      ${row("Format", "JPG / JPEG")}
    </div>`
        : ""
    }
  </div>
  <div class="ft">
    ${
      prov.url
        ? `<a class="src" href="${esc(prov.url)}" target="_blank" rel="noopener nofollow">${esc(prov.label)}</a>`
        : `<span class="src">${esc(prov.label)}</span>`
    }
    <a class="cta" href="${resizer}?utm_source=embed&utm_medium=widget&utm_campaign=exam-spec" target="_blank" rel="noopener">Resize free · <span class="brand" style="color:#fff">easyPhoto</span></a>
  </div>
</div>
</body></html>`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spec = getPortalSpec(id);
  if (!spec) {
    return new Response("Spec not found", { status: 404 });
  }
  // NOTE: this is a static export — real HTTP headers (content-type, the
  // X-Robots-Tag noindex, CSP override for embedding) are applied at the CDN via
  // public/_headers, not from here. This content-type is for the dev server only.
  return new Response(renderEmbed(spec), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
