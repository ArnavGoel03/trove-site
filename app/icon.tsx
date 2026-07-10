import { ImageResponse } from "next/og";
import { ACCENT } from "@/lib/brand-tokens.generated";

// Favicon. The branded gradient "T" rendered at 32px so browser tabs,
// bookmarks and the address bar get an on-brand mark instead of the
// default globe. Next emits the <link rel="icon"> automatically. Satori
// (next/og) does not resolve CSS variables, so this imports the ACCENT
// constant instead of using var(--color-accent).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT} 55%, ${ACCENT} 100%)`,
          color: "#fff",
          fontSize: 22,
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
