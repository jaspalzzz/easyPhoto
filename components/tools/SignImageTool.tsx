"use client";

import * as React from "react";
import { Loader2, Download, FileUp, ShieldCheck, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { canvasToBlob } from "@/lib/imaging";
import { ensureDecodable } from "@/lib/heic";
import { downloadBlob } from "@/lib/download";
import { SignaturePad } from "./SignaturePad";
import { SignatureOverlay, type Placement } from "./SignatureOverlay";

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

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Clean up ObjectURLs on unmount
  React.useEffect(() => {
    return () => {
      if (baseImage?.src) {
        URL.revokeObjectURL(baseImage.src);
      }
    };
  }, [baseImage]);

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
    try {
      const decodable = await ensureDecodable(file);
      
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(decodable);
        image.onload = () => resolve(image);
        image.onerror = (err) => reject(err);
      });
      
      setBaseImage(img);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Could not read that image. Ensure it is not corrupted.");
      setBaseFile(null);
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

        ctx.drawImage(img, x, y, w, h);
      }

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);
      const baseName = baseFile?.name.replace(/\.[^/.]+$/, "") || "signed-image";
      downloadBlob(blob, `${baseName}-signed.jpg`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to compile signed image. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (baseImage?.src) {
      URL.revokeObjectURL(baseImage.src);
    }
    setBaseFile(null);
    setBaseImage(null);
    setPlacements([]);
    setError(null);
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
            onDragOver={(e) => e.preventDefault()}
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
          <div className="grid gap-6 md:grid-cols-[1fr_280px]">
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
                <Button id="image-signer-save-btn" variant="cta" size="sm" className="flex-1" onClick={runExport} disabled={busy}>
                  <Download className="h-4 w-4" /> Save Image
                </Button>
              </div>

              {/* Signature Creator Panel */}
              <div className="bg-paper border border-hairline rounded-md p-4 space-y-4">
                <span className="text-[11px] font-semibold eyebrow uppercase tracking-wider text-brand block">
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
                      <p className="text-[11px] text-muted-foreground mt-0.5">Draw or upload your signature to place on the image.</p>
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

        {busy && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-ink-soft border border-hairline rounded-md bg-accent/5">
            <Loader2 className="h-7 w-7 animate-spin text-brand" strokeWidth={1.75} />
            <p className="text-sm font-medium">Loading...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
