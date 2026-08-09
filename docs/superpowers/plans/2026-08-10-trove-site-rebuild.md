# Trove Site Rebuild Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Work the phases in order; inside a phase, tasks are independent unless an Interfaces block says otherwise.

**Goal:** Rebuild every route of the Trove marketing site around one cinematic, scroll-driven homepage that argues a visitor into buying the $39/yr three-app suite.

**Architecture:** One scroll number drives a weight-derived stage timeline (`lib/timeline.ts`). Every visual is a pure function of `stageAt(progress)` and the clock, so scrubbing backwards lands exactly where scrubbing forwards did. WebGL (react-three-fiber) owns geometry and camera; DOM owns every glyph and every input, positioned by projecting 3D anchor points to screen space. three.js is dynamically imported behind a poster so it never touches first paint.

**Tech Stack:** Next 16 (App Router, RSC), React 19, Tailwind 4, motion 12, react-three-fiber 9 + three 0.185, lenis, TypeScript 5.7, pnpm.

## Global Constraints

- No em dashes or en dashes anywhere, including comments and commit messages.
- No invented metrics, testimonials, customer counts or logo walls. Rival prices carry a source URL and a checked date.
- Single source of truth: a price, version, brand string or stage boundary that appears in two files is a defect. `scripts/check-hardcoded.mjs` enforces it and runs in `prebuild`.
- Pricing: $39/yr, $4.99/mo, 14-day free trial, one licence unlocks Trove + Relay + Tend.
- Platform facts stay honest: Apple Silicon only, signed but not notarized, first launch needs right-click Open.
- Relay and Tend are presented as suite members, but no page may claim a download exists until the release lookup finds an asset.
- Every visual is a pure function of `(stageAt(progress), clock)`. No springs, no accumulators, no ping-pong buffers.
- three.js must never enter the initial route chunk.
- Verify rendered output by screenshot at 1600x900 and 393x852 before calling any visual task done.

---

## File Structure

**New foundation**
- `lib/pricing.ts` - every price, trial length, savings math. Sole owner of currency values.
- `lib/rivals.ts` - the twelve replaced apps, each with price, cadence, source URL, checked date.
- `lib/timeline.ts` - stage identities, weights, holds, easings, `stageAt`, `progressForStage`.
- `lib/release.ts` - per-app GitHub release lookup returning `{ state: "ready", url, version } | { state: "pending" }`.
- `lib/tokens.ts` - TS mirror of the CSS custom properties, generated, never hand-edited.

**Scene (client only, dynamically imported)**
- `scene/Scene.tsx` - Canvas root, camera director, stage dispatch.
- `scene/rig.ts` - camera poses per stage, damping, fov fitting.
- `scene/drive.ts` - pure `(progress) -> scene drive values`.
- `scene/Sprawl.tsx` - the twelve rival windows, instanced, with canvas-texture labels.
- `scene/Window.tsx` - the Trove window geometry that they collapse into.
- `scene/anchors.ts` - 3D point registry projected to screen space for DOM overlays.
- `scene/quality.ts` - capability detection and tier selection.

**Homepage composition**
- `components/stage/Track.tsx` - the scroll track, stage math, mounts Scene or fallback.
- `components/stage/Poster.tsx` - first-paint static frame, replaced when GL is live.
- `components/stage/Copy.tsx` - the per-stage headline and body, DOM, anchored.
- `components/stage/Receipt.tsx` - the ledger and savings math.
- `components/demos/*.tsx` - one file per live demo (Json, Regex, Hash, Color, Units, Treemap).
- `components/stage/Fallback.tsx` - the same nine beats as stacked static sections.

**Shell (used by every route)**
- `components/shell/Nav.tsx`, `components/shell/Footer.tsx`, `components/shell/PageShell.tsx`.

**Tests**
- `test/timeline.test.ts`, `test/rivals.test.ts`, `test/pricing.test.ts`, `test/budget.test.ts`.

---

## Phase 1: Foundation

### Task 1: Pricing as a single source of truth

**Files:** Create `lib/pricing.ts`, `test/pricing.test.ts`. Modify `lib/brand.ts` (delete `PRODUCT.pricing`, `priceAdjective`, `priceLabel`, re-export from pricing).

