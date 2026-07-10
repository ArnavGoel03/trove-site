import { ImageResponse } from "next/og";

export const alt = "Trove: one app instead of a dozen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080b",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Subtle gradient accents */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(60% 60% at 30% 40%, rgba(225,6,0,0.18) 0%, transparent 60%), radial-gradient(50% 50% at 75% 65%, rgba(225,6,0,0.16) 0%, transparent 60%)",
          }}
        />
        {/* App icon placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #E10600, #E10600, #E10600)",
            marginBottom: 28,
          }}
        >
          <span style={{ color: "white", fontSize: 40, fontWeight: 700 }}>
            T
          </span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          Trove
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            letterSpacing: "-0.01em",
          }}
        >
          One app instead of a dozen.
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            color: "#71717a",
          }}
        >
          40+ tools · Local-first · No account · No telemetry
        </div>
      </div>
    ),
    { ...size },
  );
}
