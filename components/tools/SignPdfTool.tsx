"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck, ChevronLeft, ChevronRight, PenLine, RotateCcw } from "lucide-react";
import { consumeWorkflowPayload } from "@/lib/workflowHandoff";
import { ProcessingState } from "@/components/site/ProcessingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pdfToCanvases, PdfEncryptedError } from "@/lib/pdfToImages";
import { downloadBlob } from "@/lib/download";
import { SignaturePad } from "./SignaturePad";
import { SignatureOverlay, type Placement } from "./SignatureOverlay";
import type { SignaturePlacement } from "@/lib/pdfEdit";

interface PlacedSignature {
  id: string;
  signatureUrl: string;
  placement: Placement;
}

export function SignPdfTool() {
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  // Fix #1: hold canvases in a ref (not state) so we can null them on reset/unmount
  const canvasesRef = React.useRef<HTMLCanvasElement[]>([]);
  // Derived page count drives re-renders without keeping bitmaps in React state
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [activePageIndex, setActivePageIndex] = React.useState<number>(0);
  
  // Placed signatures state: map of page index -> array of signatures placed
  const [signaturesPerPage, setSignaturesPerPage] = React.useState<Record<number, PlacedSignature[]>>({});

  // Active signature configuration (drawn or uploaded)
  const [activeSignature, setActiveSignature] = React.useState<string | null>(null);
  const [showPad, setShowPad] = React.useState(false);

  // App UI states
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const localCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Fix #1: cleanup canvases on unmount
  React.useEffect(() => {
    return () => {
      canvasesRef.current = [];
    };
  }, []);

  React.useEffect(() => {
    const payload = consumeWorkflowPayload();
    if (payload) {
      const f = new File([payload.blob], payload.filename, { type: "application/pdf" });
      loadPdf(f);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadPdf(e.target.files[0]);
    }
  };

  const loadPdf = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF document.");
      return;
    }
    setError(null);
    setBusy(true);
    // Fix #1: clear the ref before loading a new file
    canvasesRef.current = [];
    setPageCount(0);
    setSignaturesPerPage({});
    setPdfFile(file);
    setActivePageIndex(0);
    setProgress("Loading PDF pages...");
    try {
      // Fix #3: detect password-protected PDFs before attempting to render
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      const data = await file.arrayBuffer();
      try {
        const probe = await pdfjs.getDocument({ data }).promise;
        await probe.destroy();
      } catch (encErr: any) {
        if (encErr?.name === "PasswordException") {
          setError("encrypted");
          setPdfFile(null);
          return;
        }
        throw encErr;
      }

      const canvases = await pdfToCanvases(file, {
        scale: 1.5, // 150 DPI is highly readable and fits on screen
        maxPages: 50,
        onProgress: (current, total) => {
          setProgress(`Rendering page ${current} of ${total}...`);
        },
      });
      canvasesRef.current = canvases;
      setPageCount(canvases.length);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof PdfEncryptedError) {
        setError("encrypted");
      } else {
        setError((err instanceof Error && err.message) || "Could not load the PDF. Make sure it is not encrypted.");
      }
      setPdfFile(null);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  // Draw pre-rendered page onto display canvas when active page changes
  React.useEffect(() => {
    const canvas = localCanvasRef.current;
    const source = canvasesRef.current[activePageIndex];
    if (canvas && source) {
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(source, 0, 0);
      }
    }
  }, [activePageIndex, pageCount]);

  const addSignatureToPage = () => {
    if (!activeSignature) return;
    const newSig: PlacedSignature = {
      id: Math.random().toString(36).substring(2, 9),
      signatureUrl: activeSignature,
      placement: {
        x: 35, // center-ish
        y: 40,
        width: 30, // 30% of parent width
        height: 12, // will be auto-adjusted to fit aspect ratio
      },
    };

    setSignaturesPerPage((prev) => {
      const currentList = prev[activePageIndex] || [];
      return {
        ...prev,
        [activePageIndex]: [...currentList, newSig],
      };
    });
  };

  const updatePlacement = (pageIdx: number, sigId: string, newPlacement: Placement) => {
    setSignaturesPerPage((prev) => {
      const list = prev[pageIdx] || [];
      const updated = list.map((sig) => (sig.id === sigId ? { ...sig, placement: newPlacement } : sig));
      return {
        ...prev,
        [pageIdx]: updated,
      };
    });
  };

  const deleteSignature = (pageIdx: number, sigId: string) => {
    setSignaturesPerPage((prev) => {
      const list = prev[pageIdx] || [];
      return {
        ...prev,
        [pageIdx]: list.filter((sig) => sig.id !== sigId),
      };
    });
  };

  const runExport = async () => {
    if (!pdfFile || canvasesRef.current.length === 0) return;
    setBusy(true);
    setProgress("Applying signatures to PDF...");
    setError(null);

    try {
      // LOSSLESS: overlay signatures onto the ORIGINAL pages via pdf-lib so the
      // document's text/vectors are preserved (no rasterizing the whole PDF).
      const { signPdf } = await import("@/lib/pdfEdit");
      const map: Record<number, SignaturePlacement[]> = {};
      for (const [idx, sigs] of Object.entries(signaturesPerPage)) {
        if (!sigs?.length) continue;
        map[Number(idx)] = sigs.map((s) => ({
          signatureUrl: s.signatureUrl,
          x: s.placement.x,
          y: s.placement.y,
          width: s.placement.width,
          height: s.placement.height,
        }));
      }
      const pdfBlob = await signPdf(pdfFile, map);

      const baseName = pdfFile.name.replace(/\.[^/.]+$/, "");
      downloadBlob(pdfBlob, `${baseName}-signed.pdf`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to compile signed PDF. Please try again.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const reset = () => {
    setPdfFile(null);
    // Fix #1: explicitly clear the canvas ref so bitmaps can be GC'd
    canvasesRef.current = [];
    setPageCount(0);
    setSignaturesPerPage({});
    setActivePageIndex(0);
    setError(null);
  };

  const activePageSignatures = signaturesPerPage[activePageIndex] || [];
  // Fix #2: gate Save PDF on at least one placed signature
  const totalSignatures = Object.values(signaturesPerPage).reduce((s, a) => s + a.length, 0);

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {/* Upload Zone */}
        {!pdfFile && !busy && (
          <div
            id="pdf-signer-dropzone"
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
                loadPdf(e.dataTransfer.files[0]);
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-paper p-8 text-center transition-colors hover:bg-accent/40"
          >
            <FileUp className="h-8 w-8 text-brand" strokeWidth={1.75} />
            <p className="font-semibold tracking-tight text-sm">Select PDF document to sign, or drop it here</p>
            <p className="text-xs text-muted-foreground">Modify PDF, place signature and initial pages offline privately.</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Processed 100% locally
            </p>
            <input
              id="pdf-signer-file-input"
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onFileSelect}
            />
          </div>
        )}

        {error && (
          <p className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-sm text-destructive">
            {error === "encrypted" ? (
              <>
                This PDF is password-protected. Please unlock it first using the{" "}
                <a href="/tools/unlock-pdf" className="underline font-medium">Unlock PDF tool</a>.
              </>
            ) : error}
          </p>
        )}

        {pdfFile && pageCount > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
            {/* Left Column: Interactive Page Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm truncate max-w-sm" title={pdfFile.name}>
                    {pdfFile.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span>Page {activePageIndex + 1} of {pageCount}</span>
                    <span>·</span>
                    <span>{signaturesPerPage[activePageIndex]?.length || 0} signatures on page</span>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <Button
                    id="pdf-signer-prev-page"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={activePageIndex === 0}
                    onClick={() => setActivePageIndex((i) => i - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    id="pdf-signer-next-page"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={activePageIndex === pageCount - 1}
                    onClick={() => setActivePageIndex((i) => i + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Canvas viewport wrapper */}
              <div className="flex justify-center bg-accent/5 p-4 border border-hairline rounded-md">
                <div
                  ref={containerRef}
                  className="relative inline-block border border-hairline shadow bg-white select-none"
                  style={{ touchAction: "none" }}
                >
                  <canvas ref={localCanvasRef} className="block max-w-full h-auto" />
                  
                  {/* Overlay Signatures on Active Page */}
                  {activePageSignatures.map((sig) => (
                    <SignatureOverlay
                      key={sig.id}
                      signatureUrl={sig.signatureUrl}
                      placement={sig.placement}
                      parentRef={containerRef}
                      onPlacementChange={(p) => updatePlacement(activePageIndex, sig.id, p)}
                      onDelete={() => deleteSignature(activePageIndex, sig.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Signature Controls */}
            <div className="space-y-4">
              {/* Reset or Save Actions */}
              <div className="flex gap-2">
                <Button id="pdf-signer-reset-btn" variant="outline" size="sm" className="flex-1" onClick={reset} disabled={busy}>
                  Reset
                </Button>
                <Button
                  id="pdf-signer-save-btn"
                  variant="cta"
                  size="sm"
                  className="flex-1"
                  onClick={runExport}
                  disabled={busy || totalSignatures === 0}
                  title={totalSignatures === 0 ? "Place at least one signature before saving" : undefined}
                >
                  <Download className="h-4 w-4" /> Save PDF
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
                      id="pdf-signer-add-sig-btn"
                      variant="cta"
                      size="sm"
                      className="w-full text-xs font-bold"
                      onClick={addSignatureToPage}
                    >
                      Place on Current Page
                    </Button>

                    <Button
                      id="pdf-signer-new-sig-btn"
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
                      <p className="text-[11px] text-muted-foreground mt-0.5">Draw or upload your signature to place on the document.</p>
                    </div>
                    <Button
                      id="pdf-signer-create-sig-btn"
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

        {busy && <ProcessingState label={progress ?? "Loading…"} />}
      </CardContent>
    </Card>
  );
}
