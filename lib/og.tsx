/**
 * Per-page Open Graph image template.
 * -----------------------------------
 * One branded 1200×630 card generator shared by every `opengraph-image.tsx`.
 * With `output: "export"` these render to static PNGs at build time, so each
 * key page gets a bespoke social/SERP card (title + subtitle) instead of the
 * single generic /og.png — better link CTR on Google, X, WhatsApp, Slack, etc.
 *
 * Keep the markup satori-safe: any element with >1 child needs `display:flex`.
 */
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const BRAND_BLUE = "#2563EB";
const BRAND_ORANGE = "#F57819";

export interface OgInput {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function ogImage({
  title,
  subtitle,
  badge = "Free · Private · 100% in your browser",
}: OgInput) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #ffffff 0%, #eef4ff 55%, #fff1e8 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 48, fontWeight: 800 }}>
          <span style={{ color: BRAND_ORANGE }}>easy</span>
          <span style={{ color: BRAND_BLUE }}>Photo</span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 24,
                fontSize: 34,
                color: "#475569",
                lineHeight: 1.3,
                maxWidth: 1000,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: BRAND_BLUE,
              color: "white",
              fontSize: 28,
              fontWeight: 600,
              padding: "14px 30px",
              borderRadius: 9999,
            }}
          >
            {badge}
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#64748b" }}>
            easyphoto.in
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
