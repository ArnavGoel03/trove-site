import { troveOg } from "@/lib/og";
import { ogAlt } from "@/lib/brand";
import { TOOL_COUNT } from "@/lib/panes";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("Features");

export default function Image() {
  return troveOg({
    eyebrow: "Features",
    title: `${TOOL_COUNT} tools. One Mac app.`,
    tagline: "Clipboard, capture, system, files, storage, every menubar utility you bought, finally under one roof.",
  });
}
