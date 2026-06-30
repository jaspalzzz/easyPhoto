"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setWorkflowPayload } from "@/lib/workflowHandoff";

/**
 * Carry a blob to another tool with NO re-upload, then navigate there. The
 * receiving tool (any ImageToolShell-based tool, or the PDF tools that consume
 * the payload) auto-loads it on mount.
 *
 * This is the lightweight primitive behind inline "fix this" actions — verdict
 * tools route a failed check straight to the tool that resolves it, handing
 * over the exact file the user just checked. `href` is a full route, e.g.
 * "/tools/resize-kb/".
 */
export function useWorkflowHandoff() {
  const router = useRouter();
  return React.useCallback(
    (blob: Blob, filename: string, href: string) => {
      setWorkflowPayload(blob, filename);
      router.push(href);
    },
    [router]
  );
}
