"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Share2, RefreshCcw, IdCard, Crop, Eraser, Minimize2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/tool/CameraCapture";
import { WorkflowNextSteps } from "@/components/site/WorkflowNextSteps";
import { useToolStore } from "@/store/useToolStore";
import { downloadBlob, shareFile } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

/**
 * Standalone camera tool. The capture experience lives in the shared
 * <CameraCapture> (also used by the photo uploader); this page just adds the
 * download / share panel once a shot is confirmed.
 */
export function CameraCaptureTool() {
  const router = useRouter();
  const setPendingFile = useToolStore((s) => s.setPendingFile);
  const [file, setFile] = React.useState<File | null>(null);
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const urlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "camera-capture" });
  }, []);

  React.useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const onCapture = (f: File) => {
    setFile(f);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(f);
    urlRef.current = url;
    setResultUrl(url);
    track({ name: "tool_success", tool: "camera-capture", device: deviceClass() });
  };

  const retake = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setResultUrl(null);
    setFile(null);
  };

  const handleDownload = () => {
    if (!file) return;
    downloadBlob(file, "camera-photo.jpg");
    track({ name: "download", tool: "camera-capture", format: "jpg" });
  };

  const handleShare = async () => {
    if (!file) return;
    await shareFile(file, "camera-photo.jpg", "Camera photo");
  };

  // Primary path: a freshly captured selfie almost always wants the passport
  // maker. Hand the shot to the maker via the store (same mechanism the hero
  // uploader uses) so it's already loaded — no re-pick.
  const makePassport = () => {
    if (!file) return;
    setPendingFile(file);
    track({ name: "tool_success", tool: "camera-capture", device: deviceClass() });
    router.push("/passport-photo/");
  };

  if (!file || !resultUrl) {
    return <CameraCapture onCapture={onCapture} confirmLabel="Use this photo" />;
  }

  return (
    <div className="space-y-4">
      <div className="mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={resultUrl} alt="Captured photo" className="h-full w-full object-cover" />
      </div>
      {/* Primary next step — make a passport photo from the capture. */}
      <Button variant="cta" className="mx-auto flex w-full max-w-sm" onClick={makePassport}>
        <IdCard className="h-4 w-4" strokeWidth={1.75} /> Make a passport photo
        <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" strokeWidth={1.75} /> Download JPG
        </Button>
        {"share" in navigator && (
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" strokeWidth={1.75} /> Share
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={retake}>
          <RefreshCcw className="h-4 w-4" strokeWidth={1.75} /> Retake
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Captured on your device — nothing was uploaded.
      </p>

      {/* Other common follow-ups — the shot is handed off, no re-pick. */}
      <div className="mx-auto w-full max-w-md">
        <WorkflowNextSteps
          getBlob={async () => file}
          filename="camera-photo.jpg"
          steps={[
            { slug: "image-crop", label: "Crop photo", hint: "Trim or reframe the shot", icon: <Crop className="h-4 w-4" strokeWidth={1.75} /> },
            { slug: "background-removal", label: "Remove background", hint: "Plain white background", icon: <Eraser className="h-4 w-4" strokeWidth={1.75} /> },
            { slug: "resize-kb", label: "Resize to KB", hint: "Hit an upload size limit", icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} /> },
          ]}
        />
      </div>
    </div>
  );
}
