import { troveOg } from "@/lib/og";
import { ogAlt } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("Security");

export default function Image() {
  return troveOg({
    eyebrow: "Trust",
    title: "Local-only. No telemetry.",
    tagline: "Frontmost-gated URL scheme. Quarantine-on-corrupt. Responsible disclosure with 48-hour triage.",
  });
}
