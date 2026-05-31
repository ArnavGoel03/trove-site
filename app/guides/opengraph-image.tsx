import { troveOg } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trove — Guides";

export default function Image() {
  return troveOg({
    eyebrow: "Guides",
    title: "Hands-on walkthroughs.",
    tagline: "Tutorials for every workflow Trove makes faster — recording, OCR, hashing, snippets, automation chains.",
  });
}
