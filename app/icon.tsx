import { ImageResponse } from "next/og";

// Favicon. The branded gradient "T" rendered at 32px so browser tabs,
// bookmarks and the address bar get an on-brand mark instead of the
// default globe. Next emits the <link rel="icon"> automatically.
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
          background:
            "linear-gradient(135deg, #E10600 0%, #E10600 55%, #E10600 100%)",
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
