"use client";

import * as React from "react";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { specProvenance } from "@/lib/specRegistry";
import { ResizeKbTool } from "@/components/tools/ResizeKbTool";
import { SignatureWorkflowTool } from "@/components/tools/SignatureWorkflowTool";
import type { ToolSource } from "@/components/tools/ImageToolShell";
import { setWorkflowPayload } from "@/lib/workflowHandoff";
import { ToolLimitationsNotice } from "@/components/site/ToolLimitationsNotice";
import { AlertCircle, AlertTriangle, Camera, ExternalLink, PenLine, ShieldCheck } from "lucide-react";

export function PortalResizer({
  portalId,
  displayName,
}: {
  portalId: string;
  /** Override the shown name (sub-exam pages pass e.g. "SSC CGL"; spec stays the parent's). */
  displayName?: string;
}) {
  const spec = PORTAL_PRESETS[portalId];
  const shownName = displayName ?? spec?.name.split(" (")[0];
  const [activeSubTool, setActiveSubTool] = React.useState<"photo" | "signature">("photo");

  // The photo and signature sub-tools are two separate mounted components —
  // switching tabs used to just unmount one and mount the other, silently
  // dropping whatever the user had uploaded. This remembers the last-loaded
  // file (from whichever tab is currently active) so it can be handed to the
  // newly-active tab instead of forcing a re-upload.
  const lastSourceRef = React.useRef<ToolSource | null>(null);
  const handleSourceChange = React.useCallback((source: ToolSource | null) => {
    if (source) lastSourceRef.current = source;
  }, []);
  const switchSubTool = (tool: "photo" | "signature") => {
    if (tool !== activeSubTool && lastSourceRef.current) {
      setWorkflowPayload(lastSourceRef.current.file, lastSourceRef.current.file.name);
    }
    setActiveSubTool(tool);
  };

  React.useEffect(() => {
    setActiveSubTool("photo");
    lastSourceRef.current = null;
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
  const provenance = specProvenance(spec);
  const ProvenanceIcon = provenance.verified ? ShieldCheck : AlertTriangle;

  return (
    <div className="space-y-6">
      {/* Specs Summary Banner */}
      <div className="rounded-lg border border-brand bg-brand-soft/10 p-5">
        <h3 className="font-semibold text-brand text-base mb-1.5">{shownName} Requirements</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{spec.description}</p>
        <p className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
          <ProvenanceIcon
            className={`h-3.5 w-3.5 shrink-0 ${
              provenance.verified ? "text-brand" : "text-amber-600 dark:text-amber-400"
            }`}
            strokeWidth={1.75}
          />
          <span>{provenance.label}.</span>
          {provenance.url && (
            <a
              href={provenance.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-brand hover:underline"
            >
              Official source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </p>
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
            onClick={() => switchSubTool("photo")}
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
            onClick={() => switchSubTool("signature")}
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
              requirementLabel={shownName}
              toolName={`form-resizer-${portalId}`}
              onSourceChange={handleSourceChange}
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
              onSourceChange={handleSourceChange}
            />
          </div>
        )}
      </div>

      <ToolLimitationsNotice
        summary="Checks measurable file properties such as dimensions and file size. This resizer does not assess background uniformity or approximate face position, and it cannot guarantee acceptance — verify the current application instructions on the official portal."
        canCheck={[
          "Output file size and pixel dimensions shown by the resizer",
          "Whether the generated file reaches the selected size target",
        ]}
        cannotCheck={[
          "Background, expression, face position, identity, or recency",
          "Requirements not included in the selected preset",
          "The portal or reviewing authority’s final decision",
        ]}
      />

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        All operations run entirely in your browser. Your images and signature scans are never uploaded or stored.
      </p>
    </div>
  );
}
