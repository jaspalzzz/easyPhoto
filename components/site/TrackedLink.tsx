"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { track, type HomepagePath } from "@/lib/analytics";

type TrackedLinkEvent =
  | { name: "path_select"; path: HomepagePath }
  | { name: "related_tool_click"; from: string; to: string };

export function TrackedLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: TrackedLinkEvent;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} onClick={() => track(event)} className={className}>
      {children}
    </Link>
  );
}
