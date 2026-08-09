# Trove site rebuild: a scroll-driven buying argument

Date: 2026-08-10
Status: approved, ready for planning
Repo: `~/dev/trove/site` (ArnavGoel03/trove-site, Vercel auto-deploys `main`)

## Goal

Rebuild the entire Trove marketing site around one cinematic, scroll-driven
homepage whose job is to convert a visitor into a buyer. Reference for the
technique is `~/dev/pitcrew`: one scroll number drives a stage timeline, every
visual is a pure function of that number, WebGL draws geometry while DOM draws
anything readable or interactive.

The difference from a showreel: every beat carries an argument. Pain, proof,
price, trust, in that order.

## Positioning

Trove is the epitome of productivity on a Mac: 40+ native tools in one app,
replacing a stack of paid utilities, with nothing leaving the machine.

The site now sells a suite of three apps, not one:

| App | What it is | Site status |
|-----|-----------|-------------|
| Trove | 40+ tool Mac utility app, v1.12.8 | live, downloadable today |
| Relay | Local-first API client, v0.1.0 | presented as live, download gated on published release |
| Tend | Local-first tasks and calendar, v0.11.0 | presented as live, download gated on published release |

One licence unlocks all three (`license_core.swift` is already shared across
the three Swift targets).

### Download-button contract

This spec covers the site only. Publishing the Relay and Tend binaries is out
of scope and stays a manual decision. Therefore each app's primary CTA reads
the real GitHub releases feed for that app:

- Release with a downloadable asset exists: button downloads it.
- No release yet: the same button degrades to "Get notified" without a dead
  link and without claiming a download exists.

When the binaries are published the site needs no edit. No page may hardcode a
download URL; all of them go through the release lookup.

## Pricing (new single source of truth)

- $39 per year, or $4.99 per month.
- 14-day free trial, no account required to trial.
- One subscription unlocks Trove, Relay and Tend.

Rationale: the rival stack is genuinely ~$441/yr, Setapp is $120/yr. $39
undercuts every comparison while leaving room to raise the suite to $79/yr once
notarization lands and all three apps are shipping, with existing subscribers
grandfathered. It is deliberately low because today's friction is real:
signed-but-not-notarized first launch, Apple Silicon only.

Lives in `lib/pricing.ts`. A price literal appearing anywhere else is a build
failure via the existing `scripts/check-hardcoded.mjs` gate.

## The homepage: nine stages, one scroll

Stage boundaries are weights in `lib/timeline.ts`, never absolutes, so
inserting a stage cannot silently desync the copy of the ones after it.

| # | Stage | Camera / scene | Argument |
|---|-------|----------------|----------|
| 00 | Desk | Dark stage, one Mac, slow drift. Headline and primary CTA. | "One app instead of a dozen." |
| 01 | Sprawl | Camera pulls back to reveal twelve rival windows suspended in depth, each labelled with its real name and real price. A running total counts up to the stack cost. | This is what you pay now. |
| 02 | Collapse | Scroll draws the windows inward; they compress, fold and assemble into a single Trove window. | The money shot. |
| 03 | Clipboard | Camera pushes into the window until it fills the frame. Hub swaps to Clipboard. | It remembers everything you copy. |
| 04 | Text and data | Hub swaps. Live JSON formatter, regex tester, SHA-256 via Web Crypto, case tools. | Real work, running in your browser right now. |
| 05 | Capture | Hub swaps. Live colour picker off a canvas, QR, image tools. | The screenshot and OCR half. |
| 06 | System and storage | Hub swaps. Live treemap, monitors. | The maintenance half. |
| 07 | Receipt | Windows return as a ledger. Stack total versus $39/yr, savings called out, three apps not one. | Buy. |
| 08 | Trust | Quiet close. No account, no cloud, no telemetry, native, sub-500ms cold launch, honest first-launch caveat. | Safe to buy. |

### Proof stages must be genuinely live

