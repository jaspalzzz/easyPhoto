"use client";

import * as React from "react";
import { Loader2, Download, ShieldCheck, Sparkles, Crop, Maximize2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob, pngUnderKb, picaResizeTo } from "@/lib/imaging";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { compressToCap } from "@/lib/compress";
import { track, deviceClass } from "@/lib/analytics";

type Tab = "clean" | "crop" | "resize";

interface SignatureWorkflowProps {
  defaultTab?: Tab;
  defaultKb?: number;
  autoCropDefault?: boolean;
  toolName?: string;
}

function smoothCanvas(canvas: HTMLCanvasElement, radius: number): HTMLCanvasElement {
  if (radius <= 0) return canvas;
  
  const width = canvas.width;
  const height = canvas.height;
  
  const temp = document.createElement("canvas");
  temp.width = width;
  temp.height = height;
  const tctx = temp.getContext("2d");
  if (!tctx) return canvas;
  
  tctx.filter = `blur(${radius}px)`;
  tctx.drawImage(canvas, 0, 0);
  
  const imgData = tctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    let newAlpha = (alpha - 110) * 8;
    if (newAlpha < 0) newAlpha = 0;
    if (newAlpha > 255) newAlpha = 255;
    data[i + 3] = newAlpha;
  }
  
  tctx.putImageData(imgData, 0, 0);
  return temp;
}

