import { troveOg } from "@/lib/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trove — Roadmap";

export default function Image() {
  return troveOg({
    eyebrow: "What's next",
    title: "Roadmap, in the open.",
    tagline: "Signed + notarized channel, Awake auto-disable, Library smart playlists, global Themes panel.",
  });
}
