import { troveOg } from "@/lib/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trove — Shortcuts";

export default function Image() {
  return troveOg({
    eyebrow: "Shortcuts",
    title: "Scriptable from day one.",
    tagline: "11 macOS Shortcuts intents with rich entity pickers for snippets and clipboard history. Plus the full trove:// URL scheme.",
  });
}
