import { troveOg } from "@/lib/og";
import { formatUSD, PRICING, TRIAL_LABEL } from "@/lib/pricing";
import { APPS, ogAlt } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("Pricing");

export default function Image() {
  return troveOg({
    eyebrow: "Pricing",
    title: `${formatUSD(PRICING.yearly)} a year. Every app.`,
    tagline:
      `${TRIAL_LABEL}, then ${formatUSD(PRICING.yearly)} a year or ` +
      `${formatUSD(PRICING.monthly)} a month. One key unlocks ${APPS.trove.name}, ` +
      `${APPS.relay.name} and ${APPS.tend.name}.`,
  });
}