**Produces:** `PRICING.yearly` (3900 minor units), `PRICING.monthly` (499), `PRICING.trialDays` (14), `formatUSD(minor: number): string`, `savingsVs(stackMinorPerYear: number): number`.

- [ ] Write `test/pricing.test.ts`: `formatUSD(3900) === "$39"`, `formatUSD(499) === "$4.99"`, `savingsVs(44100) === 40200`.
- [ ] Run `pnpm test`, expect failure.
- [ ] Implement `lib/pricing.ts`. All money is integer minor units; formatting drops `.00`.
- [ ] Run `pnpm test`, expect pass.
- [ ] Extend `scripts/check-hardcoded.mjs` with a rule: `/\$\d/` outside `lib/pricing.ts` and content/legal fails.
- [ ] Commit.

### Task 2: Rival pricing data, verified

**Files:** Create `lib/rivals.ts`, `test/rivals.test.ts`.

**Produces:** `RIVALS: readonly Rival[]` where `Rival = { name, replaces: PaneKey[], priceMinor: number, cadence: "year" | "once", source: string, checked: string }`, plus `stackTotalMinorPerYear()`.

- [ ] Verify each rival's current price against its own pricing page before writing it. One-time prices are amortized nowhere; they are shown as "once" and excluded from the per-year total, which is stated on the page.
- [ ] Write `test/rivals.test.ts`: every rival has a non-empty `source` starting `https://`, a `checked` date parseable and within 180 days, a positive `priceMinor`, and at least one `replaces` key that exists in `lib/panes.ts`.
- [ ] Run `pnpm test`, expect failure.
- [ ] Write `lib/rivals.ts` with the verified data.
- [ ] Run `pnpm test`, expect pass. Commit.

### Task 3: Release lookup

**Files:** Create `lib/release.ts`, modify `components/DownloadButton.tsx`.

**Produces:** `releaseFor(app: "trove" | "relay" | "tend"): Promise<ReleaseState>` where `ReleaseState = { state: "ready", url: string, version: string, bytes: number } | { state: "pending" }`.

- [ ] Implement against the public `trove-releases` API, filtering assets by app prefix. Cache with `next: { revalidate: 3600 }`.
- [ ] `state: "pending"` when no matching asset. The button then renders "Get notified" pointing at the contact route, never a dead download.
- [ ] Commit.

### Task 4: Design tokens and shell

**Files:** Modify `app/globals.css`; create `components/shell/{Nav,Footer,PageShell}.tsx`; add `fonts/`.

- [ ] Define the full token set on `:root` in `globals.css`: colour, spacing scale, radius, type scale, shadow, motion durations. Dark is the default ground; light is a token override.
- [ ] Self-host the variable font pair as woff2 with `font-display: swap` and `preload` on the display face. No external font host, the CSP forbids it.
- [ ] Build Nav, Footer, PageShell against tokens only. No literal colour or pixel value in any component.
- [ ] Screenshot a token proof page at both viewports. Commit.

---

## Phase 2: Homepage

### Task 5: The scroll contract

**Files:** Create `lib/timeline.ts`, `test/timeline.test.ts`.

**Produces:** `STAGES` (nine entries: desk, sprawl, collapse, clipboard, text, capture, system, receipt, trust), `stageAt(p): { index, id, local, eased }`, `progressForStage(id): number`, `TRACK_VH`.

- [ ] Write `test/timeline.test.ts` first: a forward sweep of 1000 samples and a reverse sweep produce identical `stageAt` output; boundaries are monotonic; weights sum to the track length; every stage id is unique.
- [ ] Run, expect failure. Implement. Run, expect pass. Commit.

### Task 6: Capability detection, poster, fallback

**Files:** Create `scene/quality.ts`, `components/stage/Poster.tsx`, `components/stage/Fallback.tsx`, `components/stage/Track.tsx`.

- [ ] Detect WebGL, reduced motion, coarse pointer, device memory once via `useSyncExternalStore`.
- [ ] Poster renders server-side and paints before any JS. Scene replaces it only on `onReady`.
- [ ] Fallback renders the same nine beats as stacked sections with real copy, no canvas.
- [ ] Verify with WebGL disabled and with reduced motion forced. Commit.

