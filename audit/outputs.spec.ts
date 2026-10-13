/**
 * Exam output audit (docs/output-audit-plan-2026-10.md): for every exam
 * preset, upload a standard set of photos and signatures to the exam's real
 * tools, download the result, and check the file against the exam's rules
 * (audit/checks.ts). Each run writes a JSON result to audit-report/results/;
 * scripts/audit/report.mjs turns them into audit-report/REPORT.md.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { PORTAL_PRESETS, type PortalSpec } from "../lib/portalPresets";
import { checkFile, readFileFacts, rulesFor, type FileKind } from "./checks";

const ROOT = path.join(__dirname, "..");
const RESULTS = path.join(ROOT, "audit-report", "results");
const FACE_PHOTO = fs.readFileSync(path.join(ROOT, "e2e", "fixtures", "face-photo.jpg")).toString("base64");
const INDEXED = new Set(
  fs
    .readFileSync(path.join(ROOT, "test", "fixtures", "sitemap-baseline.txt"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^\/exam-requirements\/[^/]+\/$/.test(l))
);

/** The exam's own page when Google indexes one; otherwise its tool page. */
function pageFor(id: string): string {
  const exam = `/exam-requirements/${id}/`;
  return INDEXED.has(exam) ? exam : `/tools/form-resizer/${id}/`;
}

type InputName = string;
const PHOTO_INPUTS: InputName[] = ["phone portrait 3000×4000", "small 300×400", "landscape 4000×3000"];
const SIGNATURE_INPUTS: InputName[] = ["phone photo of paper", "tight scan", "very wide"];

/** Builds one input file in the page (canvas), so every run is identical. */
async function makeInput(page: Page, kind: FileKind, name: InputName, copies: number): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    async ({ kind, name, copies, face }) => {
      // Seeded PRNG: the same pixels every run.
      let seed = 20261010;
      const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const noise = (amount: number) => {
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < img.data.length; i += 4) {
          const n = (rnd() - 0.5) * amount;
          img.data[i] += n;
          img.data[i + 1] += n;
          img.data[i + 2] += n;
        }
        ctx.putImageData(img, 0, 0);
      };

      if (kind === "photo") {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${face}`;
        await img.decode();
        const [w, h] = name.startsWith("phone") ? [3000, 4000] : name.startsWith("small") ? [300, 400] : [4000, 3000];
        canvas.width = w;
        canvas.height = h;
        ctx.fillStyle = "#e8e6e1";
        ctx.fillRect(0, 0, w, h);
        // Head-and-shoulders portrait, centred, as a phone camera would frame it.
        const side = Math.min(w, h);
        ctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side);
        if (w > 1000) noise(6);
        return canvas.toDataURL("image/jpeg", 0.92);
      }

      // Signature: ink scribbles on paper, `copies` stacked one below another.
      const sizes: Record<string, [number, number]> =
        copies > 1
          ? { "phone photo of paper": [1600, 2400], "tight scan": [600, 700], "very wide": [1200, 500] }
          : { "phone photo of paper": [2400, 1600], "tight scan": [600, 200], "very wide": [1800, 150] };
      const [w, h] = sizes[name];
      canvas.width = w;
      canvas.height = h;
      const phone = name.startsWith("phone");
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, phone ? "#eeeae2" : "#ffffff");
      grad.addColorStop(1, phone ? "#d9d3c7" : "#ffffff");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = phone ? "#1b2340" : "#111111";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const band = h / copies;
      for (let c = 0; c < copies; c++) {
        const cy = band * c + band / 2;
        const span = w * (phone ? 0.55 : 0.8);
        const amp = Math.min(band * 0.3, span * 0.12);
        ctx.lineWidth = Math.max(2, Math.round(Math.min(w, band) / 60));
        ctx.beginPath();
        let x = (w - span) / 2;
        ctx.moveTo(x, cy);
        while (x < (w + span) / 2) {
          const step = span / 9;
          ctx.bezierCurveTo(x + step * 0.3, cy - amp * (0.5 + rnd()), x + step * 0.7, cy + amp * (0.5 + rnd()), x + step, cy + amp * (rnd() - 0.5) * 0.6);
          x += step;
        }
        ctx.stroke();
      }
      if (phone) noise(10);
      return canvas.toDataURL(phone ? "image/jpeg" : "image/png", 0.9);
    },
    { kind, name, copies, face: FACE_PHOTO }
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

/** Uploads, runs the tool the way a person would, and returns the download. */
async function produce(page: Page, kind: FileKind, input: Buffer, mime: string): Promise<Buffer> {
  // Live-photo exams open on the signature tab; others on the photo tab.
  const tab =
    kind === "signature"
      ? page.getByRole("button", { name: /clean & compress signature|prepare signature file/i })
      : page.getByRole("button", { name: /compress portal photo|optional photo tool/i });
  if (await tab.count()) await tab.first().click();
  await page.locator('input[type="file"]').first().setInputFiles({ name: `input.${mime.split("/")[1]}`, mimeType: mime, buffer: input });
  let download: Promise<import("@playwright/test").Download>;
  if (kind === "photo") {
    await page.getByRole("button", { name: /compress to size/i }).click();
    const button = page.getByRole("button", { name: /download jpg/i });
    await expect(button).toBeVisible({ timeout: 60_000 });
    download = page.waitForEvent("download");
    await button.click();
  } else {
    const button = page.locator("#sig-download");
    await expect(button).toBeVisible({ timeout: 60_000 });
    download = page.waitForEvent("download");
    await button.click();
  }
  const file = await (await download).path();
  return fs.readFileSync(file!);
}

function record(result: object, file: string) {
  fs.mkdirSync(RESULTS, { recursive: true });
  fs.writeFileSync(path.join(RESULTS, file), JSON.stringify(result, null, 2));
}

for (const spec of Object.values(PORTAL_PRESETS) as PortalSpec[]) {
  for (const kind of ["photo", "signature"] as FileKind[]) {
    const rules = rulesFor(spec, kind);
    if (!rules) continue;
    const inputs = kind === "photo" ? PHOTO_INPUTS : SIGNATURE_INPUTS;
    for (const input of inputs) {
      test(`${spec.id} · ${kind} · ${input}`, async ({ page }) => {
        const url = pageFor(spec.id);
        const pageErrors: string[] = [];
        page.on("pageerror", (e) => pageErrors.push(e.message));
        const slug = `${spec.id}__${kind}__${input.replace(/[^a-z0-9]+/gi, "-")}.json`;
        const base = { exam: spec.id, page: url, kind, input, verification: spec.verification, rules };

        await page.goto(url);
        // Let the page finish loading and hydrating before we work in it; the
        // harness's own canvas work during hydration caused stray React #418s.
        await page.waitForLoadState("networkidle");
        const buffer = await makeInput(page, kind, input, kind === "signature" ? spec.sigCopies ?? 1 : 1);
        const mime = kind === "signature" && !input.startsWith("phone") ? "image/png" : "image/jpeg";
        let bytes: Buffer;
        try {
          bytes = await produce(page, kind, buffer, mime);
        } catch (err) {
          record({ ...base, error: `no file produced: ${(err as Error).message.split("\n")[0]}`, pageErrors }, slug);
          throw err;
        }
        const facts = readFileFacts(new Uint8Array(bytes));
        const checks = checkFile(rules, facts);
        record({ ...base, facts, checks, pageErrors }, slug);
        expect(pageErrors, "page errors").toEqual([]);
        expect(
          checks.filter((c) => !c.pass).map((c) => `${c.check}: expected ${c.expected}, got ${c.actual}`)
        ).toEqual([]);
      });
    }
  }
}
