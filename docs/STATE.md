# Site state

Verified 2026-09-13.

## Tend claims

Removed the body paragraph naming SwiftData and promising working iCloud
sync, plus the iCloud clause in the Things comparison. Tend uses CoreData;
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

Generated versions: Trove 1.13.0 (2026-09-05), Relay 0.3.0 and Tend 0.13.1
(both published 2026-09-12 UTC). Sibling mode reads each app's VERSION and
its matching dated changelog heading, including Tend.

Verification: 74 tests pass, TypeScript passes, the hardcoded-value check is
clean, and the production build completes without warnings. Regression tests
cover drafts, missing or wrong assets, Windows tags, app prefixes, prerelease
policy, publication dates and matching changelog headings.

Shipped from main `a9a5499bbd96f193f1acffd71467578ecb365bd3` (PR #1).
Vercel reports the production deployment successful. Fresh Firecrawl requests
with `--max-age 0` verified HTTP 200 on `/relay` and `/tend`, displaying
0.3.0 and 0.13.1 respectively. Their download buttons link to the matching
public release assets: `relay-v0.3.0/Relay.zip` and `tend-v0.13.1/Tend.zip`.
Evidence is saved locally under
`/private/tmp/relay-tend-site-check/.firecrawl/relay-after.json` and
`/private/tmp/relay-tend-site-check/.firecrawl/tend-after.json`.
The existing workflow schedule is unchanged.
