import Link from "next/link";

import { PLATFORM, PRODUCT, SIGNING, TROVE } from "@/lib/brand";
import { formatUSD, PRICING, TRIAL_LABEL, YEARLY_SAVING } from "@/lib/pricing";
import DownloadButton from "./DownloadButton";

/**
 * The ask.
 *
 * Everything the reader needs to decide is on this screen, including the parts
 * that are inconvenient: Apple Silicon only, and a first launch that needs a
 * right-click. Burying either would win a download and lose the person twenty
 * seconds later at a Gatekeeper dialog that only offers to delete the app, and
 * that is a worse outcome than not being downloaded.
 */
export default function Close() {
  return (
    <section
      className="border-t border-line-soft px-5 py-24 sm:px-8"
      aria-labelledby="close-title"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h2
          id="close-title"
          className="text-display font-display font-semibold text-fg text-balance"
        >
          Try it for {PRICING.trialDays} days. Nothing to cancel.
        </h2>
        <p className="mt-5 max-w-xl text-lead text-fg-dim text-pretty">
          The trial is the whole app, {PRODUCT.toolCount} tools, no account and no card. When it
          ends, {TROVE.name} is {formatUSD(PRICING.yearly)} a year or {formatUSD(PRICING.monthly)} a
          month, and the yearly is {formatUSD(YEARLY_SAVING)} cheaper.
        </p>

        <div className="mt-9">
          <DownloadButton size="lg" />
        </div>

        <p className="mt-5 text-caption text-fg-mute">
          {TRIAL_LABEL} · {PLATFORM.minMacOS} · {PLATFORM.archDetail}
        </p>
        <p className="mt-2 max-w-lg text-micro text-fg-mute text-pretty">
          {SIGNING.short}. {SIGNING.firstLaunch}
        </p>

        <p className="mt-8 text-caption text-fg-dim">
          <Link href="/pricing" className="underline decoration-line-strong underline-offset-4 hover:text-accent">
            Full pricing
          </Link>
          <span aria-hidden="true" className="px-2 text-fg-mute">
            ·
          </span>
          <Link href="/features" className="underline decoration-line-strong underline-offset-4 hover:text-accent">
            Every tool
          </Link>
          <span aria-hidden="true" className="px-2 text-fg-mute">
            ·
          </span>
          <Link href="/security" className="underline decoration-line-strong underline-offset-4 hover:text-accent">
            How the licence works
          </Link>
        </p>
      </div>
    </section>
  );
}
