import { troveOg } from "@/lib/og";
import { APPS, STUDIO } from "@/lib/brand";

const APP = APPS.relay;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${APP.name}: ${APP.tagline}`;

export default function Image() {
  return troveOg({
    markLabel: STUDIO.name,
    eyebrow: "Coming soon, part of the suite",
    title: APP.name,
    tagline: APP.tagline,
  });
}
