import { troveOg } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trove: Features";

export default function Image() {
  return troveOg({
    eyebrow: "Features",
    title: "53 panes. One Mac app.",
    tagline: "Clipboard, capture, system, files, storage, every menubar utility you bought, finally under one roof.",
  });
}
