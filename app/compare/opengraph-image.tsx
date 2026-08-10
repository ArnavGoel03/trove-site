import { troveOg } from "@/lib/og";
import { ogAlt } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("Compare");

export default function Image() {
  return troveOg({
    eyebrow: "Compare",
    title: "Replaces a dozen menubar apps.",
    tagline: "Raycast Pro + iStat + CleanMyMac + Bartender + TextSniper, in one ~14 MB native app at with a free trial.",
  });
}
