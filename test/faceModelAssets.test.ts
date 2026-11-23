import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { faceEngineFiles, FACE_MODEL_URL } from "@/lib/faceModelAssets";

/**
 * The face engine and its model are files of this site, not downloads from
 * jsDelivr and Google Cloud Storage (lib/faceModelAssets.ts). These guard the
 * parts a build cannot: that the committed model is the documented file, and
 * that the engine files named in the code exist in the installed package.
 * e2e/face-check-self-hosted.spec.ts proves the face check runs with both
 * outside hosts blocked.
 */
const root = process.cwd();
const MODEL = path.join(root, "lib", "models", "face_landmarker.task");
const README = fs.readFileSync(path.join(root, "lib", "models", "README.md"), "utf8");
const ASSETS_SOURCE = fs.readFileSync(path.join(root, "lib", "faceModelAssets.ts"), "utf8");

describe("face model assets", () => {
  it("the committed model is the file the README documents", () => {
    const bytes = fs.readFileSync(MODEL);
    const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
    expect(README).toContain(`\`${sha256}\``);
    expect(README).toContain(`${bytes.length.toLocaleString("en-US")} bytes`);
  });

  it("every engine file the code names is exported by the installed package", () => {
    const named = [...ASSETS_SOURCE.matchAll(/new URL\("@mediapipe\/tasks-vision\/([^"]+)"/g)].map((m) => m[1]);
    expect(named).toHaveLength(4);
    const pkgDir = path.join(root, "node_modules", "@mediapipe", "tasks-vision");
    const exportsMap = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8")).exports;
    for (const file of named) {
      const target = exportsMap[`./${file}`];
      expect(target, `${file} is not exported by @mediapipe/tasks-vision`).toBeTruthy();
      expect(fs.existsSync(path.join(pkgDir, target)), `${target} is missing`).toBe(true);
    }
  });

  it("picks the SIMD engine when the device supports it and the plain one when it does not", () => {
    const simd = faceEngineFiles(true);
    const plain = faceEngineFiles(false);
    expect(simd.wasmBinaryPath).toMatch(/vision_wasm_internal\.wasm$/);
    expect(simd.wasmLoaderPath).toMatch(/vision_wasm_internal\.js$/);
    expect(plain.wasmBinaryPath).toMatch(/vision_wasm_nosimd_internal\.wasm$/);
    expect(plain.wasmLoaderPath).toMatch(/vision_wasm_nosimd_internal\.js$/);
  });

  it("the model address points at the committed file", () => {
    expect(FACE_MODEL_URL).toMatch(/models\/face_landmarker\.task$/);
  });
});
