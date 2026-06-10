import type { ComplianceReport, CheckStatus } from "@/lib/compliance";

/**
 * Renders a shareable "compliance check" result card to a PNG blob.
 *
 * Privacy first: the card NEVER contains the user's photo or signature — only
 * the verdict, the per-rule checks, and the easyphoto.in mark. It's the artifact
 * an applicant screenshots into an exam Telegram group or forum ("is my photo
 * the right size? — here's what easyphoto.in says"), so it doubles as a brand /
 * backlink surface while leaking nothing.
 *
 * 1080×1080 — the square format WhatsApp/Telegram status and most forums prefer.
 */

const C = {
  paper: "hsl(40, 33%, 97%)",
  surface: "#ffffff",
  ink: "hsl(30, 12%, 12%)",
  inkSoft: "hsl(32, 7%, 40%)",
  inkFaint: "hsl(33, 8%, 56%)",
  hairline: "hsl(36, 18%, 85%)",
  hairlineStrong: "hsl(33, 14%, 74%)",
  brand: "hsl(174, 72%, 29%)",
  pass: "hsl(151, 42%, 33%)",
  warn: "hsl(38, 88%, 42%)",
  fail: "hsl(4, 62%, 47%)",
} as const;

const STATUS_COLOR: Record<CheckStatus, string> = {
  pass: C.pass,
  warn: C.warn,
  fail: C.fail,
};

const VERDICT_HEADLINE: Record<CheckStatus, string> = {
  pass: "Looks good",
  warn: "Worth a check",
  fail: "Likely to be rejected",
};

const SANS =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO =
  "ui-monospace, SFMono-Regular, Menlo, 'DejaVu Sans Mono', monospace";

/** Draw the status glyph (check / bang / cross) centred at (cx, cy) in a circle of radius r. */
function drawStatusGlyph(
  ctx: CanvasRenderingContext2D,
  status: CheckStatus,
  cx: number,
  cy: number,
  r: number
) {
  const color = STATUS_COLOR[status];
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = C.surface;
  ctx.lineWidth = Math.max(3, r * 0.18);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (status === "pass") {
    ctx.moveTo(cx - r * 0.42, cy + r * 0.02);
    ctx.lineTo(cx - r * 0.1, cy + r * 0.36);
    ctx.lineTo(cx + r * 0.46, cy - r * 0.34);
  } else if (status === "fail") {
    ctx.moveTo(cx - r * 0.34, cy - r * 0.34);
    ctx.lineTo(cx + r * 0.34, cy + r * 0.34);
    ctx.moveTo(cx + r * 0.34, cy - r * 0.34);
    ctx.lineTo(cx - r * 0.34, cy + r * 0.34);
  } else {
    // exclamation
    ctx.moveTo(cx, cy - r * 0.42);
    ctx.lineTo(cx, cy + r * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.4, ctx.lineWidth * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = C.surface;
    ctx.fill();
    ctx.restore();
    return;
  }
  ctx.stroke();
  ctx.restore();
}

/** Word-wrap `text` to `maxWidth`, returning the lines. */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildComplianceCard(opts: {
  examName: string;
  kind: "photo" | "signature";
  report: ComplianceReport;
}): Promise<Blob> {
  const { examName, kind, report } = opts;
  const W = 1080;
  const H = 1080;
  const PAD = 88;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");

  // Background
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);

  // Header: wordmark + domain
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.brand;
  ctx.font = `700 40px ${SANS}`;
  ctx.fillText("easyPhoto", PAD, PAD + 34);
  ctx.fillStyle = C.inkFaint;
  ctx.font = `500 26px ${MONO}`;
  ctx.textAlign = "right";
  ctx.fillText("easyphoto.in", W - PAD, PAD + 32);
  ctx.textAlign = "left";

  // Header rule
  ctx.strokeStyle = C.hairline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, PAD + 70);
  ctx.lineTo(W - PAD, PAD + 70);
  ctx.stroke();

  // Eyebrow
  let y = PAD + 144;
  ctx.fillStyle = C.inkSoft;
  ctx.font = `600 24px ${MONO}`;
  ctx.fillText("COMPLIANCE CHECK", PAD, y);

  // Title
  y += 64;
  ctx.fillStyle = C.ink;
  ctx.font = `700 56px ${SANS}`;
  const title = `${examName}`;
  ctx.fillText(title, PAD, y);
  y += 48;
  ctx.fillStyle = C.inkSoft;
  ctx.font = `500 32px ${SANS}`;
  ctx.fillText(kind === "photo" ? "Photograph" : "Signature", PAD, y);

  // Verdict banner
  y += 44;
  const bannerH = 116;
  const vColor = STATUS_COLOR[report.verdict];
  ctx.fillStyle = vColor;
  // tinted rounded rect
  const r = 18;
  const bx = PAD;
  const bw = W - PAD * 2;
  ctx.globalAlpha = 0.1;
  roundRect(ctx, bx, y, bw, bannerH, r);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = vColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.35;
  roundRect(ctx, bx, y, bw, bannerH, r);
  ctx.stroke();
  ctx.globalAlpha = 1;
  drawStatusGlyph(ctx, report.verdict, bx + 58, y + bannerH / 2, 34);
  ctx.fillStyle = vColor;
  ctx.font = `700 44px ${SANS}`;
  ctx.fillText(VERDICT_HEADLINE[report.verdict], bx + 116, y + bannerH / 2 + 16);

  // Checks
  y += bannerH + 64;
  const glyphR = 22;
  for (const check of report.checks) {
    drawStatusGlyph(ctx, check.status, PAD + glyphR, y, glyphR);
    ctx.fillStyle = C.ink;
    ctx.font = `700 32px ${SANS}`;
    ctx.fillText(check.label, PAD + glyphR * 2 + 24, y - 6);
    ctx.fillStyle = C.inkSoft;
    ctx.font = `400 27px ${SANS}`;
    const lines = wrapLines(ctx, check.detail, bw - (glyphR * 2 + 24));
    let ly = y + 30;
    for (const line of lines.slice(0, 2)) {
      ctx.fillText(line, PAD + glyphR * 2 + 24, ly);
      ly += 34;
    }
    y = ly + 26;
  }

  // Footer
  const footY = H - PAD - 36;
  ctx.strokeStyle = C.hairline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, footY - 34);
  ctx.lineTo(W - PAD, footY - 34);
  ctx.stroke();
  ctx.fillStyle = C.inkSoft;
  ctx.font = `500 25px ${SANS}`;
  ctx.fillText("100% private — your file never left your device.", PAD, footY);
  ctx.fillStyle = C.brand;
  ctx.font = `600 25px ${SANS}`;
  ctx.textAlign = "right";
  ctx.fillText("Check yours free · easyphoto.in", W - PAD, footY);
  ctx.textAlign = "left";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
