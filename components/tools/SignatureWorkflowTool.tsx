"use client";

import * as React from "react";
import { Loader2, Download, FileUp, ShieldCheck, Check, Sparkles, SlidersHorizontal, Crop, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, canvasToBlob, pngUnderKb, picaResizeTo } from "@/lib/imaging";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

type Tab = "clean" | "crop" | "resize";

interface SignatureWorkflowProps {
  defaultTab?: Tab;
  defaultKb?: number;
  autoCropDefault?: boolean;
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
}: {
  source: ToolSource;
  defaultTab?: Tab;
  defaultKb?: number;
  autoCropDefault?: boolean;
}) {
  // Tabs & Navigation
  const [activeTab, setActiveTab] = React.useState<Tab>(defaultTab);

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
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    let clientX: number;
    let clientY: number;
    
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const origX = (x / rect.width) * source.size.width;
    const origY = (y / rect.height) * source.size.height;
    
    return { x: origX, y: origY };
  };

  const handleStart = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    if (!eraserEnabled) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    const canvas = eraserCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(coords.x, coords.y);
      }
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    if (!eraserEnabled || !isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    const canvas = eraserCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        setEraserVersion((v) => v + 1);
      }
    }
  };

  const handleEnd = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setEraserVersion((v) => v + 1);
    }
  };

  // Processing Output State
  const [busy, setBusy] = React.useState(false);
  const [out, setOut] = React.useState<{
    url: string;
    blob: Blob;
    bytes: number;
    w: number;
    h: number;
    underCap: boolean;
  } | null>(null);

  // Initial dimensions when file is loaded
  React.useEffect(() => {
    if (source) {
      setWidth(source.size.width);
      setHeight(source.size.height);
    }
  }, [source]);

  // Main canvas generation pipeline
  React.useEffect(() => {
    let cancelled = false;
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

        // Step 4: Resize / Compress
        let resultBlob: Blob;
        let resultCanvas = finalCanvas;
        let isUnderCap = true;

        if (resizeMode === "kb") {
          const compressed = await pngUnderKb(finalCanvas, targetKb);
          resultBlob = compressed.blob;
          resultCanvas = compressed.canvas;
          isUnderCap = compressed.underCap;
        } else {
          // Custom pixels resizing
          const resized = await picaResizeTo(finalCanvas, width || finalCanvas.width, height || finalCanvas.height);
          resultBlob = await canvasToBlob(resized, "image/png");
          resultCanvas = resized;
        }

        if (cancelled) return;

        setOut({
          url: resultCanvas.toDataURL("image/png"),
          blob: resultBlob,
          bytes: resultBlob.size,
          w: resultCanvas.width,
          h: resultCanvas.height,
          underCap: isUnderCap,
        });
      } catch (err) {
        console.error("Signature processing error:", err);
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

  const onDownload = async (type: "image/png" | "image/jpeg") => {
    if (!out) return;
    let finalBlob = out.blob;
    if (type === "image/jpeg") {
      // JPG needs flattening (transparency -> white background)
      const flatCanvas = document.createElement("canvas");
      flatCanvas.width = out.w;
      flatCanvas.height = out.h;
      const ctx = flatCanvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, out.w, out.h);
      
      // Draw transparent result onto white canvas
      const img = new Image();
      img.src = out.url;
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          resolve(true);
        };
      });
      finalBlob = await canvasToBlob(flatCanvas, "image/jpeg", 0.95);
    }
    
    const ext = type === "image/png" ? "png" : "jpg";
    downloadBlob(finalBlob, `signature-processed.${ext}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      {/* Left: Preview */}
      <div className="space-y-4">
        <PreviewFrame checker>
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
                className={`max-h-[260px] w-auto object-contain select-none ${
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

            <div className="flex gap-2 pt-1">
              <Button variant="cta" className="flex-1" onClick={() => onDownload("image/png")}>
                <Download className="h-4 w-4" /> Download PNG (Transparent)
              </Button>
              <Button variant="outline" onClick={() => onDownload("image/jpeg")} title="Download flattened JPG">
                Download JPG
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
            type="button"
            onClick={() => setActiveTab("resize")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-[2px] ${
              activeTab === "resize"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Maximize2 className="h-4 w-4" /> Resize & Presets
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-paper p-4 rounded-md border border-hairline min-h-[280px]">
          
          {/* Tab 1: Clean Background */}
          {activeTab === "clean" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Background Cleaning</h4>
                <p className="text-xs text-muted-foreground">Adjust transparency threshold to remove paper background textures.</p>
              </div>

              <label className="block text-sm">
                <span className="mb-1 flex items-center justify-between">
                  <span className="eyebrow">Paper Removal Strength</span>
                  <span className="font-mono text-xs text-brand font-semibold">{threshold}</span>
                </span>
                <input
                  type="range"
                  min={100}
                  max={250}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full"
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
                  type="range"
                  min={10}
                  max={80}
                  value={softness}
                  onChange={(e) => setSoftness(Number(e.target.value))}
                  className="w-full"
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
                        type="range"
                        min={5}
                        max={60}
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full accent-brand cursor-pointer"
                      />
                    </label>

                    <Button
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
                    type="range"
                    min={1.0}
                    max={3.0}
                    step={0.1}
                    value={inkContrast}
                    onChange={(e) => setInkContrast(Number(e.target.value))}
                    className="w-full"
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
                    type="range"
                    min={0}
                    max={3}
                    step={0.5}
                    value={smoothing}
                    onChange={(e) => setSmoothing(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Smooths out jagged borders and pixelation on low-res scans.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: Auto-Crop */}
          {activeTab === "crop" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Auto-Crop Controls</h4>
                <p className="text-xs text-muted-foreground">Remove empty white borders and trim the canvas to the signature bounds.</p>
              </div>

              <label className="flex items-center gap-2.5 rounded-md border border-hairline p-3 bg-background cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCrop}
                  onChange={(e) => setAutoCrop(e.target.checked)}
                  className="rounded text-brand focus:ring-brand h-4 w-4"
                />
                <div>
                  <span className="text-xs font-semibold block">Enable Automatic Cropping</span>
                  <span className="text-[11px] text-muted-foreground block">Detects ink bounds and crops margin spacing.</span>
                </div>
              </label>

              {autoCrop && (
                <label className="block text-sm space-y-1.5 animate-fadeIn">
                  <span className="mb-1 flex items-center justify-between">
                    <span className="eyebrow">Edge Padding</span>
                    <span className="font-mono text-xs text-brand font-semibold">{padding}px</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Controls spacing between the ink boundaries and the canvas edge.
                  </span>
                </label>
              )}
            </div>
          )}

          {/* Tab 3: Resize & Presets */}
          {activeTab === "resize" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Presets & Target Caps</h4>
                <p className="text-xs text-muted-foreground">Select popular application forms or specify custom file/dimension constraints.</p>
              </div>

              {/* Portal Presets Dropdown */}
              <label className="block text-sm">
                <span className="eyebrow mb-1.5 block">Application Form Preset</span>
                <select
                  value={presetKey}
                  onChange={(e) => applyPreset(e.target.value)}
                  className="h-10 w-full rounded-md border border-hairline-strong bg-background px-3 text-sm text-foreground focus:border-brand focus:ring-1 focus:ring-brand"
                >
                  <option value="">Custom Constraints (Manual)</option>
                  {Object.entries(PORTAL_PRESETS)
                    .filter(([_, preset]) => preset.sigLimitKb !== undefined)
                    .map(([key, preset]) => (
                      <option key={key} value={key}>
                        {preset.name} (Max {preset.sigLimitKb} KB)
                      </option>
                    ))}
                </select>
              </label>

              {/* Resize Mode Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-medium text-muted-foreground block">Sizing Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResizeMode("kb")}
                    className={`rounded-md border py-1.5 text-xs font-medium transition-colors ${
                      resizeMode === "kb"
                        ? "bg-brand/10 border-brand text-brand"
                        : "bg-background border-hairline hover:bg-accent/40"
                    }`}
                  >
                    Target File Size (KB)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResizeMode("pixels")}
                    className={`rounded-md border py-1.5 text-xs font-medium transition-colors ${
                      resizeMode === "pixels"
                        ? "bg-brand/10 border-brand text-brand"
                        : "bg-background border-hairline hover:bg-accent/40"
                    }`}
                  >
                    Exact Dimensions (Px)
                  </button>
                </div>
              </div>

              {/* Mode 1: KB Target */}
              {resizeMode === "kb" && (
                <label className="block text-sm space-y-1 animate-fadeIn">
                  <span className="eyebrow block">Target Size Limit (KB)</span>
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    value={targetKb}
                    onChange={(e) => setTargetKb(Math.max(5, Number(e.target.value) || 20))}
                    className="h-10 w-32 rounded-md border border-hairline-strong bg-background px-3 font-mono text-[13px]"
                  />
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    Signature will scale down slightly until it falls below this limit.
                  </span>
                </label>
              )}

              {/* Mode 2: Custom Pixels Target */}
              {resizeMode === "pixels" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-end gap-3">
                    <label className="text-sm flex-1">
                      <span className="eyebrow mb-1 block">Width (px)</span>
                      <input
                        type="number"
                        min={20}
                        value={width || ""}
                        placeholder="Width"
                        onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value) || 0))}
                        className="h-10 w-full rounded-md border border-hairline-strong bg-background px-3 font-mono text-[13px]"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setLock((v) => !v)}
                      className={`h-10 w-10 flex items-center justify-center border rounded-md transition-colors ${
                        lock ? "bg-brand/10 border-brand text-brand" : "border-hairline hover:bg-accent/40 text-muted-foreground"
                      }`}
                      title={lock ? "Lock aspect ratio" : "Unlock aspect ratio"}
                    >
                      {lock ? <span className="font-mono text-xs">🔒</span> : <span className="font-mono text-xs">🔓</span>}
                    </button>

                    <label className="text-sm flex-1">
                      <span className="eyebrow mb-1 block">Height (px)</span>
                      <input
                        type="number"
                        min={20}
                        value={height || ""}
                        placeholder="Height"
                        onChange={(e) => handleHeightChange(Math.max(1, Number(e.target.value) || 0))}
                        className="h-10 w-full rounded-md border border-hairline-strong bg-background px-3 font-mono text-[13px]"
                      />
                    </label>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export function SignatureWorkflowTool(props: SignatureWorkflowProps) {
  return (
    <ImageToolShell>
      {(source) => <Body source={source} {...props} />}
    </ImageToolShell>
  );
}