function Body({
  source,
  defaultTab = "clean",
  defaultKb = 20,
  autoCropDefault = true,
  toolName = "signature-workflow",
}: {
  source: ToolSource;
  defaultTab?: Tab;
  defaultKb?: number;
  autoCropDefault?: boolean;
  toolName?: string;
}) {
  // Tabs & Navigation
  const [activeTab, setActiveTab] = React.useState<Tab>(defaultTab);

  // Background Settings (PNG vs JPEG)
  const [bgFormat, setBgFormat] = React.useState<"png" | "jpeg">("png");

  // Clean Settings
  const [threshold, setThreshold] = React.useState(200);
  const [softness, setSoftness] = React.useState(40);
  const [inkColor, setInkColor] = React.useState<"original" | "black" | "blue">("original");
  const [inkContrast, setInkContrast] = React.useState(1.0);

  // Crop Settings
  const [autoCrop, setAutoCrop] = React.useState(autoCropDefault);
  const [padding, setPadding] = React.useState(12);

  // Resize Settings
  const [presetKey, setPresetKey] = React.useState<string>("");
  const [resizeMode, setResizeMode] = React.useState<"kb" | "pixels">("kb");
  const [targetKb, setTargetKb] = React.useState(defaultKb);
  
  // Custom Dimension Resizing
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const [lock, setLock] = React.useState(true);

  // Eraser Settings
  const [eraserEnabled, setEraserEnabled] = React.useState(false);
  const [brushSize, setBrushSize] = React.useState(15);
  const [eraserVersion, setEraserVersion] = React.useState(0);
  const eraserCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Smoothing Settings
  const [smoothing, setSmoothing] = React.useState(0);

  // Output Result State
  const [busy, setBusy] = React.useState(false);
  const [out, setOut] = React.useState<{
    url: string;
    blob: Blob;
    bytes: number;
    w: number;
    h: number;
    underCap: boolean;
  } | null>(null);

  React.useEffect(() => {
    track({ name: "tool_start", tool: toolName, device: deviceClass() });
  }, [toolName]);

  // Reset eraser mask when new source image is loaded
  React.useEffect(() => {
    if (source) {
      const canvas = document.createElement("canvas");
      canvas.width = source.size.width;
      canvas.height = source.size.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      eraserCanvasRef.current = canvas;
      setEraserVersion(0);
    }
  }, [source]);

  // Drawing event handlers for Eraser tool
  const [isDrawing, setIsDrawing] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imgRef.current || !source) return null;
    const rect = imgRef.current.getBoundingClientRect();
    
    // Support touch events
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    // Scale back to natural canvas dimensions
    const scaleX = source.size.width / rect.width;
    const scaleY = source.size.height / rect.height;

    return {
      x: Math.round(xPos * scaleX),
      y: Math.round(yPos * scaleY),
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!eraserEnabled) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    setIsDrawing(true);
    draw(coords.x, coords.y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!eraserEnabled || !isDrawing) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    draw(coords.x, coords.y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const draw = (x: number, y: number) => {
    const canvas = eraserCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "black"; // Solid mask for eraser destination-out
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    setEraserVersion((prev) => prev + 1);
  };

  // Re-run pipeline whenever options change
  React.useEffect(() => {
    let cancelled = false;
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;

    const processCanvas = async () => {
      setBusy(true);
      try {
        // Step 1: Initialize canvas
        const base = imageToCanvas(source.image, source.size.width, source.size.height);
        
        // Step 2: Clean background & adjust ink
        const cleaned = whiteToTransparent(base, {
          threshold,
          softness,
          inkColor,
          inkContrast,
        });

        // Apply Eraser Mask if it exists
        if (eraserCanvasRef.current && eraserVersion > 0) {
          const cctx = cleaned.getContext("2d");
          if (cctx) {
            cctx.save();
            cctx.globalCompositeOperation = "destination-out";
            cctx.drawImage(eraserCanvasRef.current, 0, 0);
            cctx.restore();
          }
        }

        // Apply Ink Smoothing if specified
        let finalCleaned = cleaned;
        if (smoothing > 0) {
          finalCleaned = smoothCanvas(cleaned, smoothing);
        }

        // Step 3: Trim / Crop
        let finalCanvas = finalCleaned;
        let cropOk = true;
        if (autoCrop) {
          const { canvas: trimmed, bbox } = trimToContent(finalCleaned, {
            mode: "alpha",
            padding,
          });
          if (bbox) {
            finalCanvas = trimmed;
          } else {
            cropOk = false;
          }
        }

        // Apply white background flattening if JPEG is requested
        let renderCanvas = finalCanvas;
        if (bgFormat === "jpeg") {
          const flat = document.createElement("canvas");
          flat.width = finalCanvas.width;
          flat.height = finalCanvas.height;
          const fctx = flat.getContext("2d")!;
          fctx.fillStyle = "#FFFFFF";
          fctx.fillRect(0, 0, flat.width, flat.height);
          fctx.drawImage(finalCanvas, 0, 0);
          renderCanvas = flat;
        }

        // Step 4: Resize / Compress
        let resultBlob: Blob;
        let resultCanvas = renderCanvas;
        let isUnderCap = true;

        if (resizeMode === "kb") {
          if (bgFormat === "jpeg") {
            // High-quality JPEG binary search compression
            const compressed = await compressToCap(renderCanvas, targetKb, {
              minScale: 0.1,
            });
            resultBlob = compressed.blob;
            resultCanvas = imageToCanvas(renderCanvas, compressed.width, compressed.height);
            // Draw compressed result
            const tempCtx = resultCanvas.getContext("2d");
            if (tempCtx) {
              const bmp = await createImageBitmap(compressed.blob);
              tempCtx.drawImage(bmp, 0, 0);
              bmp.close?.();
            }
            isUnderCap = compressed.underCap;
          } else {
            // PNG compression (scale down only)
            const compressed = await pngUnderKb(renderCanvas, targetKb);
            resultBlob = compressed.blob;
            resultCanvas = compressed.canvas;
            isUnderCap = compressed.underCap;
          }
        } else {
          // Custom pixels resizing
          const resized = await picaResizeTo(
            renderCanvas,
            width || renderCanvas.width,
            height || renderCanvas.height
          );
          resultBlob = await canvasToBlob(
            resized,
            bgFormat === "jpeg" ? "image/jpeg" : "image/png",
            bgFormat === "jpeg" ? 0.9 : undefined
          );
          resultCanvas = resized;
        }

        if (cancelled) return;

        setOut({
          url: resultCanvas.toDataURL(bgFormat === "jpeg" ? "image/jpeg" : "image/png"),
          blob: resultBlob,
          bytes: resultBlob.size,
          w: resultCanvas.width,
          h: resultCanvas.height,
          underCap: isUnderCap,
        });

        const duration = typeof performance !== "undefined" ? performance.now() - t0 : 0;
        track({
          name: "tool_success",
          tool: toolName,
          device: deviceClass(),
          ms: Math.round(duration),
        });
      } catch (err) {
        console.error("Signature processing error:", err);
        if (!cancelled) {
          track({
            name: "tool_failure",
            tool: toolName,
            device: deviceClass(),
            reason: "clean-error",
          });
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    };

    processCanvas();

    return () => {
      cancelled = true;
    };
  }, [
    source,
    threshold,
    softness,
    inkColor,
    inkContrast,
    autoCrop,
    padding,
    resizeMode,
    targetKb,
    width,
    height,
    eraserVersion,
    smoothing,
    bgFormat,
    toolName,
  ]);

  // Handle preset selections
  const applyPreset = (key: string) => {
    setPresetKey(key);
    if (!key) return;

    const preset = PORTAL_PRESETS[key];
    if (preset) {
      if (preset.sigLimitKb) {
        setResizeMode("kb");
        setTargetKb(preset.sigLimitKb);
      }
      
      // If portal specifies preset dimensions, we lock those dimensions
      if (preset.sigWidthPx && preset.sigHeightPx) {
        setResizeMode("pixels");
        setWidth(preset.sigWidthPx);
        setHeight(preset.sigHeightPx);
      }
      
      // Auto-enable crop for portals to keep it clean
      setAutoCrop(true);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lock && out) {
      const aspect = out.w / out.h;
      setHeight(Math.max(1, Math.round(val / aspect)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lock && out) {
      const aspect = out.w / out.h;
      setWidth(Math.max(1, Math.round(val * aspect)));
    }
  };

  const handleDownload = () => {
    if (!out) return;
    const ext = bgFormat === "jpeg" ? "jpg" : "png";
    downloadBlob(out.blob, `signature-processed.${ext}`);
    track({
      name: "download",
      tool: toolName,
      format: ext,
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      {/* Left: Preview */}
      <div className="space-y-4">
        <PreviewFrame checker={bgFormat === "png"}>
          {busy ? (
            <div className="flex flex-col items-center justify-center py-20 text-sm text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-brand" strokeWidth={1.75} />
              <p className="mt-2">Processing signature...</p>
            </div>
          ) : out ? (
            <div className="flex flex-col items-center">
              <img
                ref={imgRef}
                src={out.url}
                alt="Processed signature preview"
                className={`max-h-[260px] w-auto object-contain select-none bg-white ${
                  eraserEnabled ? "cursor-crosshair border border-dashed border-brand/40" : ""
                }`}
                draggable={false}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
              />
              {eraserEnabled && (
                <p className="text-[11px] text-brand font-medium mt-2 text-center">
                  Drag on the image above to erase unwanted parts.
                </p>
              )}
            </div>
          ) : (
            <div className="py-20 text-sm text-muted-foreground">No preview available</div>
          )}
        </PreviewFrame>

        {out && !busy && (
          <div className="rounded-md border border-hairline bg-paper p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>File size: <strong className="text-foreground text-sm">{formatKb(out.bytes)}</strong></span>
              <span>Dimensions: <strong className="text-foreground text-sm">{out.w}×{out.h}px</strong></span>
            </div>
            
            {!out.underCap && resizeMode === "kb" && (
              <p className="border-l-2 border-amber-500 bg-amber-50/60 p-2 text-xs text-amber-900 leading-normal">
                Could not fit under {targetKb} KB without losing detail. Try a higher target limit or crop closer.
              </p>
            )}

            <div className="pt-1">
              <Button id="sig-download" variant="cta" className="w-full" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Download {bgFormat === "png" ? "Transparent PNG" : "Solid White JPG"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Controls Panel with Tabs */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-hairline">
          <button
            id="sig-tab-clean"
            type="button"
            onClick={() => setActiveTab("clean")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-[2px] ${
              activeTab === "clean"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" /> Clean
          </button>
          <button
            id="sig-tab-crop"
            type="button"
            onClick={() => setActiveTab("crop")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-[2px] ${
              activeTab === "crop"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crop className="h-4 w-4" /> Crop
          </button>
          <button
            id="sig-tab-resize"
            type="button"
            onClick={() => setActiveTab("resize")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-[2px] ${
              activeTab === "resize"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Maximize2 className="h-4 w-4" /> Resize &amp; Presets
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-paper p-4 rounded-md border border-hairline min-h-[280px]">
          
          {/* Tab 1: Clean Background */}
          {activeTab === "clean" && (
            <div className="space-y-5">
              {/* Output format picker */}
              <div className="space-y-2">
                <span className="eyebrow block">Output Format &amp; Background</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBgFormat("png")}
                    className={`rounded-md border py-1.5 text-xs font-medium transition-colors ${
                      bgFormat === "png"
                        ? "bg-brand/10 border-brand text-brand"
                        : "bg-background border-hairline hover:bg-accent/40"
                    }`}
                  >
                    Transparent PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgFormat("jpeg")}
                    className={`rounded-md border py-1.5 text-xs font-medium transition-colors ${
                      bgFormat === "jpeg"
                        ? "bg-brand/10 border-brand text-brand"
                        : "bg-background border-hairline hover:bg-accent/40"
                    }`}
                  >
                    Solid White JPG
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground block leading-relaxed">
                  {bgFormat === "jpeg" 
                    ? "🟢 Recommended for SSC, UPSC, and most Indian government forms." 
                    : "ℹ️ Transparent background, ideal for document overlays."}
                </span>
              </div>

              <div className="border-t border-hairline pt-4 space-y-1">
                <h4 className="text-sm font-semibold">Background Cleaning</h4>
                <p className="text-xs text-muted-foreground">Adjust transparency threshold to remove paper background textures.</p>
              </div>

              <label className="block text-sm">
                <span className="mb-1 flex items-center justify-between">
                  <span className="eyebrow">Paper Removal Strength</span>
                  <span className="font-mono text-xs text-brand font-semibold">{threshold}</span>
                </span>
                <input
                  id="sig-clean-threshold"
                  type="range"
                  min={100}
                  max={250}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full cursor-pointer accent-brand"
                />
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  Increase if gray smudges appear; decrease if ink lines break.
                </span>
              </label>

              <label className="block text-sm">
                <span className="mb-1 flex items-center justify-between">
                  <span className="eyebrow">Anti-aliasing Softness</span>
                  <span className="font-mono text-xs text-brand font-semibold">{softness}px</span>
                </span>
                <input
                  id="sig-clean-softness"
                  type="range"
                  min={10}
                  max={80}
                  value={softness}
                  onChange={(e) => setSoftness(Number(e.target.value))}
                  className="w-full cursor-pointer accent-brand"
                />
              </label>

              {/* Manual Eraser Brush */}
              <div className="border-t border-hairline pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold eyebrow uppercase tracking-wider text-muted-foreground">Manual Eraser</h4>
                    <p className="text-[11px] text-muted-foreground">Erase background noise or lines manually.</p>
                  </div>
                  <Button
                    id="sig-eraser-toggle"
                    type="button"
                    variant={eraserEnabled ? "cta" : "outline"}
                    size="sm"
                    className="h-8"
                    onClick={() => setEraserEnabled(!eraserEnabled)}
                  >
                    {eraserEnabled ? "Active" : "Enable"}
                  </Button>
                </div>

                {eraserEnabled && (
                  <div className="space-y-3 p-3 bg-accent/5 rounded-md border border-hairline animate-fadeIn">
                    <label className="block text-xs">
                      <span className="mb-1 flex items-center justify-between font-semibold uppercase text-[10px] text-muted-foreground">
                        <span>Brush Size</span>
                        <span>{brushSize}px</span>
                      </span>
                      <input
                        id="sig-eraser-brush-size"
                        type="range"
                        min={5}
                        max={60}
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full accent-brand cursor-pointer"
                      />
                    </label>

                    <Button
                      id="sig-eraser-reset"
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (eraserCanvasRef.current) {
                          const ctx = eraserCanvasRef.current.getContext("2d");
                          if (ctx) {
                            ctx.clearRect(0, 0, eraserCanvasRef.current.width, eraserCanvasRef.current.height);
                            setEraserVersion(0);
                          }
                        }
                      }}
                    >
                      Reset Erasures
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-hairline pt-4 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold eyebrow uppercase tracking-wider text-muted-foreground">Ink Adjustments</h4>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground block">Ink Color Preset</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["original", "black", "blue"] as const).map((color) => (
                      <button
                        id={`sig-ink-color-${color}`}
                        key={color}
                        type="button"
                        onClick={() => setInkColor(color)}
                        className={`rounded-md border py-1.5 text-xs font-medium transition-colors ${
                          inkColor === color
                            ? "bg-brand/10 border-brand text-brand"
                            : "bg-background border-hairline hover:bg-accent/40"
                        }`}
                      >
                        {color === "original" ? "Original Ink" : color === "black" ? "Solid Black" : "Solid Blue"}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-sm">
                  <span className="mb-1 flex items-center justify-between">
                    <span className="eyebrow">Ink Stroke Thickness (Contrast)</span>
                    <span className="font-mono text-xs text-brand font-semibold">{inkContrast.toFixed(1)}x</span>
                  </span>
                  <input
                    id="sig-ink-contrast"
                    type="range"
                    min={1.0}
                    max={3.0}
                    step={0.1}
                    value={inkContrast}
                    onChange={(e) => setInkContrast(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand"
                  />
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Enhance faint ink writing for better biometric readability.
                  </span>
                </label>

                <label className="block text-sm">
                  <span className="mb-1 flex items-center justify-between">
                    <span className="eyebrow">Ink Smoothing</span>
                    <span className="font-mono text-xs text-brand font-semibold">
                      {smoothing === 0 ? "Off" : `${smoothing}px`}
                    </span>
                  </span>
                  <input
                    id="sig-ink-smoothing"
                    type="range"
                    min={0}
                    max={3}
                    step={0.5}
                    value={smoothing}
                    onChange={(e) => setSmoothing(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand"
                  />
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Smooth jagged edges for high-DPI scan look.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: Auto-Crop Bounding Box */}
          {activeTab === "crop" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Auto Crop Settings</h4>
                <p className="text-xs text-muted-foreground">Trim margins dynamically close to ink stroke boundaries.</p>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium pt-1">
                <input
                  id="sig-crop-auto"
                  type="checkbox"
                  checked={autoCrop}
                  onChange={(e) => setAutoCrop(e.target.checked)}
                  className="rounded border-hairline text-brand focus:ring-brand h-4 w-4"
                />
                Enable Auto-Cropping
              </label>

              {autoCrop && (
                <label className="block text-sm pt-2 animate-fadeIn">
                  <span className="mb-1 flex items-center justify-between">
                    <span className="eyebrow">Crop Margin Padding</span>
                    <span className="font-mono text-xs text-brand font-semibold">{padding}px</span>
                  </span>
                  <input
                    id="sig-crop-padding"
                    type="range"
                    min={0}
                    max={40}
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand"
                  />
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Border space left around the outermost strokes.
                  </span>
                </label>
              )}
            </div>
          )}

          {/* Tab 3: Resizing & Preset Limits */}
          {activeTab === "resize" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Presets &amp; Compression</h4>
                <p className="text-xs text-muted-foreground">Select a government form template or configure target boundaries.</p>
              </div>

              {/* Portal Presets dropdown */}
              <div>
                <span className="text-xs font-medium text-muted-foreground block mb-1.5">Apply Exam / Form Preset</span>
                <select
                  value={presetKey}
                  onChange={(e) => applyPreset(e.target.value)}
                  className="w-full h-9 rounded-md border border-hairline-strong bg-background px-3 text-xs focus:border-brand"
                >
                  <option value="">-- Choose Preset Specs --</option>
                  {Object.keys(PORTAL_PRESETS).map((k) => (
                    <option key={k} value={k}>
                      {PORTAL_PRESETS[k].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-hairline pt-4 space-y-3">
                <span className="text-xs font-semibold eyebrow block">Resize Settings</span>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResizeMode("kb")}
                    className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors ${
                      resizeMode === "kb"
                        ? "bg-brand/10 border-brand text-brand"
                        : "bg-background border-hairline hover:bg-accent/40"
                    }`}
                  >
                    Compress to KB
                  </button>
                  <button
                    type="button"
                    onClick={() => setResizeMode("pixels")}
                    className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors ${
                      resizeMode === "pixels"
                        ? "bg-brand/10 border-brand text-brand"
                        : "bg-background border-hairline hover:bg-accent/40"
                    }`}
                  >
                    Exact Dimensions
                  </button>
                </div>

                {resizeMode === "kb" ? (
                  <label className="block text-sm pt-2">
                    <span className="mb-1 flex items-center justify-between">
                      <span className="eyebrow">Target File Size</span>
                      <span className="font-mono text-xs text-brand font-semibold">Under {targetKb} KB</span>
                    </span>
                    <input
                      id="sig-resize-target-kb"
                      type="range"
                      min={5}
                      max={150}
                      value={targetKb}
                      onChange={(e) => setTargetKb(Number(e.target.value))}
                      className="w-full cursor-pointer accent-brand"
                    />
                  </label>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs">
                        <span className="eyebrow mb-1 block">Width (px)</span>
                        <input
                          id="sig-resize-width"
                          type="number"
                          value={width || (out ? out.w : 0)}
                          onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value) || 0))}
                          className="w-full h-9 rounded-md border border-hairline bg-background px-3 font-mono text-xs focus:border-brand"
                        />
                      </label>
                      <label className="text-xs">
                        <span className="eyebrow mb-1 block">Height (px)</span>
                        <input
                          id="sig-resize-height"
                          type="number"
                          value={height || (out ? out.h : 0)}
                          onChange={(e) => handleHeightChange(Math.max(1, Number(e.target.value) || 0))}
                          className="w-full h-9 rounded-md border border-hairline bg-background px-3 font-mono text-xs focus:border-brand"
                        />
                      </label>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground pt-1">
                      <input
                        id="sig-resize-lock"
                        type="checkbox"
                        checked={lock}
                        onChange={(e) => setLock(e.target.checked)}
                        className="rounded border-hairline text-brand focus:ring-brand h-3.5 w-3.5"
                      />
                      Lock Aspect Ratio
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SignatureWorkflowTool({
  defaultTab = "clean",
  defaultKb = 20,
  autoCropDefault = true,
  toolName = "signature-workflow",
}: SignatureWorkflowProps) {
  React.useEffect(() => {
    track({ name: "tool_view", tool: toolName });
  }, [toolName]);

  return (
    <ImageToolShell>
      {(source) => (
        <Body
          source={source}
          defaultTab={defaultTab}
          defaultKb={defaultKb}
          autoCropDefault={autoCropDefault}
          toolName={toolName}
        />
      )}
    </ImageToolShell>
  );
}
