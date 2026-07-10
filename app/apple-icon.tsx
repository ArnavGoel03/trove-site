import { ImageResponse } from "next/og";
import { ACCENT } from "@/lib/brand-tokens.generated";

// Apple touch icon (180x180) for iOS/iPadOS home-screen bookmarks.
// Same gradient mark as the favicon, padded so it reads well as a
// rounded-rect app tile. Satori (next/og) does not resolve CSS variables,
// so this imports the ACCENT constant instead of using var(--color-accent).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT} 55%, ${ACCENT} 100%)`,
          color: "#fff",
          fontSize: 116,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        T
      </div>
    ),
    { ...size },
  );
}
