import { troveOg } from "@/lib/og";
import { ogAlt } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("Guides");

export default function Image() {
  return troveOg({
    eyebrow: "Guides",
    title: "Hands-on walkthroughs.",
    tagline: "Tutorials for every workflow Trove makes faster: recording, OCR, hashing, snippets, automation chains.",
  });
}
