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

const BRAND_TEAL = "#157F75";
const BRAND_ORANGE = "#F57819";

// The crop-mark logo mark, inline as a data URI (satori renders <img> reliably).
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="none" stroke="${BRAND_TEAL}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17 V8 Q6 6 8 6 H17"/><path d="M47 6 H56 Q58 6 58 8 V17"/><path d="M58 47 V56 Q58 58 56 58 H47"/><path d="M17 58 H8 Q6 58 6 56 V47"/></g><circle cx="32" cy="26" r="8.5" fill="${BRAND_TEAL}"/><path d="M18 49 C18 37 46 37 46 49 Z" fill="${BRAND_ORANGE}"/></svg>`;
const LOGO_SRC = `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`;

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
          background: "#FBFAF7",
          borderTop: `12px solid ${BRAND_TEAL}`,
          padding: "68px 80px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} width={56} height={56} alt="" />
          <div style={{ display: "flex", alignItems: "center", fontSize: 48, fontWeight: 800 }}>
            <span style={{ color: BRAND_ORANGE }}>easy</span>
            <span style={{ color: BRAND_TEAL }}>Photo</span>
          </div>
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
              background: BRAND_TEAL,
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
