import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { HINGLISH_PAGES } from "@/lib/hinglishPages";
import { PHOTO_KB_USECASES } from "@/lib/kbTargets";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { SUB_EXAM_RESIZERS } from "@/lib/subExamResizers";

function normalise(text: string): string {
  const named: Record<string, string> = {
    amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", ndash: "–",
    quot: '"', times: "×",
  };
  return text
    .replace(/&([a-z]+);/gi, (entity, name: string) => named[name.toLowerCase()] ?? entity)
    .replace(/&#x([0-9a-f]+);/gi, (_entity, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_entity, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/\s+/g, " ")
    .toLowerCase();
}

const LIVE_CAPTURE_ALIASES = Object.values(PORTAL_PRESETS)
  .filter((spec) => spec.isLiveCapture)
  .map((spec) => ({
    id: spec.id,
    aliases: [spec.id, spec.name.split(/[ (]/)[0]].map((value) => value.toLowerCase()),
  }));

const CORRECTIVE_CONTEXT =
  /\b(?:live[- ]?(?:photo|photograph)(?:\s+(?:capture|step|workflow))?|(?:photo|photograph)\s+live\s+capture|use\s+live\s+capture|live\s+webcam\s+capture|capture(?:s|d)?[^.]{0,60}(?:photo|photograph)[^.]{0,20}live|captured\s+live|compatibility|not\s+(?:a\s+)?current|no\s+prepared[- ]photo|not\s+uploaded|no\s+server\s+uploads?|do(?:es)?\s+not\s+(?:use|accept|list)|rather\s+than)\b/i;
const PREPARED_PHOTO_IMPLICATION =
  /\bphoto\b.{0,90}\bupload|\bupload\b.{0,90}\bphoto\b|\bprepared[- ]photo(?:graph)?\b.{0,90}\b(?:file|kb|compress|resiz|prepare|band|limit|dimension)|\b(?:file|kb|compress|resiz|prepare|band|limit|dimension)\b.{0,90}\bprepared[- ]photo(?:graph)?\b/i;

const COPY_ROOTS = ["app", "components", "lib", "public"];
const COPY_EXTENSIONS = /\.(?:ts|tsx|txt)$/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return COPY_EXTENSIONS.test(entry.name) ? [path] : [];
  });
}

function copyLiterals(file: string): string[] {
  const source = readFileSync(file, "utf8");
  if (file.endsWith(".txt")) return source.split("\n");

  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX);
  const literals: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node) || ts.isJsxText(node)) literals.push(node.text);
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return literals;
}

export function liveCaptureCopyOffenders(copy: string): string[] {
  const value = normalise(copy).replace(/\bibps rrb\b/g, "ibps regional bank");
  return LIVE_CAPTURE_ALIASES.flatMap(({ id, aliases }) => {
    if (!aliases.some((alias) => new RegExp(`\\b${alias}\\b`, "i").test(value))) return [];
    if (!PREPARED_PHOTO_IMPLICATION.test(value)) return [];
    return CORRECTIVE_CONTEXT.test(value) ? [] : [id];
  });
}

const HINGLISH_COPY = HINGLISH_PAGES.flatMap((page) => [
  page.title,
  page.description,
  page.h1,
  page.blurb,
  ...page.faqs.flatMap((faq) => [faq.q, faq.a]),
]);

const KB_COPY = Object.values(PHOTO_KB_USECASES).flatMap((entry) => [
  entry.heading,
  entry.intro,
  entry.tip,
  entry.faq.q,
  entry.faq.a,
  entry.qualityFaq.q,
  entry.qualityFaq.a,
  ...entry.useCases.flatMap((useCase) => [useCase.label, useCase.detail]),
]);

describe("live-capture copy follows the registry", () => {
  it("rejects a prepared-photo upload claim for a registry live-capture portal", () => {
    expect(liveCaptureCopyOffenders("SSC photo upload must be compressed to 20 KB")).toEqual(["ssc"]);
    expect(liveCaptureCopyOffenders("RRB prepared photo file must be uploaded")).toEqual(["rrb"]);
  });

  it("allows explicit live-capture correction context", () => {
    expect(liveCaptureCopyOffenders("SSC uses live photo capture, not a prepared photo upload.")).toEqual([]);
  });

  it("keeps the Hinglish and shared KB registries free of live-capture upload claims", () => {
    const offenders = [...HINGLISH_COPY, ...KB_COPY]
      .flatMap((copy) => liveCaptureCopyOffenders(copy).map((id) => `${id}: ${copy}`));
    expect(offenders).toEqual([]);
  });

  it("keeps live-capture sub-exam notes explicit about the workflow", () => {
    const offenders = SUB_EXAM_RESIZERS
      .filter((entry) => PORTAL_PRESETS[entry.parentId]?.isLiveCapture)
      .filter((entry) => liveCaptureCopyOffenders(entry.note).length > 0)
      .map((entry) => entry.slug);
    expect(offenders).toEqual([]);
  });

  it("keeps every public-copy literal free of unbounded live-capture upload claims", () => {
    const offenders = COPY_ROOTS.flatMap(sourceFiles).flatMap((file) =>
      copyLiterals(file).flatMap((copy) => {
        if (copy.trim().endsWith("?")) return [];
        return liveCaptureCopyOffenders(copy).map((id) => `${file} (${id}) ${copy.trim()}`);
      })
    );

    expect(offenders).toEqual([]);
  });
});
