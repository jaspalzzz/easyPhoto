"use client";

import * as React from "react";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ShieldCheck, Camera, PenLine } from "lucide-react";

export function PortalResizer({ portalId }: { portalId: string }) {
  const spec = PORTAL_PRESETS[portalId];
  const [activeSubTool, setActiveSubTool] = React.useState<"photo" | "signature">("photo");

  React.useEffect(() => {
    setActiveSubTool("photo");
  }, [portalId]);

  if (!spec) {
    return (
      <div className="flex items-center gap-2 border-l-2 border-destructive bg-destructive/5 py-3 pl-4 text-sm text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span>Portal specification &quot;{portalId}&quot; not found.</span>
      </div>
    );
  }

  // Check if signature tools are required for this spec
  const hasSignature = spec.sigLimitKb !== undefined;

  return (
    <div className="space-y-6">
      {/* Specs Summary Banner */}
      <div className="rounded-lg border border-brand bg-brand-soft/10 p-5">
        <h3 className="font-semibold text-brand text-base mb-1.5">{spec.name} Requirements</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{spec.description}</p>
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded border border-hairline">
            <Camera className="h-3.5 w-3.5 shrink-0 text-ink-soft" strokeWidth={1.75} />
            Photo: {spec.photoMinKb ? `${spec.photoMinKb}–` : ""}{spec.photoLimitKb} KB
            {spec.photoWidthPx && ` · Min ${spec.photoWidthPx}×${spec.photoHeightPx}px`}
          </div>
          {hasSignature && (
            <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded border border-hairline">
              <PenLine className="h-3.5 w-3.5 shrink-0 text-ink-soft" strokeWidth={1.75} />
              Signature: {spec.sigMinKb ? `${spec.sigMinKb}–` : ""}{spec.sigLimitKb} KB
              {spec.sigWidthPx && ` · Min ${spec.sigWidthPx}×${spec.sigHeightPx}px`}
            </div>
          )}
        </div>
      </div>

      {/* Sub-tool Selector tabs */}
      {hasSignature && (
        <div className="flex border-b border-hairline gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTool("photo")}
            className={`border-b-2 px-4 py-2 text-sm font-semibold transition-all -mb-[2px] ${
              activeSubTool === "photo"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Compress Portal Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTool("signature")}
            className={`border-b-2 px-4 py-2 text-sm font-semibold transition-all -mb-[2px] ${
              activeSubTool === "signature"
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Clean &amp; Compress Signature
          </button>
        </div>
      )}

      {/* Tool Container */}
      <div>
        {activeSubTool === "photo" ? (
          <div className="space-y-3">
            <div className="px-1">
              <h4 className="text-sm font-semibold mb-1">Photo Sizer</h4>
              <p className="text-xs text-muted-foreground">Upload your passport-style photograph to compress below {spec.photoLimitKb} KB.</p>
            </div>
            <ResizeKbTool
              defaultKb={spec.photoLimitKb}
              minWidth={spec.photoWidthPx}
              minHeight={spec.photoHeightPx}
              minKb={spec.photoMinKb}
              densityDpi={spec.dpi}
              toolName={`form-resizer-${portalId}`}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="px-1">
              <h4 className="text-sm font-semibold mb-1">Signature Workspace</h4>
              <p className="text-xs text-muted-foreground">Upload a scan/photo of your signature to remove the background paper, auto-crop, and compress under {spec.sigLimitKb} KB.</p>
            </div>
            <SignatureWorkflowTool
              defaultTab="resize"
              defaultKb={spec.sigLimitKb}
              minKb={spec.sigMinKb}
              autoCropDefault={true}
            />
          </div>
        )}
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        All operations run entirely in your browser. Your images and signature scans are never uploaded or stored.
      </p>
    </div>
  );
}
