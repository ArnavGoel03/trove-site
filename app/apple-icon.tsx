import { ImageResponse } from "next/og";

// Apple touch icon (180x180) for iOS/iPadOS home-screen bookmarks.
// Same gradient mark as the favicon, padded so it reads well as a
// rounded-rect app tile.
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
          background:
            "linear-gradient(135deg, #ff8b5a 0%, #ff6a2a 55%, #b27cff 100%)",
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
