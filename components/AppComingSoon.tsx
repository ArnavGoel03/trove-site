import { APPS, SUITE, TROVE } from "@/lib/brand";

// Reusable product page body for a not-yet-released suite app. Driven entirely
// by lib/brand.ts, so /relay and /tend stay in sync with the Suite listing and
// a rename touches one place.
export default function AppComingSoon({
  appKey,
}: {
  appKey: "relay" | "tend";
}) {
  const app = APPS[appKey];
  return (
    <div className="space-y-6 text-[15px] text-[var(--color-fg-dim)] leading-relaxed">
      <p className="text-[17px] text-[var(--color-accent)]">{app.tagline}</p>
      <p>{app.blurb}</p>
      <p>
        {app.name} is part of the suite: one subscription unlocks it alongside{" "}
        {TROVE.name} and everything else, on every Mac you own. {SUITE.trial}, no
        account, and like every app here, nothing you do ever leaves your Mac.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href="/#suite"
          className="inline-flex items-center gap-1 rounded-full bg-white text-black font-medium px-5 py-2.5 text-[14px] transition-transform hover:-translate-y-0.5"
        >
          See the full suite &rarr;
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-white/15 font-medium px-5 py-2.5 text-[14px] transition-colors hover:border-white/30"
        >
          Try {TROVE.name} now
        </a>
      </div>
    </div>
  );
}
