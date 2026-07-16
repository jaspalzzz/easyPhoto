"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck, PenLine, Minimize2, Maximize2 } from "lucide-react";
import { ProcessingState } from "@/components/site/ProcessingState";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { canvasToBlob } from "@/lib/imaging";
import { ensureDecodable } from "@/lib/heic";
import { downloadBlob } from "@/lib/download";
import { SignaturePad } from "./SignaturePad";
import { SignatureOverlay, type Placement } from "./SignatureOverlay";
import { track, deviceClass } from "@/lib/analytics";

const TOOL = "sign-image";

interface PlacedSignature {
  id: string;
  signatureUrl: string;
  placement: Placement;
}

export function SignImageTool() {
  const [baseFile, setBaseFile] = React.useState<File | null>(null);
  const [baseImage, setBaseImage] = React.useState<HTMLImageElement | null>(null);
  const [placements, setPlacements] = React.useState<PlacedSignature[]>([]);

  // Active signature configuration (drawn or uploaded)
  const [activeSignature, setActiveSignature] = React.useState<string | null>(null);
  const [showPad, setShowPad] = React.useState(false);

  // App UI states
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [exportedBlob, setExportedBlob] = React.useState<Blob | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // Tracks the current base-image object URL so it can be revoked at the right time
  const baseObjectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: TOOL });
  }, []);

  // Clean up object URL on unmount
  React.useEffect(() => {
    return () => {
      if (baseObjectUrlRef.current) {
        URL.revokeObjectURL(baseObjectUrlRef.current);
        baseObjectUrlRef.current = null;
      }
    };
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadFile(e.target.files[0]);
    }
  };

  const loadFile = async (file: File) => {
    const isImg = file.type.startsWith("image/") || /\.(heic|heif|jpg|jpeg|png|webp)$/i.test(file.name);
    if (!isImg) {
      setError("Please select a valid image file (JPG, PNG, WebP, HEIC).");
      return;
    }
    setError(null);
    setBusy(true);
    setPlacements([]);
    setBaseFile(file);
    track({ name: "tool_start", tool: TOOL, device: deviceClass() });
    try {
      const decodable = await ensureDecodable(file);
      
      // Revoke any previous base image object URL before creating a new one
      if (baseObjectUrlRef.current) {
        URL.revokeObjectURL(baseObjectUrlRef.current);
        baseObjectUrlRef.current = null;
      }
      const objectUrl = URL.createObjectURL(decodable);
      baseObjectUrlRef.current = objectUrl;

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.src = objectUrl;
        image.onload = () => {
          resolve(image);
        };
        image.onerror = (err) => {
          URL.revokeObjectURL(objectUrl);
          baseObjectUrlRef.current = null;
          reject(err);
        };
      });
      
      setBaseImage(img);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not read that image. Ensure it is not corrupted.");
      setBaseFile(null);
      track({ name: "tool_failure", tool: TOOL, device: deviceClass(), reason: "decode" });
    } finally {
      setBusy(false);
    }
  };

  const addSignatureToImage = () => {
    if (!activeSignature) return;
    const newSig: PlacedSignature = {
      id: Math.random().toString(36).substring(2, 9),
      signatureUrl: activeSignature,
      placement: {
        x: 35, // centered placement
        y: 40,
        width: 30, // 30% width
        height: 12, // automatically matches aspect on mount
        rotation: 0, // upright; user can rotate via the handle
      },
    };
    setPlacements((prev) => [...prev, newSig]);
  };

  const updatePlacement = (sigId: string, newPlacement: Placement) => {
    setPlacements((prev) =>
      prev.map((sig) => (sig.id === sigId ? { ...sig, placement: newPlacement } : sig))
    );
  };

  const deleteSignature = (sigId: string) => {
    setPlacements((prev) => prev.filter((sig) => sig.id !== sigId));
  };

  const runExport = async () => {
    if (!baseImage) return;
    setBusy(true);
    setError(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire 2D canvas context.");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw base image at full scale
      ctx.drawImage(baseImage, 0, 0);

      // Superimpose all placed signatures
      for (const sig of placements) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.src = sig.signatureUrl;
          image.onload = () => resolve(image);
          image.onerror = (err) => reject(err);
        });

        // Convert percentage bounds to original high-res pixel bounds
        const x = (sig.placement.x / 100) * canvas.width;
        const y = (sig.placement.y / 100) * canvas.height;
        const w = (sig.placement.width / 100) * canvas.width;
        const h = (sig.placement.height / 100) * canvas.height;
        const rotation = sig.placement.rotation ?? 0;

        if (rotation) {
          // Rotate around the placement's centre, matching the on-screen
          // CSS `transform: rotate()` (which spins about the box centre).
          const cx = x + w / 2;
          const cy = y + h / 2;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
          ctx.restore();
        } else {
          ctx.drawImage(img, x, y, w, h);
        }
      }

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);
      const baseName = baseFile?.name.replace(/\.[^/.]+$/, "") || "signed-image";
      setExportedBlob(blob);
      track({ name: "tool_success", tool: TOOL, device: deviceClass() });
      downloadBlob(blob, `${baseName}-signed.jpg`, TOOL);
    } catch (err) {
      console.error(err);
      setError("Failed to compile signed image. Please try again.");
      track({ name: "tool_failure", tool: TOOL, device: deviceClass(), reason: "render" });
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (baseObjectUrlRef.current) {
      URL.revokeObjectURL(baseObjectUrlRef.current);
      baseObjectUrlRef.current = null;
    }
    setBaseFile(null);
    setBaseImage(null);
    setPlacements([]);
    setError(null);
    setExportedBlob(null);
  };

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {/* Upload Zone */}
        {!baseFile && !busy && (
          <div
            id="image-signer-dropzone"
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.dataset.dragging = "1";
            }}
            onDragLeave={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
            onDropCapture={(e) => {
              delete e.currentTarget.dataset.dragging;
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                loadFile(e.dataTransfer.files[0]);
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="font-semibold tracking-tight text-sm">Select photo or document image, or drop it here</p>
            <p className="text-xs text-muted-foreground">Modify JPG, PNG, WebP, or HEIC images offline privately.</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed 100% locally
            </p>
            <input
              id="image-signer-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              className="hidden"
              onChange={onFileSelect}
            />
          </div>
        )}

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {baseFile && baseImage && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
            {/* Left Column: Interactive Image Frame */}
            <div className="space-y-4">
              <div className="border-b border-hairline pb-2.5">
                <h4 className="font-semibold text-sm truncate max-w-sm" title={baseFile.name}>
                  {baseFile.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dimensions: {baseImage.width}×{baseImage.height}px · {placements.length} signatures placed
                </p>
              </div>

              {/* Viewport Frame */}
              <div className="flex justify-center bg-accent/5 p-4 border border-hairline rounded-md">
                <div
                  ref={containerRef}
                  className="relative inline-block border border-hairline shadow bg-white select-none"
                  style={{ touchAction: "none" }}
                >
                  <img
                    src={baseImage.src}
                    alt="Document Base"
                    className="block max-h-[400px] w-auto object-contain pointer-events-none"
                    draggable={false}
                  />

                  {/* Render Placed Signature Overlays */}
                  {placements.map((sig) => (
                    <SignatureOverlay
                      key={sig.id}
                      signatureUrl={sig.signatureUrl}
                      placement={sig.placement}
                      parentRef={containerRef}
                      allowRotation
                      onPlacementChange={(p) => updatePlacement(sig.id, p)}
                      onDelete={() => deleteSignature(sig.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Signature Controls */}
            <div className="space-y-4">
              {/* Reset or Save Actions */}
              <div className="flex gap-2">
                <Button id="image-signer-reset-btn" variant="outline" size="sm" className="flex-1" onClick={reset} disabled={busy}>
                  Reset
                </Button>
                <Button id="image-signer-save-btn" variant="cta" size="sm" className="flex-1" onClick={runExport} disabled={busy || placements.length === 0}>
                  <Download className="h-4 w-4" /> Save Image
                </Button>
              </div>
              {placements.length === 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Place at least one signature before saving.
                </p>
              )}

              {exportedBlob && (
                <WorkflowNextSteps
                  getBlob={async () => {
                    if (!exportedBlob) throw new Error("No output");
                    return exportedBlob;
                  }}
                  filename={`${baseFile?.name.replace(/\.[^/.]+$/, "") || "signed-image"}-signed.jpg`}
                  steps={[
                    {
                      slug: "resize-kb",
                      label: "Compress to KB",
                      hint: "Hit exact file size limits for exam and visa portals",
                      icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
                    },
                    {
                      slug: "resize-dimensions",
                      label: "Resize Dimensions",
                      hint: "Scale the signed photo to exact pixel dimensions",
                      icon: <Maximize2 className="h-4 w-4" strokeWidth={1.75} />,
                    },
                  ]}
                />
              )}

              {/* Signature Creator Panel */}
              <div className="bg-paper border border-hairline rounded-md p-4 space-y-4">
                <span className="text-xs font-semibold eyebrow uppercase tracking-wider text-brand block">
                  Signature Options
                </span>

                {showPad ? (
                  <SignaturePad
                    onSignatureReady={(dataUrl) => {
                      setActiveSignature(dataUrl);
                      setShowPad(false);
                    }}
                    onCancel={() => setShowPad(false)}
                  />
                ) : activeSignature ? (
                  <div className="space-y-3 animate-fadeIn">
                    <span className="text-xs font-semibold text-muted-foreground block">Current Signature</span>
                    <div className="border border-hairline rounded p-2 bg-accent/5 flex items-center justify-center h-20 overflow-hidden">
                      <img src={activeSignature} alt="Ready Signature" className="max-h-full max-w-full object-contain" />
                    </div>
                    
                    <Button
                      id="image-signer-add-sig-btn"
                      variant="cta"
                      size="sm"
                      className="w-full text-xs font-bold"
                      onClick={addSignatureToImage}
                    >
                      Place on Document
                    </Button>

                    <Button
                      id="image-signer-new-sig-btn"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowPad(true)}
                    >
                      Create Different Signature
                    </Button>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-3">
                    <PenLine className="h-8 w-8 text-brand mx-auto opacity-70" />
                    <div>
                      <p className="text-xs font-semibold">No signature created yet</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Draw or upload your signature to place on the image.</p>
                    </div>
                    <Button
                      id="image-signer-create-sig-btn"
                      variant="cta"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowPad(true)}
                    >
                      Create Signature
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {busy && <ProcessingState label="Loading…" />}
      </CardContent>
    </Card>
  );
}
