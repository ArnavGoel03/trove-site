# Site state

## Native performance releases, 2026-09-17

Generated metadata now resolves public Relay 0.3.2 and Tend 0.13.3. Trove
correctly remains 1.13.0 because its 1.13.1 candidate is not published. Both
new ZIPs were downloaded anonymously and matched their signed universal builds.
The synchronizer used --from-releases, not sibling candidate VERSION files.
Local check passes 74 tests, TypeScript, hardcoded-value gate and production
build. Production deployment verification follows the merged commit.


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
