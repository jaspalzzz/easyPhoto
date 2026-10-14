"use client";

import * as React from "react";
import { Loader2, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ToolSource } from "./ImageToolShell";
import {
  estimateHeadBox,
  headCoverage,
  headInCrop,
  headIsCut,
  planCloserCrop,
  type Box,
  type CropRect,
} from "@/lib/faceCoverage";

/**
 * Measures how much of the photo the head fills against a published minimum
 * (UPSC: 75%) and offers a closer crop the person sees and can undo. Runs the
 * face detector the site already uses, loaded only when a photo is chosen; if
 * it can't run, the photo tool keeps working without the check.
 */

type Check =
  | { state: "checking" }
  | { state: "measured"; head: Box; coverage: number; cut: boolean; faces: number }
  | { state: "noFace" }
  | { state: "unavailable" };

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function FaceCoverageCheck({
  source,
  min,
  authority,
  crop,
  onCropChange,
}: {
  source: ToolSource;
  /** Published minimum share of the photo the head must fill (0–1). */
  min: number;
  /** Who sets the rule, for the message ("UPSC"). */
  authority: string;
  crop: CropRect | null;
  onCropChange: (crop: CropRect | null) => void;
}) {
  const [check, setCheck] = React.useState<Check>({ state: "checking" });

  React.useEffect(() => {
    let cancelled = false;
    setCheck({ state: "checking" });
    (async () => {
      try {
        const { detectFace, NoFaceError } = await import("@/lib/faceDetection");
        try {
          const face = await detectFace(source.image, source.size);
          if (cancelled) return;
          const head = estimateHeadBox({ xSpan: face.faceXSpan, ySpan: face.faceYSpan });
          setCheck({
            state: "measured",
            head,
            coverage: headCoverage(head, source.size.width, source.size.height),
            cut: headIsCut(head, source.size.width),
            faces: face.faceCount,
          });
        } catch (err) {
          if (!cancelled) setCheck(err instanceof NoFaceError ? { state: "noFace" } : { state: "unavailable" });
        }
      } catch {
        if (!cancelled) setCheck({ state: "unavailable" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  const box = "rounded-lg border border-hairline bg-card p-4 text-sm leading-relaxed";

  if (check.state === "checking") {
    return (
      <div className={`${box} flex items-center gap-2 text-muted-foreground`} role="status">
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
        Checking how much of the photo your face fills…
      </div>
    );
  }
  if (check.state === "unavailable") {
    return (
      <p className={`${box} text-muted-foreground`} role="status">
        We couldn&apos;t check the face size on this device. You can still resize the photo; make sure
        your face fills most of it, with both ears showing.
      </p>
    );
  }
  if (check.state === "noFace") {
    return (
      <p className={`${box} text-ink`} role="status">
        We couldn&apos;t find a face in this photo, and {authority}&apos;s form refuses photos where it
        can&apos;t detect one. Use a front-facing photo with both ears showing and no dark glasses.
      </p>
    );
  }

  const { head, coverage, cut, faces } = check;
  const plan = crop ? null : planCloserCrop(head, source.size.width, source.size.height);
  const afterCrop = crop ? headCoverage(headInCrop(head, crop), crop.width, crop.height) : null;
  const shown = afterCrop ?? coverage;
  const meets = shown >= min;

  return (
    <div className={`${box} space-y-2`} role="status">
      <p className="flex items-start gap-2 text-ink">
        <ScanFace className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
        <span>
          {crop ? "Cropped closer: your face now fills about " : "Your face fills about "}
          <strong className="font-semibold">{pct(shown)}</strong> of the photo.{" "}
          {authority} asks for {pct(min)} or more.
        </span>
      </p>
      {faces > 1 && (
        <p className="text-muted-foreground">
          More than one face is in the photo. Use a photo of just you.
        </p>
      )}
      {cut && !crop && (
        <p className="text-muted-foreground">
          Your head looks cut off at the side of the photo. {authority} refuses photos where the face is
          too close — use one that shows your whole head and both ears.
        </p>
      )}
      {!meets && !cut && plan && (
        <Button variant="outline" size="sm" onClick={() => onCropChange(plan)}>
          Crop closer
        </Button>
      )}
      {!meets && !cut && !plan && !crop && (
        <p className="text-muted-foreground">
          This photo can&apos;t be cropped closer without cutting your head. Take one with the camera
          closer to your face.
        </p>
      )}
      {crop && (
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Check the preview: your whole head, chin and both ears must still show.
          </p>
          <Button variant="ghost" size="sm" onClick={() => onCropChange(null)}>
            Undo crop
          </Button>
        </div>
      )}
    </div>
  );
}
