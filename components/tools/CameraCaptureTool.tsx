"use client";

import * as React from "react";
import {
  Camera,
  Download,
  Share2,
  RefreshCcw,
  SwitchCamera,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadBlob, shareFile } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

type Facing = "user" | "environment";
type Phase = "idle" | "starting" | "live" | "captured" | "error";

export function CameraCaptureTool() {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [facing, setFacing] = React.useState<Facing>("user");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const resultBlobRef = React.useRef<Blob | null>(null);
  const resultUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "camera-capture" });
  }, []);

  const stopStream = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Release the camera + any object URL when leaving the tool.
  React.useEffect(() => {
    return () => {
      stopStream();
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, [stopStream]);

  const start = React.useCallback(
    async (mode: Facing) => {
      setErrorMsg(null);
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
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
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setFacing(mode);
        setPhase("live");
        track({ name: "tool_start", tool: "camera-capture", device: deviceClass() });
      } catch (err) {
        const name = err instanceof Error ? err.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          setErrorMsg(
            "Camera permission was blocked. Allow camera access in your browser's site settings, then try again."
          );
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setErrorMsg(
            "No camera was found. Connect a webcam or use a device with a camera."
          );
        } else {
          setErrorMsg("Could not start the camera. Close other apps using it and try again.");
        }
        setPhase("error");
        track({
          name: "tool_failure",
          tool: "camera-capture",
          device: deviceClass(),
          reason: name || "getusermedia-error",
        });
      }
    },
    [stopStream]
  );

  const capture = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Draw the true (un-mirrored) frame — the preview is mirrored only for a
    // natural selfie feel; the saved photo must keep real left/right.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        resultBlobRef.current = blob;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        const url = URL.createObjectURL(blob);
        resultUrlRef.current = url;
        setResultUrl(url);
        setPhase("captured");
        // Keep the stream alive so "Retake" is instant.
        track({ name: "tool_success", tool: "camera-capture", device: deviceClass() });
      },
      "image/jpeg",
      0.92
    );
  }, []);

  const retake = () => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setResultUrl(null);
    // Stream is still running; just return to live view.
    setPhase(streamRef.current ? "live" : "idle");
    if (!streamRef.current) start(facing);
  };

  const switchCamera = () => start(facing === "user" ? "environment" : "user");

  const handleDownload = () => {
    if (!resultBlobRef.current) return;
    downloadBlob(resultBlobRef.current, "camera-photo.jpg");
    track({ name: "download", tool: "camera-capture", format: "jpg" });
  };

  const handleShare = async () => {
    if (!resultBlobRef.current) return;
    await shareFile(resultBlobRef.current, "camera-photo.jpg", "Camera photo");
  };

  return (
    <div className="space-y-5">
      {phase === "idle" && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-hairline-strong bg-accent/20 p-10 text-center">
          <Camera className="h-8 w-8 text-brand" strokeWidth={1.5} />
          <p className="text-base font-medium text-foreground">
            Take a photo with your camera
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Line your face up inside the oval guide. The photo is captured on your
            device — nothing is uploaded.
          </p>
          <Button variant="cta" onClick={() => start("user")}>
            <Camera className="h-4 w-4" strokeWidth={1.75} /> Start camera
          </Button>
        </div>
      )}

      {phase === "error" && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
            <AlertCircle
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
              strokeWidth={2}
            />
            <p className="text-amber-800 dark:text-amber-300">{errorMsg}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => start("user")}>
            <RefreshCcw className="h-4 w-4" strokeWidth={1.75} /> Try again
          </Button>
        </div>
      )}

      {/* Live preview + captured result share the frame; the <video> stays
          mounted across phases so the stream isn't torn down on capture. */}
      <div
        className={
          phase === "live" || phase === "starting" || phase === "captured"
            ? "space-y-4"
            : "hidden"
        }
      >
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`h-full w-full object-cover ${
              facing === "user" ? "-scale-x-100" : ""
            } ${phase === "captured" ? "invisible" : ""}`}
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
                <mask id="ovalMask">
                  <rect width="300" height="400" fill="white" />
                  <ellipse cx="150" cy="180" rx="95" ry="125" fill="black" />
                </mask>
              </defs>
              <rect
                width="300"
                height="400"
                fill="rgba(0,0,0,0.45)"
                mask="url(#ovalMask)"
              />
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
            <Button variant="outline" size="sm" onClick={switchCamera}>
              <SwitchCamera className="h-4 w-4" strokeWidth={1.75} /> Flip camera
            </Button>
          </div>
        )}

        {phase === "captured" && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="cta" size="sm" onClick={handleDownload}>
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
        )}

        <p className="text-center text-xs text-muted-foreground">
          Tip: hold the camera at eye level, face a window, and keep a plain wall
          behind you. Then crop to your exam&apos;s size with the{" "}
          <a href="/tools/resize-kb/" className="underline underline-offset-2">
            resize tools
          </a>
          .
        </p>
      </div>
    </div>
  );
}