### Task 7: Scene, camera rig, sprawl and collapse

**Files:** Create `scene/{Scene,Sprawl,Window}.tsx`, `scene/{rig,drive,anchors}.ts`.

- [ ] `drive.ts` is pure: progress in, scene values out, no refs, no clock.
- [ ] Camera pose per stage in `rig.ts`, chased by damping (a lag, not a spring: it converges from either direction).
- [ ] Rival windows are instanced planes with runtime canvas-texture labels drawn from `RIVALS`. Count comes from the array length; nothing hardcodes twelve.
- [ ] Collapse is a pure interpolation from sprawl layout to the single window, driven by `stageAt("collapse").eased`.
- [ ] Screenshot stages 01 and 02 at both viewports. Commit.

### Task 8: Live demos

**Files:** Create `components/demos/{Json,Regex,Hash,Color,Units,Treemap}.tsx`.

- [ ] Each demo is real: JSON parse and format, ReDoS-guarded regex with a match count, SHA-256 via `crypto.subtle`, colour picked off a real canvas, unit and date math, treemap laid out by a real squarified algorithm over clearly labelled sample data.
- [ ] Each demo mounts only when its stage is within one stage of active, and unmounts after.
- [ ] Keyboard reachable, labelled, no layout shift on input. Commit.

### Task 9: Receipt and trust

**Files:** Create `components/stage/Receipt.tsx`, `components/stage/Copy.tsx`.

- [ ] Ledger renders from `RIVALS`; total and savings computed by `stackTotalMinorPerYear()` and `savingsVs()`. No number is typed into the JSX.
- [ ] Counting animation is a pure function of stage progress, not a timer.
- [ ] Trust beat states: no account, no cloud, no telemetry, native, sub-500ms cold launch, and the notarization caveat with the exact first-launch instruction from `SIGNING`.
- [ ] Screenshot both viewports. Commit.

### Task 10: Wire the homepage and gate the budget

**Files:** Modify `app/page.tsx`; create `test/budget.test.ts`, `scripts/budget.ts`.

- [ ] `app/page.tsx` renders Poster, Track, Fallback and structured data. No three.js import may appear in the route's server graph.
- [ ] `scripts/budget.ts` parses the build manifest and fails if the initial chunk exceeds budget or contains three.
- [ ] Run `pnpm build`, then the budget gate. Commit.

---

## Phase 3: Conversion surfaces

### Task 11: Download and pricing

- [ ] Rebuild `app/download/page.tsx` on the new shell with all three apps, each using `releaseFor`, plus requirements and the first-launch instruction.
- [ ] Add `app/pricing/page.tsx`: the $39/$4.99 table, what one licence unlocks, trial terms, refund link. Everything reads `lib/pricing.ts`.

### Task 12: Features and the 40+ pane pages

- [ ] Rebuild `app/features/page.tsx` from `lib/panes.ts` grouped by hub.
- [ ] Rebuild `app/pane/[slug]/page.tsx` on the shell, keeping existing metadata and JSON-LD.

### Task 13: Compare pages

- [ ] Rebuild `app/compare/[slug]/page.tsx` so each comparison reads its rival from `lib/rivals.ts`, inheriting the cited price.

### Task 14: Relay and Tend product pages

- [ ] Full product pages, suite framing, one licence unlocks three, CTA via `releaseFor`.

---

## Phase 4: Long tail

### Task 15: Remaining routes on the shared shell

- [ ] changelog, updates/[slug], guides/[slug], press, brand, roadmap, security, shortcuts, shortcuts-gallery, themes, url-scheme, action/[slug], accessibility, acceptable-use, eula, privacy, refund, terms, contact, faq, not-found. Restyle only; legal wording unchanged.

---

## Phase 5: Verification and ship

### Task 16: Gates

- [ ] `pnpm check`: lint, test, build, budget. All four green.
- [ ] Screenshot every rebuilt route at 1600x900 and 393x852 and zoom before sign-off.
- [ ] Lighthouse on the homepage: performance, accessibility, best practices, SEO.
- [ ] Squash-merge `rebuild/scroll-site` into `main` in one push so a single Vercel deploy covers the whole rebuild.
