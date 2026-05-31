import { troveOg } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trove — Press kit";

export default function Image() {
  return troveOg({
    eyebrow: "Press",
    title: "The Trove press kit.",
    tagline: "Pitch lines, key facts, brand assets, and the canonical repo. Everything press needs without the email chain.",
  });
}
