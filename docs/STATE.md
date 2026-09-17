# Site state

## Client work candidate, 2026-09-18

Release buttons and the footer share one in-flight request and successful result.
HTTP, parsing and shape failures clear the request so a later mount can retry.
The scroll driver coalesces input, resize, track geometry and page-restoration
signals into one frame. Idle pages no longer poll track geometry every frame.
Copy, progress arithmetic and fallback presentation are unchanged.

Verified: 77 tests, TypeScript, hardcoded-value gate and production build pass.
A deterministic scheduler fixture reduces 120 idle frames from 120 reads to zero;
100 input events coalesce into one update. Concurrent and later release consumers
make one mocked request; all three failure classes recover on a later call.
These are operation counts, not browser latency or transfer measurements.
The site repository is public, confirmed through GitHub on 2026-09-18. A new
PR/manual hosted Chromium workflow now verifies shared release requests,
failure/retry, idle layout reads, scroll stages and responsive fallbacks against
a production build. Local check passes 77 tests, TypeScript, hardcoded-value
gate and build. Hosted run 35268461464 at 7d56e35 passed all nine stages at
1600x900 and 393x852, release sharing and failure/retry, idle/burst layout work,
resize, page restoration, unmount/remount and reduced-motion/no-WebGL fallbacks.
A newly found download-page defect now also uses the canonical release selector:
newer Relay/Tend, draft, invalid and assetless tags cannot become Trove downloads.
Mac selects stable Trove; Windows retains its prerelease channel. The page and
client tags share one selector and fetch path, with published floors on outage.
Final hosted run [35268926975](https://github.com/ArnavGoel03/trove-site/actions/runs/35268926975)
passes at source `fbe84f53704dc435924aecc616cc36a01829bcdd`: 80 tests,
TypeScript/build, all scroll and release cases, plus download tags/assets at both
widths. The actual-page regression rejects the previous Relay-as-Trove selector.
All nine stage screenshots, both download widths and stacked fallbacks were
inspected. Rendered acceptance is complete; PR6 remains draft pending final review.
Full receipt and limits: [BROWSER-2026-09-18.md](BROWSER-2026-09-18.md). No native app or release
metadata changed. The connected browser list is empty; no local launch retried.
Vercel publication remains under the hosting spending hold. Fresh HTTP read at
2026-09-17 20:14:19 UTC returns 503 `DEPLOYMENT_PAUSED` at
https://quiver.arnavgoel.dev. Earlier successful deployment receipts below are
historical, not current availability.

## Native performance releases, 2026-09-17

Generated metadata now resolves public Relay 0.3.2 and Tend 0.13.3. Trove
correctly remains 1.13.0 because its 1.13.1 candidate is not published. Both
new ZIPs were downloaded anonymously and matched their signed universal builds.
The synchronizer used --from-releases, not sibling candidate VERSION files.
Local check passes 74 tests, TypeScript, hardcoded-value gate and production
build. PR #5 merged as 6f0472780a95ffa2cbaa7cca70527480665c2b6a. Vercel reports
SUCCESS for production; fresh /relay and /tend HTTP reads contain versions
0.3.2/0.13.3 and the matching public ZIP links.


Verified 2026-09-13.

## Tend claims

Removed the body paragraph naming SwiftData and promising working iCloud
sync, plus the iCloud clause in the Things comparison. Tend uses SwiftData (the prior CoreData wording in this document was incorrect);
CloudKit remains blocked on the required Apple capability. Existing copy
was removed without replacing it with new marketing claims.
`pnpm check` passes all 74 tests and the production build; generated Tend
HTML omits both sync claims and retains the joined comparison sentence.

## Release metadata

`scripts/sync-suite.mjs --from-releases` now refreshes Trove, Relay and Tend
from their published, downloadable releases. It shares the runtime resolver
and generated app contract, requires the matching ZIP, skips drafts and
Windows builds, and keeps Trove on stable releases. Relay and Tend retain
their required GitHub prerelease classification.

Generated versions: Trove 1.13.0 (2026-09-05), Relay 0.3.1 and Tend 0.13.2
(both published 2026-09-13 UTC). Sibling mode reads each app's VERSION and
its matching dated changelog heading, including Tend.

Verification: 74 tests pass, TypeScript passes, the hardcoded-value check is
clean, and the production build completes without warnings. Regression tests
cover drafts, missing or wrong assets, Windows tags, app prefixes, prerelease
policy, publication dates and matching changelog headings.

The public-release workflow synchronized Relay and Tend in commits `5f4882e`
and `f883e471e09a25a0996a6b5a724ad6db89228db2`. A fresh local
`node --experimental-strip-types scripts/sync-suite.mjs --from-releases`
resolved exactly the same generated metadata. `pnpm check` then passed all
74 tests, TypeScript, hardcoded-value checks and the production build without
warnings. Local evidence: `.vercel/site-check-2026-09-13.log`.

Vercel reports production deployment `dpl_FJS6NQsNf3dT1dngNWcSiLBWthAG`
READY; GitHub records a successful Vercel status on `f883e471` pointing to
that same deployment. Fresh Firecrawl requests with `--max-age 0` verified
HTTP 200 on `/relay` and `/tend`, displaying 0.3.1 and 0.13.2 respectively.
Their download buttons link to the matching public release assets:
`relay-v0.3.1/Relay.zip` and `tend-v0.13.2/Tend.zip`.

Evidence is saved locally under `.vercel/.firecrawl/relay-0.3.1.json` and
`.vercel/.firecrawl/tend-0.13.2.json`; deployment inspection is in
`.vercel/deployment-2026-09-13.json`. The existing workflow schedule is
unchanged. The earlier sync implementation shipped in PR #1, commit
`a9a5499bbd96f193f1acffd71467578ecb365bd3`.
