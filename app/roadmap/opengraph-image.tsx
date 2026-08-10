import { troveOg } from "@/lib/og";
import { ogAlt } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("Roadmap");

export default function Image() {
  return troveOg({
    eyebrow: "What's next",
    title: "Roadmap, in the open.",
    tagline: "Signed + notarized channel, Awake auto-disable, Library smart playlists, global Themes panel.",
  });
}
