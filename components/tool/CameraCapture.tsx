"use client";

import * as React from "react";
import {
  Camera,
  RefreshCcw,
  SwitchCamera,
  AlertCircle,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Facing = "user" | "environment";
type Phase = "starting" | "live" | "captured" | "error";

/**
 * Reusable in-browser camera capture — the single source of `getUserMedia`
 * capture logic shared by the standalone Camera tool AND the shared Uploader
 * (so the passport/visa maker and every photo flow can offer "take a photo").
 *
 * It composes the shot on-device and hands back a JPEG `File` via `onCapture`;
 * nothing is ever uploaded. The consumer decides what to do with the file
 * (feed the maker pipeline, show a download panel, etc.).
 */
export function CameraCapture({
  onCapture,
  onCancel,
  cancelLabel = "Back to upload",
  confirmLabel = "Use this photo",
  className,
}: {
  /** Called with the captured JPEG when the user confirms the shot. */
  onCapture: (file: File) => void;
  /** Optional: leave the camera (e.g. return to the dropzone). */
  onCancel?: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [phase, setPhase] = React.useState<Phase>("starting");
  const [facing, setFacing] = React.useState<Facing>("user");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const blobRef = React.useRef<Blob | null>(null);
  const urlRef = React.useRef<string | null>(null);

  const stopStream = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const start = React.useCallback(
    async (mode: Facing) => {
      setErrorMsg(null);
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setErrorMsg(
          "Your browser doesn't support camera access. Try Chrome or Safari, or upload a photo file instead."
        );
        setPhase("error");
        return;
      }
      setPhase("starting");
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setFacing(mode);
        setPhase("live");
      } catch (err) {
        const name = err instanceof Error ? err.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          setErrorMsg(
            "Camera permission was blocked. Allow camera access in your browser's site settings, then try again."
          );
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setErrorMsg(
            "No camera was found. Use a device with a camera, or upload a photo file instead."
          );
        } else {
          setErrorMsg("Could not start the camera. Close other apps using it and try again.");
        }
        setPhase("error");
      }
    },
    [stopStream]
  );

  // Auto-start when mounted (the user already opted into the camera), and
  // release the camera + object URL on unmount.
  React.useEffect(() => {
    start("user");
    return () => {
      stopStream();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [start, stopStream]);

  const capture = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Draw the true (un-mirrored) frame — preview is mirrored only for a
    // natural selfie feel; the saved photo must keep real left/right.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        blobRef.current = blob;
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setResultUrl(url);
        setPhase("captured");
        // Keep the stream alive so "Retake" is instant.
      },
      "image/jpeg",
      0.92
    );
  }, []);

  const retake = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setResultUrl(null);
    if (streamRef.current) setPhase("live");
    else start(facing);
  };

  const confirm = () => {
    const blob = blobRef.current;
    if (!blob) return;
    stopStream();
    onCapture(new File([blob], "camera-photo.jpg", { type: "image/jpeg" }));
  };

  const flip = () => start(facing === "user" ? "environment" : "user");

  if (phase === "error") {
    return (
      <div className={className}>
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" strokeWidth={2} />
            <p className="text-amber-800 dark:text-amber-300">{errorMsg}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => start("user")}>
              <RefreshCcw className="h-4 w-4" strokeWidth={1.75} /> Try again
            </Button>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> {cancelLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""} ${
              phase === "captured" ? "invisible" : ""
            }`}
          />
          {phase === "captured" && resultUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resultUrl}
              alt="Captured photo"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Oval face-framing guide — only while composing the shot. */}
          {phase !== "captured" && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 300 400"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <mask id="ccOvalMask">
                  <rect width="300" height="400" fill="white" />
                  <ellipse cx="150" cy="180" rx="95" ry="125" fill="black" />
                </mask>
              </defs>
              <rect width="300" height="400" fill="rgba(0,0,0,0.45)" mask="url(#ccOvalMask)" />
              <ellipse
                cx="150"
                cy="180"
                rx="95"
                ry="125"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          )}

          {phase === "starting" && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
              Starting camera…
            </div>
          )}
        </div>

        {(phase === "live" || phase === "starting") && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="cta" onClick={capture} disabled={phase !== "live"}>
              <Camera className="h-4 w-4" strokeWidth={1.75} /> Capture
            </Button>
            <Button variant="outline" size="sm" onClick={flip}>
              <SwitchCamera className="h-4 w-4" strokeWidth={1.75} /> Flip camera
            </Button>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> {cancelLabel}
              </Button>
            )}
          </div>
        )}

        {phase === "captured" && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="cta" onClick={confirm}>
              <Check className="h-4 w-4" strokeWidth={1.75} /> {confirmLabel}
            </Button>
            <Button variant="outline" size="sm" onClick={retake}>
              <RefreshCcw className="h-4 w-4" strokeWidth={1.75} /> Retake
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Hold the camera at eye level, face a window, and keep a plain wall behind you.
          Captured on your device — nothing is uploaded.
        </p>
      </div>
    </div>
  );
}
