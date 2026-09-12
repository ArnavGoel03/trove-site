# Site state

Verified 2026-09-13.

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

Deployment verification is pending the release-sync change landing on main.
The existing workflow schedule is unchanged.
