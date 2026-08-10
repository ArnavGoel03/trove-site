import { troveOg } from "@/lib/og";
import { ogAlt } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("Changelog");

export default function Image() {
  return troveOg({
    eyebrow: "Release notes",
    title: "Every shipped change.",
    tagline: "Live-sourced from macos/CHANGELOG.md on the canonical repo. Stable releases, beta builds, and pre-1.0 history.",
  });
}
