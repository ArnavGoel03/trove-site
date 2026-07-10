/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { STUDIO, TROVE } from "@/lib/brand";

// Shared OG card factory. Each route's opengraph-image.tsx imports
// `troveOg` and passes a title + (optional) eyebrow + (optional) tagline.
// We render a 1200x630 PNG with a wordmark, an accent gradient, and the
// route-specific copy, same dark surface, same typography. The wordmark
// defaults to Trove (the flagship) but any suite page can pass `markLabel`
// (e.g. the studio name) to show a different mark in that small top row.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_RUNTIME = "edge" as const;

export type OgInput = {
  title: string;
  eyebrow?: string;
  tagline?: string;
  /** Wordmark shown in the small top row. Defaults to the Trove name. */
  markLabel?: string;
};

export function troveOg({
  title,
  eyebrow,
  tagline,
  markLabel,
}: OgInput): ImageResponse {
  const mark = markLabel ?? TROVE.name;
  const host = STUDIO.domain.replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background: "#08080b",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Gradient backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(55% 55% at 18% 22%, rgba(255,122,69,0.22) 0%, transparent 60%), radial-gradient(45% 55% at 88% 78%, rgba(178,124,255,0.18) 0%, transparent 60%)",
          }}
        />
        {/* Top row: wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #ff8b5a, #ff6a2a, #b27cff)",
              boxShadow: "0 8px 24px -8px rgba(255,122,69,0.55)",
            }}
          >
            <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>
              {mark[0]}
            </span>
          </div>
          <span
            style={{
              color: "white",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {mark}
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            zIndex: 2,
          }}
        >
          {eyebrow ? (
            <div
              style={{
                color: "#ff7a45",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 36 ? 76 : 92,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          {tagline ? (
            <div
              style={{
                marginTop: 24,
                fontSize: 26,
                color: "#a1a1aa",
                letterSpacing: "-0.005em",
                lineHeight: 1.4,
                maxWidth: 980,
              }}
            >
              {tagline}
            </div>
          ) : null}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 56,
            height: 3,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, #ff8b5a, #ff6a2a 40%, #b27cff 100%)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 24,
            display: "flex",
            justifyContent: "space-between",
            color: "#71717a",
            fontSize: 18,
            zIndex: 2,
          }}
        >
          <span>{host}</span>
          <span>Local-only, no telemetry</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
