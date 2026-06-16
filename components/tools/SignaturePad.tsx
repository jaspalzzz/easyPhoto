"use client";

import * as React from "react";
import { Loader2, Trash2, Check, FileUp, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { imageToCanvas } from "@/lib/imaging";
import { ensureDecodable } from "@/lib/heic";

interface SignaturePadProps {
  onSignatureReady: (dataUrl: string) => void;
  onCancel?: () => void;
}

export function SignaturePad({ onSignatureReady, onCancel }: SignaturePadProps) {
  const [activeTab, setActiveTab] = React.useState<"draw" | "upload">("draw");
  
  // Drawing pad states
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [penColor, setPenColor] = React.useState("#000000"); // black
  const [hasDrawn, setHasDrawn] = React.useState(false);
  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);

  // Upload states
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Store DPR in a ref so drawing callbacks always use the value set during init
  const dprRef = React.useRef<number>(1);

  // Initialize drawing canvas resolution using ResizeObserver so sizing
  // fires after layout is complete (handles off-screen / collapsed containers).
  React.useEffect(() => {
    if (activeTab !== "draw" || !canvasRef.current) return;
    const canvas = canvasRef.current;

    const initCanvas = (cssWidth: number, cssHeight: number) => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      // Use minimum dimensions so a zero-size layout never produces a 0×0 canvas
      const w = Math.max(cssWidth, 640);
      const h = Math.max(cssHeight, 240);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      // No ctx.scale — drawing code will multiply by dpr directly
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      initCanvas(width, height);
    });

    observer.observe(canvas);

    // Eagerly init with whatever size is already available (may be 0 if
    // off-screen — the observer will fire again once layout is complete)
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      initCanvas(rect.width, rect.height);
    }

    return () => observer.disconnect();
  }, [activeTab]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

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

    // Map CSS coordinates → backing-store coordinates using the ACTUAL ratio.
    // Using DPR alone was wrong: canvas.width is clamped to a 640×240 minimum,
    // so on a phone (~350px wide) the backing store is 640·dpr while the canvas
    // displays at 350px — every point landed ~1.8× off, growing with distance
    // from the corner (the "drawn 1.5in from my finger" bug). The width/height
    // ratio is correct regardless of the clamp or DPR.
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Keep the visible stroke ~2.5 CSS px thick whatever the backing scale is.
    return { x, y, lineWidth: Math.max(2, 2.5 * scaleX) };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    lastPointRef.current = coords;
    setHasDrawn(true);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = penColor;
      ctx.lineWidth = coords.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && lastPointRef.current) {
      ctx.beginPath();
      ctx.strokeStyle = penColor;
      ctx.lineWidth = coords.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      lastPointRef.current = coords;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearPad = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const applyDrawn = () => {
    if (!canvasRef.current || !hasDrawn) return;
    const canvas = canvasRef.current;
    
    // Trim drawing bounds close to the strokes
    const { canvas: trimmed, bbox } = trimToContent(canvas, {
      mode: "alpha",
      padding: 6,
    });
    
    if (!bbox) return;
    
    onSignatureReady(trimmed.toDataURL("image/png"));
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadLoading(true);
    setUploadError(null);
    try {
      const decodable = await ensureDecodable(file);
      
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(decodable);
        image.onload = () => {
          URL.revokeObjectURL(image.src);
          resolve(image);
        };
        image.onerror = (err) => {
          URL.revokeObjectURL(image.src);
          reject(err);
        };
      });
      
      const base = imageToCanvas(img, img.width, img.height);
      const cleaned = whiteToTransparent(base, {
        threshold: 210, // clean lighter gray values
        softness: 35,
        inkColor: "original",
      });
      
      const { canvas: trimmed, bbox } = trimToContent(cleaned, {
        mode: "alpha",
        padding: 8,
      });
      
      if (!bbox) {
        throw new Error("No signature detected. Verify the image has dark strokes on light paper.");
      }
      
      onSignatureReady(trimmed.toDataURL("image/png"));
    } catch (err: any) {
      console.error(err);
      setUploadError(err?.message || "Couldn't find a signature in this image. Dark ink on plain white paper, photographed straight-on in good light, works best.");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab toggle */}
      <div className="flex border-b border-hairline">
        <button
          id="sig-pad-tab-draw"
          type="button"
          onClick={() => setActiveTab("draw")}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors -mb-[2px] ${
            activeTab === "draw"
              ? "border-brand text-brand font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <PenTool className="h-3.5 w-3.5" /> Draw Signature
        </button>
        <button
          id="sig-pad-tab-upload"
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors -mb-[2px] ${
            activeTab === "upload"
              ? "border-brand text-brand font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileUp className="h-3.5 w-3.5" /> Upload Photo
        </button>
      </div>

      {/* Drawing Mode Workspace */}
      {activeTab === "draw" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                id="sig-pad-color-black"
                type="button"
                onClick={() => setPenColor("#000000")}
                className={`h-6 w-6 rounded-full border-2 transition-all ${
                  penColor === "#000000" ? "border-brand scale-110" : "border-hairline hover:scale-105"
                }`}
                style={{ backgroundColor: "#000000" }}
                title="Black Ink"
              />
              <button
                id="sig-pad-color-blue"
                type="button"
                onClick={() => setPenColor("#0033CB")}
                className={`h-6 w-6 rounded-full border-2 transition-all ${
                  penColor === "#0033CB" ? "border-brand scale-110" : "border-hairline hover:scale-105"
                }`}
                style={{ backgroundColor: "#0033CB" }}
                title="Blue Ink"
              />
            </div>
            <Button
              id="sig-pad-clear-btn"
              variant="outline"
              size="sm"
              onClick={clearPad}
              className="h-8 text-xs font-semibold"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Pad
            </Button>
          </div>

          {/* Roomy but not oversized — comfortable for big names/fingers without
              dominating the screen. Output auto-trims to the strokes, so pad
              size never affects the exported signature. */}
          <div className="relative border border-hairline rounded-md bg-paper overflow-hidden h-[190px] sm:h-[230px] max-w-full">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/60 pointer-events-none select-none">
                Draw your signature here using mouse or finger
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button id="sig-pad-cancel-btn" variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              id="sig-pad-apply-btn"
              variant="cta"
              size="sm"
              onClick={applyDrawn}
              disabled={!hasDrawn}
            >
              <Check className="h-4 w-4" /> Use Drawn Signature
            </Button>
          </div>
        </div>
      )}

      {/* Upload Mode Workspace */}
      {activeTab === "upload" && (
        <div className="space-y-4 animate-fadeIn">
          {uploadError && (
            <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-xs text-destructive">
              {uploadError}
            </p>
          )}

          <div
            id="sig-pad-upload-dropzone"
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
                fileInputRef.current!.files = e.dataTransfer.files;
                onImageUpload({ target: { files: e.dataTransfer.files } } as any);
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            {uploadLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            ) : (
              <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            )}
            <p className="font-semibold tracking-tight text-sm">Select signature image, or drop it here</p>
            <p className="text-xs text-muted-foreground">Automatically removes white background paper. Supports JPG, PNG, HEIC.</p>
            <input
              id="sig-pad-upload-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              className="hidden"
              onChange={onImageUpload}
              disabled={uploadLoading}
            />
          </div>

          {onCancel && (
            <div className="flex justify-end">
              <Button id="sig-pad-upload-cancel-btn" variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
