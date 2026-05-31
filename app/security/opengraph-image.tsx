import { troveOg } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trove — Security";

export default function Image() {
  return troveOg({
    eyebrow: "Trust",
    title: "Local-only. No telemetry.",
    tagline: "Frontmost-gated URL scheme. Quarantine-on-corrupt. Responsible disclosure with 48-hour triage.",
  });
}