Stages 03 to 06 are interactive, not video. The visitor types into a real
regex tester and a real hash function and sees real output. Anything that
cannot honestly be computed in a browser (system temperatures, disk contents)
is rendered from clearly marked sample data. No faked computation.

## Architecture

### The scroll contract

`lib/timeline.ts` is the only place stage boundaries exist. Every visual is a
pure function of `stageAt(progress)` and the clock. No springs, no
accumulators, no ping-pong buffers: a scrubbed timeline is random access, so
anything stateful desyncs permanently the first time someone scrolls back up.
A test sweeps forward and in reverse and asserts equality.

### Rendering split

WebGL owns geometry and camera. DOM owns every glyph and every input, anchored
to projected 3D points (the `anchors.ts` pattern from pitcrew). Text stays
crisp and selectable, demos stay real inputs, and the canvas never renders a
font.

### Cost discipline

three.js is never on the critical path: poster paints first, the renderer
arrives via dynamic import, and a build gate fails if it leaks into the route
graph. Three fallback paths, all of which still sell the same nine beats as
stacked static sections:

1. No WebGL context.
2. `prefers-reduced-motion: reduce`.
3. Coarse pointer / low-capability device.

### Single sources of truth

| File | Owns |
|------|------|
| `lib/pricing.ts` | every price, the trial length, the savings math |
| `lib/rivals.ts` | the twelve rival apps, each price with a source URL and a date-checked stamp |
| `lib/timeline.ts` | stage identities, weights, holds, easings |
| `lib/brand.ts` | app names, taglines, studio, platform, signing facts |
| `lib/panes.ts` | the 40+ tools, already mirrors the Swift enum |
| CSS custom properties in `globals.css` | colour, spacing, type scale, radius |

Derive, never duplicate. A value that appears in two files is a defect.

## Full-site rebuild

Every route is rebuilt on a new shared shell. Legal text is restyled, not
rewritten.

Phase 1, foundation
: design tokens, self-hosted variable font pair, Nav, Footer, PageShell,
  `lib/pricing.ts`, `lib/rivals.ts` with verified prices, release-lookup helper.

Phase 2, homepage
: timeline, scene, nine stages, live demos, all three fallback paths.

Phase 3, conversion surfaces
: download, pricing and FAQ, features, the ~40 `pane/[slug]` pages,
  `compare/[slug]`, plus the Relay and Tend product pages as full members of
  the suite.

Phase 4, long tail
: changelog, updates, guides, press, brand, roadmap, security, shortcuts,
  themes, url-scheme, accessibility, acceptable-use, eula, privacy, refund,
  terms, contact, action.

Phase 5, verification and ship
: lint, tests, production build, rendered-output screenshots at 1600x900 and
  393x852, Lighthouse pass, then push. Commits batched so the Vercel daily
  deploy cap is not burned.

## Honesty constraints

1. No invented metrics, customer counts, testimonials or logo walls. The only
   numbers on the site are Trove's own facts and rival prices with citations.
2. Every rival price carries a source URL and the date it was checked.
3. The signed-but-not-notarized first-launch caveat and the Apple Silicon-only
   requirement stay visible on the download path. A buyer who hits the
   Gatekeeper dialog unwarned refunds.
4. Relay and Tend are never described as downloadable until the release lookup
   says an asset exists.

## Verification

- `test/timeline.test.ts`: forward and reverse sweep agree.
- `test/rivals.test.ts`: every rival has a price, a source URL and a checked date.
- `scripts/check-hardcoded.mjs`: extended so a price, a version or a brand
  string outside its source file fails the build.
- Rendered output screenshotted and zoomed at 1600x900 and 393x852 before any
  visual work is called done. A green build has never once caught a figure
  pushed off the right edge.

## Out of scope

- Building, signing or publishing the Relay and Tend binaries.
- The macOS, Windows, and Tend app source trees.
- Changing the licensing enforcement in `license_core.swift`.
