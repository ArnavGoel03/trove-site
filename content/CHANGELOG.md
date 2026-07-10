# Changelog

All notable changes to Trove. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Trove ships two release channels via the in-app updater:

- **Stable** (default) - only `vX.Y.Z` releases (no pre-release suffix).
- **Beta** (opt-in via Settings → Updates → Update channel) - receives `vX.Y.Z-beta.N` builds before they promote to Stable.

The in-app updater (Settings → Updates) reads the active channel from
`updater.includePrereleases` in UserDefaults. Switch any time; the next check
will surface whatever's newest on the chosen channel.

---

## [1.12.7] - 2026-07-08

### Added

- **Video Editor** (Capture): a simple, local-only trim / chop / split tool.
  Drop a video, set an in/out selection on the scrubber, then Keep it, Delete
  it, or Split at the playhead. Exports MP4 to your Quick Save folder. No
  upload, no accounts.
- **Every tool is now individually searchable in Spotlight.** Type a tool
  name (or what it does) into Spotlight and open it straight from there.
- **Generate Password from the menu bar**: one click for a password with your
  saved recipe, or pick a length on the go. It copies to the clipboard.
- **Disk Speed comparison**: your drive is now ranked against reference device
  classes with a plain-language "performs like" verdict, and you can choose
  how many past runs to keep.

### Changed

- **Big sidebar cleanup.** Related tools are grouped into hubs with tabs, so
  the sidebar is far shorter and each section reads as distinct purposes:
  Clipboard (Stage / History / Snippets / Notes), Capture (Record / Snip /
  Mirror), Monitors (Processes / GPU / Network / Battery), File Tools (Hash /
  Inspector / Converter), Windows (Snap / Switcher / Modes), plus the earlier
  Storage and Drives hubs. Every old name still works in Spotlight, deep
  links, and shortcuts.
- **Settings** is reorganized into categories with a left rail, so you're not
  scrolling through one long list to find anything.
- **Deep Scan** opens calm: the shortcut grid and Time Machine block are
  tucked behind one disclosure.
- Speedtest sparklines redrawn with smooth curves, a gradient fill, and a
  subtle grid.

### Fixed

- **GPU temperatures are live again.** A one-character bug had every sensor
  reading 0.0, which the app wrongly explained as an OS restriction. Real
  temperatures (CPU/GPU die, NAND, battery) now show on Apple silicon.
- **Battery health reads correctly** (it was misreporting a healthy battery as
  needing service), and live temperature / amperage / power now populate.
- **Devices and Cables work on the latest macOS** (the system tool they relied
  on returns nothing there; they now read hardware directly), so a plugged-in
  phone or drive actually appears.
- **Disk Speed no longer takes minutes on slow USB drives** (the random test
  is time-boxed and still accurate).
- Drive Health shows the drive's volume name; the Account and Date Calc panes
  no longer look broken; Mirror's flip no longer blanks the preview.

## [1.12.6] - 2026-07-08

### Fixed

- Mirror: turning on Flip horizontal showed a BLANK preview. The flip
  transform was anchored at the layer's corner (AppKit default), which moved
  the whole video off-screen, and it also double-flipped on cameras that
  support connection mirroring. A mirror now actually mirrors.

### Added

- Quick Save: one click, no dialog, no naming. Settings > Saving sets the
  default folder (Downloads out of the box); "Advanced: per-tool locations"
  lets each tool save somewhere different when you want that control. Image
  Editor's export gains the Quick Save button first; other tools adopt next.

## [1.12.5] - 2026-07-08

### Fixed

- Notes no longer crashes the app while typing (SIGTRAP on the preview
  render queue). Swift 6 isolation: background work items created inside a
  main-actor class trap when a private queue runs them; all three Notes
  debounces (render, save, count) are fixed the compiler-checked way.
- Speedtest download no longer reads 0.00 Mbps forever. Download now counts
  real bytes as each bounded request completes, the same mechanism upload
  has always used; a run that moves zero bytes reports an error instead of
  recording a fake 0.0 row; the IP label no longer says "IPv4" for an IPv6
  address.
- Image Editor sliders render live while dragging (the old debounce
  suppressed every render mid-drag, so the preview froze and snapped).
  Interactive edits preview on a downsampled proxy; exports stay pixel-exact
  full resolution.

### Added

- Stage "Screenshots" toggle: take screenshots anywhere and they pile up in
  the Stage automatically; "Copy all" pastes the whole batch in one go.
- PDF disk-space optimizer: batch-compress folders of PDFs with one button,
  per-file control, and safety first (originals to Trash, results validated
  before swap, "already optimal" respected).
- Report a Problem (Help menu, plus a banner after a crash): one click opens
  a prefilled GitHub issue from the local crash and hang logs with the
  username redacted. Nothing is sent until you submit it.
- Main-thread hang watchdog: stalls over 5 seconds are recorded to
  Diagnostics with the action trail, so freezes are no longer invisible.
- CI runtime smoke gate: every release must launch the real app, survive a
  crawl of every pane, hold idle CPU near zero, and not grow windows.

## [1.12.4] - 2026-07-08

### Fixed

- Devices pane no longer crashes the app. Its data fetchers inherited the
  model's main-actor isolation, so the "never block the main thread" guard
  fired as a hard crash the moment the pane loaded. The fetchers now run
  properly off-main, and in shipped builds that guard records a diagnostic
  instead of killing the app. A codebase-wide sweep confirmed no other pane
  has the same pattern, and an automated crawl of all 50 panes passed with
  zero crashes.
- Drive Health no longer lists phantom drives. APFS synthesized containers
  and mounted disk images (e.g. the iOS Simulator's) were shown as physical
  disks, so one internal SSD appeared four times next to "external" drives
  that were never plugged in. Only real hardware is listed now.
- Opening a trove:// automation URL reuses the existing window. Every URL
  used to spawn (and state-restore) another stacked window.
- Passwords pane polish: the Mode picker label no longer collapses into a
  vertical letter stack, the generated password renders at full contrast
  and can be selected (it looked like a grayed-out placeholder), and both
  sections use the same card styling as the rest of the app. The same
  squeezed-label bug was fixed in the Network (Direction) and Processes
  (Sort) segmented pickers.

## [1.12.3] - 2026-07-08

### Fixed

- Launch beachball, finally root-caused and gone: since v1.8.0 on macOS 27, the
  app pegged the main thread at 100% CPU on every launch. The menu bar item's
  `isInserted` binding is echoed back by the system on every scene update; with
  a UserDefaults-backed setting behind it, each echo was a defaults write that
  re-fired every stored-setting observer and re-scheduled the next update,
  looping forever. The binding now swallows no-op echo writes, so launch idles
  at 0% CPU (verified on the release build, repeated fresh launches, menu bar
  item on and off). This also unblocks screen recording and everything else
  that starved behind the saturated main thread.
- `bin/ship.sh`: changelog scaffolding no longer fails on multi-line commit
  messages (BSD awk rejects `-v` values containing newlines; the block is now
  passed via the environment).

## [1.12.2] - 2026-07-07

### Fixed

- **Critical: the app beachballed at 100% CPU on launch (no usable cursor) on
  macOS 27.** Root cause: `NavigationSplitView(columnVisibility:)` on macOS 27
  pegs the main thread in an endless layout loop when handed ANY visibility
  binding - even a pure @State one with trivial content. This is a macOS 27
  SwiftUI regression that hit every prior version too (it began at the OS
  upgrade, not in Trove code). Fix: Trove no longer passes a columnVisibility
  binding at all; SwiftUI owns the sidebar column visibility (the toolbar's
  sidebar toggle still works). Verified by bisection: idle CPU 0%, main thread
  parked. Supersedes the incorrect 1.12.1 fix, which mis-attributed the loop.

## [1.12.1] - 2026-07-07

### Fixed

- **Critical: the app beachballed at 100% CPU on launch (no usable cursor).**
  The sidebar's NavigationSplitView column-visibility was persisted from inside
  its binding setter, which SwiftUI calls on every layout pass. Each call wrote
  UserDefaults; that write posts the global change notification SwiftUI's
  @AppStorage observer listens to, which re-rendered the sidebar and re-drove
  the setter - an unbreakable feedback loop that pinned the main thread in
  GraphHost.flushTransactions. Column visibility is now pure @State bound
  directly, with nothing written on the layout path, so the graph settles. (The
  earlier "sidebar hover" change had misattributed this same loop to the hover
  button.) Verified: idle CPU 0%, main thread parked.

## [1.12.0] - 2026-07-07

### Added

- **Drive Health pane** - a full S.M.A.R.T. health assessment for every
  physical disk, internal and external. The native macOS check is instant and
  free for internal drives; a deeper `smartctl` read (behind a single admin
  authorization, auto-installing smartmontools via Homebrew if needed) covers
  the USB enclosures that normally report "Not Supported". Parses the full SATA
  attribute table and the NVMe health log: power-on hours, power cycles,
  temperature, reallocated / pending / uncorrectable sectors, interface CRC
  errors, SSD write-endurance used, and lifetime terabytes written. Every drive
  gets an actionable verdict (Healthy, Monitor, Check the cable, Back up now,
  Plan a replacement, or Replace) with the reasoning behind it. A local,
  private replacement for DriveDx / SMART Utility.
- **Compare drives** - put two connected drives side by side with a per-metric
  winner and an overall "keep and rely on this one" recommendation. Built for
  the moment you have two SSDs plugged in and need to decide which to trust.
- **Cables pane** - grades every connected USB and Thunderbolt cable by the
  speed it actually negotiates (USB 1.x through USB4 and Thunderbolt 5), not by
  what its connector looks like. Per-device best-ever-speed tracking flags a
  cable that is limiting a drive below a speed it has already proven it can hit,
  so you can find the dud in the drawer. Each cable gets a keep/bin verdict and
  the scenario it is genuinely good for. Name your cables and Trove ranks them
  head-to-head per device, with a two-cable side-by-side compare. A software
  answer to a hardware cable tester.

### Fixed

- Sidebar one-click hide no longer pins the main thread at 100% CPU on launch:
  the hover-reveal button kept its layout footprint constant instead of being
  added/removed on hover, which had created a hover/layout feedback loop.

## [1.11.5] - 2026-07-05

### Fixed

- API tester's "export as Swift code" snippet used `fatalError` on an
  invalid URL; the generated code now throws `URLError(.badURL)` instead,
  so code copied out of Trove doesn't crash ungracefully.

## [1.11.4] - 2026-07-01

Another reliability pass from the automated nightly debug audit: more
operations that could fail silently now tell you, or fail safe.

### Fixed

- **No more false "Saved" confirmations.** Saving clipboard-history text and
  saving an API Tester response now report an error if the write fails, instead
  of showing a success message while nothing reached disk.
- **Hosts packs and API environments no longer vanish on a failed save.** Both
  surface a warning if their store cannot be written, so your custom hosts
  blocks and saved API environments are not silently lost.
- **Stage drag-export skips any item whose temp file could not be written**, so
  a drag or copy never references a file that is not on disk.
- **Speedtest history logs a save failure** instead of dropping it silently.
- **Generated API code snippets are safer.** The Copy as Swift snippet now
  emits a guarded URL instead of a force-unwrap, so pasting it into your own
  project cannot crash on an invalid URL.

## [1.11.3] - 2026-06-30

A reliability pass surfaced by Trove's new automated nightly debug audit:
several operations that could fail silently now tell you when they fail.

### Fixed

- **Office metadata wipe no longer claims success when it did not finish.**
  Stripping author names, comments, and revision history from .docx / .xlsx /
  .pptx now surfaces an error if any part cannot be cleared, instead of
  silently repackaging the document with the sensitive data still inside.
- **Markdown save and HTML export now report write failures** (full disk,
  permissions) with an error toast, instead of the file silently not being
  written.
- **Mirror snapshots no longer leave phantom Library entries.** A snapshot is
  recorded in the Outputs Library only if the file actually wrote to disk, so
  Reveal in Finder can never point at a missing file.
- **Clean Sweep counts a symlink removal failure as an error** instead of
  folding it into the success count.
- **Terminal stops its subprocess when the pane goes away**, so a running
  command cannot be orphaned for the rest of the session.

### Changed

- Removed a dead, never-assigned recorder timer field; replaced a fragile
  force-unwrap in the snap-hotkey conflict warning with safe optional binding;
  centralized the iCloud-sync UserDefaults keys so the read and write sites
  cannot drift apart.

### Internal

- Single-source version: VERSION is now the only hand-edited version, with
  generated derived files and a one-button `bin/ship.sh` release flow. Added an
  automated nightly cloud debug audit that pushes findings to a `nightly-debug`
  branch.

## [1.11.2] - 2026-06-29

Security, reliability, and a new diagnostics layer so the app never just
silently glitches.

### Added

- **Detailed crash reports + breadcrumb trail.** Trove now keeps a private,
  on-device trail of what you were doing (panes opened, actions taken) and
  folds it into every crash report, along with host details (architecture,
  cores, RAM, thermal state, session uptime) and the pane you were in. A
  crash is no longer a bare stack: it shows the exact sequence that led there.
  Still 100% local and opt-in to send; nothing is uploaded automatically.
- **Visible failure feedback.** A new diagnostics path means recoverable
  failures surface as a toast with a "Copy details" action and get logged to a
  capped local diagnostics log, instead of failing quietly in the background.

### Fixed

- **API Tester secrets are now device-only.** Saved API credentials (OAuth
  client secrets, bearer and basic tokens) are stored in the Keychain as
  this-device-only, so they are never written to unencrypted backups or
  migrated to another Mac.
- **Postman import no longer pre-attaches local files.** An imported
  collection can no longer pre-bake a path to a local file as a request body
  or upload; you re-attach the file yourself through the standard file picker,
  closing a one-click data-exfiltration path.
- **Hardened PKCE.** The OAuth PKCE code verifier refuses to fall back to a
  predictable value if the system random generator ever fails.

### Changed

- **Faster cold launch.** Mode and Workflow hotkey registration (which reads
  small config files) no longer runs before the first frame paints.
- **Local AI chat memory is bounded.** A long conversation is capped so it
  cannot grow memory without limit.

## [1.11.1] - 2026-06-21

### Changed

- Purged every em/en dash from user-facing text (pane descriptions, menus,
  toasts, warnings) in favor of plain ASCII punctuation, for a cleaner,
  consistent look. No functional change; the calculator still normalizes
  dash-style minus signs you type.

## [1.11.0] - 2026-06-21

Reliability + a big internal hardening pass. No new panes; everything you
already use gets steadier.

### Fixed

- **Cursor no longer gets stuck after clicking.** A hover-cursor helper pushed
  and popped the system cursor stack out of balance, which could leave the whole
  app stuck on the wrong pointer after you tapped a control. Push/pop is now
  strictly balanced and released on disable/disappear.
- **No more potential hangs from helper tools.** Every external command Trove
  runs (battery, Bluetooth, services, file inspector, converters, etc.) now goes
  through one runner with a timeout and deadlock-safe output draining, instead of
  per-pane copies that could wedge if a tool stalled or printed a lot.
- **Saving can no longer fail silently.** Durable saves (API requests + history,
  and corrupt-file quarantines) now warn you if a write fails instead of losing
  the data without a word.

### Changed (internal, no behavior change)

- Large DRY/maintainability pass: consolidated duplicated subprocess, byte-format,
  file-size, and "Reveal in Finder" code into shared helpers; routed all
  UserDefaults keys through the central registry (closing a whole class of
  wrong-key bugs); collapsed six parallel per-pane switch tables into one
  parity-verified `PaneMeta` table; deduped repeated URL/menu guards.
- New CI: pushing a `vX.Y.Z` tag now builds and publishes the release
  automatically. See `BUILD-PERFORMANCE.md` for the build story.

## [1.10.0] - 2026-06-21

System integration: Spotlight, searchable PDFs, and Liquid Glass.

### Added

- **Snippets & Clipboard in Spotlight.** A new Core Spotlight donation layer
  surfaces your Snippets (and, opt-in, Clipboard history) directly in macOS
  Spotlight (Cmd-Space) as searchable results, not only as Shortcuts actions.
  Snippet indexing is ON by default; clipboard indexing is OFF by default and,
  when enabled, only ever indexes a redacted single-line summary (never the
  full body) and skips pinned entries. Toggle both in Customize > Spotlight.
- **Searchable PDF export from OCR.** Export an OCR result as a selectable,
  searchable PDF: the original image as the visible page with an invisible
  recognized-text layer over the words, so the text is selectable and
  searchable in any PDF viewer.
- **Liquid Glass (macOS 26).** Trove's custom floating and overlay surfaces
  now adopt the system Liquid Glass material on macOS 26 (availability-gated;
  the macOS 13 floor is unchanged).

### Changed

- Internal build/dev-loop overhaul: RAM-safe incremental builds (a runaway dev
  build no longer balloons memory), main.swift split into feature files, and
  SwiftUI type-check hotspot reductions. No user-facing behavior change; details
  in BUILD-PERFORMANCE.md.
- All remaining inline UserDefaults keys centralized into DefaultsKey.

## [1.9.0] - 2026-06-20

World-class OCR, especially for handwriting.

### Added - OCR

- **Scan from iPhone (Continuity Camera).** Use a nearby iPhone as a
  high-resolution scanner from the OCR pane. Trove grabs a burst and keeps
  the sharpest frame automatically, so blur or focus hunting does not ruin
  the scan. macOS 14+.
- **Structured handwriting recognition (macOS 26+).** OCR now uses Vision's
  document recognizer on macOS 26, with markedly better handwriting accuracy
  and clean paragraph-separated output. Small or low-resolution captures are
  upscaled first. Falls back to the existing text recognizer on older systems.
- **Clean up with Apple Intelligence (opt-in, macOS 26+).** A toggle that
  runs the on-device model to fix garbled handwriting into faithful, readable
  text. Fully private, never leaves your Mac. Output is checked against the
  source so it can never silently replace your text with something else.

### Fixed

- The menu-bar item no longer appears twice: the SwiftUI menu-bar quick-access
  added in 1.8.0 is now the single menu-bar presence (the legacy status item
  only appears when the menu-bar item is turned off in Customize).

## [1.8.0] - 2026-06-20

A menu-bar quick-access plus a full strict-concurrency cleanup.

### Added - Menu bar

- **MenuBarExtra**: a menu-bar pull-down for Open Trove, Stage actions
  (paste / capture / copy / open), recent snippets (click to copy), and
  recent clipboard text, without opening the main window. Toggle it under
  Customize, Density and layout ("Show Trove in the menu bar"); default on.

### Changed - Code quality

- **Zero compiler warnings.** Resolved all 202 Swift 6 strict-concurrency
  and deprecation warnings at the root (no suppression): proper @MainActor
  isolation, Sendable carriers for cross-isolation values, and migration of
  deprecated APIs (AVFoundation tracks/duration to async load, CC_MD5 to
  CryptoKit, launchPath to executableURL, unsafeBitCast to unsafeDowncast,
  and others). Build is clean; full test suite passing.
- Removed 33 stale duplicate `.swift` files at the macos root (only
  `Sources/Trove` is compiled).
- Fixed the in-app updater `fallbackVersion`, which had drifted to an old
  value because prior bumps edited a since-removed duplicate file.

## [1.7.0] - 2026-06-19

A Shortcuts/Spotlight release: Trove's existing-but-hidden Snippets and
Clipboard automation is now discoverable system-wide, plus two new
one-step snippet actions.

### Added - Shortcuts & Spotlight

- **Snippet actions in Spotlight/Siri**: "Copy <snippet> from Trove" and
  "Add <snippet> to Trove Stage" surface a live-filtering snippet picker
  and run in one step, with no app window. Backed by a read-only
  out-of-process read of `snippets.json`, so they work inside the
  Shortcuts/Spotlight extension host.
- **Open <pane> in Trove** as a spoken/Spotlight phrase for every pane.
- **Get Trove snippet by name** and **Pick Trove clipboard entry** promoted
  to first-class App Shortcuts. The App Shortcuts catalogue grew from 5 to
  10 phrases, all available on first launch with no configuration.

### Changed - Calculator

- The Calculator toolbar's transcript actions (Save, Save to Downloads,
  Copy, Send to Stage) and the currency-rate controls are consolidated
  into a single menu, so the title bar stays uncramped.

### Notes

- Project relocated out of iCloud Drive to a local path; this removes the
  source-eviction and git-pack-corruption issues that affected the dev
  environment. No user-facing change.

## [1.6.0] - 2026-06-03

A platform + feature release: the whole codebase now compiles under Swift 6
language mode, plus two new flagship panes and a sweep of feature completions.

### Added - Terminal pane

Embedded command runner (Compute). Streams commands through zsh with a
persistent working directory, command history (up/down + menu), and ANSI
color. cd/clear/pwd are builtins; PATH is augmented so brew/node resolve as
in Terminal.app; output is capped and stdout+stderr merged. Stop sends
SIGTERM. Copy/Save-transcript included. A quick runner, not a full TTY
(vim/top are out of scope by design). ANSI SGR parsing is scalar-based and
unit-tested.

### Added - Markdown editor pane

Split editor + live, natively-rendered preview (no WebView, so it follows
the active theme and stays fast). Block parser handles headings, fenced
code, blockquotes, ordered/unordered lists, thematic breaks, paragraphs;
inline spans via AttributedString. Editor/split/preview modes, open/save
.md, export and copy HTML, live word count, persisted document.

### Added - feature completions

- **Color**: CMYK string + nearest CSS/X11 named color, both copyable.
- **Text Tools**: the diff toggle now shows a real side-by-side LCS line
  diff with red/green change highlighting (previously a no-op).
- **PDF Compress**: new Optimize mode (now default) re-serializes the PDF
  preserving selectable text, instead of rasterizing every page to JPEG.
  Rasterize mode stays for scanned/image PDFs.
- **Workflows**: Dry run button runs the pipeline but skips every sink.
- **Finder Tweaks**: explicit applied/reverted success toast.
- **Notes**: per-tab hover preview of each tab's contents.

### Changed - Swift 6

Migrated the entire target to Swift 6 language mode (full strict
concurrency) on the Swift 6.3 toolchain; swift-tools-version 6.2. ~1200
concurrency errors resolved, including a handful of real data races fixed
properly (Stage persistence now snapshots Sendable records on the main actor
before writing off-main). No behavior change intended; build green, full
test suite passing.

---

## [1.5.33] - 2026-06-03

Consolidated entry. Versions 1.5.14 through 1.5.32 were internal
`BUILD_VERSION` increments with no user-facing changes; the real work
landed in the commits below and is documented here under the current
`VERSION` (1.5.33).

### Added - Reinstall restore (Settings backup)

The encrypted backup (Settings -> Sync) now restores far more than
Snippets / Modes / Workflows, so a fresh install brings a user's setup
back intact:

- **Curated preference allowlist.** ~50 portable preferences ride along
  in the encrypted bundle: theme, custom theme, accent, Big Scan filters,
  password recipe, QR colors/size/correction, JSON formatter + regex
  flags, Image Editor export format, and the full Recorder toggle set
  (codec, fps, quality, filename template, mic gain, auto-pause, click
  ripple, cursor/keystroke overlays, webcam PIP, etc.), plus Image Tools
  export prefs, Snip mode/delay/destination, OCR language/translation,
  Log viewer display prefs, calc auto-fetch, hash auto-copy, and the
  onboarding-seen flag (a returning user skips the welcome).
- **Machine-specific keys deliberately excluded** so a restore on a
  different Mac never points at a missing path or device: absolute save
  directories, per-device mic UID, display IDs, the version-fragile
  sidebar bitmask, and (for privacy) the clipboard-watching arm state.
- **Pinned clipboard history** is now backed up and restored. Only
  pinned entries travel (an explicit "keep this"); transient and often
  sensitive unpinned clipboard traffic stays out. Restore is idempotent
  and drops image/file pins whose temp path is gone.
- All keys are centralized in the `DefaultsKey` registry so a backup
  allowlist and its writer can never spell a key differently.

### Added - Intelligent features

- **Session restore, failure intelligence, and anomaly watch.** Trove
  remembers in-flight work, surfaces likely-cause hints when an operation
  fails, and watches for anomalous system state.
- **Presets** across panes for one-click recall of common setups.
- **Disk Speed** benchmark history now persists (atomic JSON, off-main
  load, capped, with Clear), and long-running benchmarks/tests/scans
  survive pane switches via app-lifetime singletons with a global
  completion toast.

### Changed - Build system (Era 3 SwiftPM)

Full migration to the conventional `Sources/Trove/` SwiftPM layout.
Incremental no-op rebuilds drop to sub-second; a one-line change rebuilds
in ~10 s instead of a whole-module recompile. The flat-file `build-macapp`
/ `test-trove` shipping path is preserved, and the prior architecture is
recorded in `ARCHITECTURE-HISTORY.md`.

---

## [1.5.13] - 2026-06-02

### Added - Even more inline ⌘K actions

- **HTML escape / unescape** - `&amp; < > " ' nbsp` mappings.
- **snake_case / camelCase / PascalCase / CONSTANT_CASE** - splits camel
  + snake + kebab + spaces; covers all common naming styles.
- **Lorem ipsum** - `lorem 30` → 30 words.
- **Local IP** - `ip` → comma-separated `en0: 192.168.x.x`, drops
  loopback and link-local.

### Changed - Build speed

`bin/build-macapp` now defaults to `-Onone -num-threads 8` for dev
iterations. Benchmarked on Trove (~30k LOC) - cold builds **4-7 min →
50.8 s**, ~6× faster. Set `TROVE_RELEASE=1` to flip back to `-O WMO`
for the shipping binary.

---

## [1.5.12] - 2026-06-02

### Added - More inline ⌘K actions

Catalog expanded with the highest-frequency dev transforms:

- **JWT decode** - splits `eyJ.eyJ.sig`, base64url-decodes the payload,
  pretty-prints the JSON. Signature not verified (use the Passwords pane
  if you need to verify).
- **ROT13** - classic caesar shift.
- **Hex ↔ RGB** - `hex to rgb #ff6a2a` → `rgb(255, 106, 42)` and the
  reverse.
- **Regex match** - `regex \\d+ | order 42 received` → `42`. Use `|` as
  the pattern/subject separator, or `regex PATTERN against SUBJECT`.
- **Count lines** - sister to count chars / count words.

Triggers are natural-language and stack on top of v1.5.10's catalog.

---

## [1.5.11] - 2026-06-02

### Fixed - Date Calc spacing + empty timezone pickers

Time-zone pickers used to render as just a dropdown chevron with no
selected value visible. Root cause: `Picker("", selection: …)` plus
`.labelsHidden()` left the menu button with no text to display.
Switched to `.pickerStyle(.menu)` with the selected timezone string as
the label so the button shows what's currently picked.

Date Calculator spacing pass: Anchor DatePicker pinned to 260pt so it
matches the rest of the control rhythm; Delta row regrouped (number
field + stepper as one pair, unit picker on the right); "Business days
only" promoted to its own row so it doesn't crowd or overflow on narrow
windows.

### Added - Clipboard content classifier + paste suggestions

Every time something lands on the clipboard, Trove silently classifies
the content and surfaces a one-line "Looks like X · try Y" toast when it
recognizes one of these types:

- **JWT** (3 base64url segments)
- **URL** (`http://`, `mailto:`, etc.)
- **Email**
- **curl command**
- **SQL** (starts with SELECT/INSERT/etc.)
- **JSON** (parses)
- **Hash digest** (exact-length hex: MD5/SHA-1/SHA-256/SHA-384/SHA-512)
- **Base64**, **Hex**
- **Unix timestamp**
- **Markdown**

Suggestions point at the relevant ⌘K inline action or pane (e.g. JSON →
"⌘K json pretty", JWT → "base64 decode the payload"). Debounced: same
content within 5 s or same kind within 30 s suppresses the toast, so
pasting five JWTs in a row doesn't spam.

Zero LLM, zero network, zero per-byte work - classifier samples the
first 512 chars and short-circuits on the first match.

---

## [1.5.10] - 2026-06-02

### Added - Quick Switcher inline action results

Type `base64 encode hello world` into ⌘K and the encoded value appears
as the top row. ⏎ copies it. No pane navigation, no extra clicks.

Supported transforms (extensible - one entry per case in
`inline_actions.swift`):

- **Encoding**: base64 encode / decode, URL encode / decode, hex encode
  / decode
- **Hashes**: MD5, SHA-1, SHA-256, SHA-512
- **Case**: uppercase, lowercase, title case, slug (kebab), reverse
- **JSON**: format, minify
- **Time**: Unix → ISO 8601, now (current Unix timestamp)
- **UUID**: generate v4
- **Counts**: chars, words

Triggers are natural-language: `sha256 of secret`, `base64 encode hello`,
`url decode foo%20bar`, `slug My Title`, `json pretty {"a":1}`.
Same row format as everything else in the switcher, so it stacks
cleanly with pane and app launcher results.

---

## [1.5.9] - 2026-06-02

### Added - Lightning-fast test harness

Iterating with the v1.5.8 test suite was painful: each run rebuilt the
full ~90-file Trove module, taking 3-5 minutes. Now sub-9-second cold
compiles and sub-100ms cache hits.

- **Pure-logic carve-out**: `core_api_types.swift`, `core_pass_gen.swift`,
  `core_hosts_types.swift`, `core_speedtest_math.swift`. Guarded by
  `#if TROVE_TESTING_CORE_ONLY` so production globs them as empty (no
  duplicate-type errors), test build defines the flag and uses them.
- **Slim test source list**: `bin/test-trove-suite` compiles only the
  4 `core_*.swift` files + 5 pure `api_*.swift` files + `trove_paths.swift`
  + tests/. 10 production files instead of 90.
- **Source-mtime cache**: if no input file is newer than the test binary
  at `/tmp/trove-test-suite-bin`, swiftc is skipped entirely.

Coverage: 34 tests across speedtest math, Postman v2.1 import (incl.
event-array scripts), password generator, HIBP constant-time compare,
APIEnvStore.substitute, API scripts (pm.expect, header API,
pre-request preservation), code export (curl/fetch/python/multipart),
hosts editor render + CRLF.

Run before every ship:
```
test-trove-suite
```

### Known regression - JS script watchdog

The v1.5.6 JS watchdog sets `ctx.exception` from a Dispatch timer.
JavaScriptCore only checks `exception` between safe points, so a tight
`while(true){}` never yields and the watchdog never fires. Test pulled
until rewrite uses `JSContextGroupSetExecutionTimeLimit`. Tracked for
v1.5.10.

---

## [1.5.8] - 2026-06-02

### Fixed - Speedtest download for real this time

v1.5.5 / v1.5.6 / v1.5.7 all shipped with broken download measurement
that reported 0.00 Mbps. The delegate-based chunk-counting approach in
v1.5.6 looked right on paper but did not surface bytes into the live
ByteCounter in practice. Switched to polling
`URLSessionTask.countOfBytesReceived` directly: the OS populates that
property regardless of delegate plumbing, so it cannot be silently
bypassed by completion-handler vs delegate-handler API choice.

Upload polls `countOfBytesSent` symmetrically.

---

## [1.5.7] - 2026-06-02

### Fixed - UI polish (Hash + Mirror)

**Hash pane top-right toolbar.**
- "Auto-copy SHA256" now uses a proper `.switch` toggle style with the
  label on the left. Previously a `.checkbox` rendered the toggle
  awkwardly before the label, with the label's own systemImage trailing -
  three disconnected blobs.
- Redundant top-right "Choose file…" button removed; the empty-state
  card already exposes it prominently and ⌘O still works.
- "Clear all" trash kept as a destructive role with a clear `.help`
  tooltip.
- "Export" menu label tightened (was "Export…" with a duplicate trailing
  ellipsis that doesn't match the system convention for menus).

**Mirror pane camera-starting state.**
- Preview now shows a "Starting camera…" overlay with a spinner and a
  hint pointing to System Settings → Privacy & Security → Camera. The
  old empty rounded rect made the flip / snapshot / etc. controls feel
  broken when the camera was still being granted access.

---

## [1.5.6] - 2026-06-02

### Fixed - Robustness round (20 items)

**Critical bugs**
- **JS script watchdog (5 s)**. Pre-request / tests JS can no longer hang
  the UI with an infinite loop. Real `Error('Trove script timeout')`
  surfaces in the Tests sub-tab.
- **URLSession leak per send**. Sessions are pooled by (proxy, ignoreSSL)
  and `finishTasksAndInvalidate()` runs on every send. No more leaked
  FDs / connection slots over a long session.
- **OAuth loopback listener now hard-caps at 5 minutes**. Closing the
  browser without finishing no longer leaves a stuck listener.
- **Corrupted api-collection.json is preserved**, not silently wiped.
  Bad file is renamed to `api-collection.corrupt-<ts>.json` and a banner
  surfaces; user can recover by hand.
- **Cancel button while a request is in flight** (⌘.). Replaces the
  spinner-only state where slow requests trapped the user.
- **Quick Switcher indexes EVERY pane, not just sidebar-visible ones**.
  Typing `battery` now finds Battery even when the user hid it from the
  sidebar. Hidden panes are tagged `· hidden` in the result row.
- **Speedtest live Mbps is non-zero from sample #2**. Previously the
  1-second sliding window returned nil for the first second of the
  test, so the UI sat at 0.00 Mbps. Now it falls back to the
  whatever-we've-got window so preliminary stats render immediately.
- **Speedtest bufferbloat tiles show "measuring…" until measured**
  instead of `0 ms / -82` mid-test, which looked like a broken reading.

**UX correctness**
- **TLS/cert ignore toggle** per request (Settings tab). For local dev
  with self-signed certs. Trips an explicit "don't ship this against
  prod" warning underneath.
- **Save response default filename** derived from the URL last path
  component + a MIME-mapped extension (`.json` for `application/json`,
  `.png` for `image/png`, etc.).
- **OAuth refresh tokens** captured from the token endpoint and stored
  on the request. `APIOAuthPKCE.refresh(...)` mints a new access token
  with no browser round-trip.
- **JS exception messages now include line:column** and an explicit
  `[script killed by 5s watchdog]` tag when the watchdog fired.
- **GraphQL bad variables JSON raises a real error** instead of
  silently sending `{}`.
- **History dedup**: identical (method, URL, body) sends within 60 s
  replace the prior row instead of appending a duplicate.

**Security**
- **OAuth client secrets, Bearer tokens, AWS secret keys, Basic
  passwords, Digest passwords can now be Keychain-backed** via
  `APISecretsStore`. Plain-text values still work; the storage
  reference looks like `trove-kc://<UUID>` in the on-disk JSON.
- **Code-export "Redact secrets" toggle** replaces every resolved
  secret value with `<REDACTED>` in the copied curl/fetch/etc.
- **HIBP comparison is constant-time** (length-equalized XOR sum) so
  the local match step can't be timing-side-channeled.

**Postman parity**
- **Postman v2.1 import now imports pre-request + test scripts** from
  the `event[]` array on each item. Previously dropped.
- **Code export gains multipart** for curl (`-F` lines) and fetch
  (FormData with file-comment placeholders).

**Cross-pane**
- **Hosts editor handles CRLF** line endings. Boot Camp / Windows-edited
  hosts files no longer collapse into a single concatenated line.
- **Speedtest offline detection**: 4-second probe to `cdn-cgi/trace`
  before any test. Clear "Network unreachable / Cloudflare blocked"
  banner instead of a silently-0 test.
- **LLM chat preserves partial tokens** on stream errors, surfaces
  the error inline, and re-checks Ollama connectivity so the pane
  doesn't falsely claim "connected" after Ollama crashes.
- **App-level crash reporter**: SIGABRT/SIGBUS/SIGSEGV/SIGILL/SIGFPE/
  SIGTRAP + NSUncaughtException all write a record to
  `~/Library/Logs/Trove/crash.log`. Local-only; no telemetry.

---

## [1.5.5] - 2026-06-02

### Changed - Speedtest measurement: hyper-accurate

Old single-stream sequential sampling under-reported fast links by 30-50%
because TCP window scaling caps single-flow throughput. New methodology
matches fast.com / Speedtest.net / Cloudflare Speed Test:

- **8 parallel streams** per direction, opened against Cloudflare's
  `__down` and `__up` endpoints. Saturates the physical link instead of
  bottlenecking on a single TCP flow.
- **10-second test window** per direction, with 1.5 s warm-up and 0.5 s
  tear-down trimmed. TCP slow start no longer drags the average down.
- **100 ms sliding-window throughput** during the test; the LIVE Mbps
  display updates every tick instead of jumping at sample boundaries.
- **Reported steady-state Mbps is the MEDIAN of 1-second windows** across
  the trimmed range, not a single end-to-end average. Outliers can't
  skew the headline number.
- **Peak Mbps** shown alongside median so you can spot bursty links.
- **Stability %** computed as `1 - stddev/mean` of the steady windows.
  100% = rock solid; 60% = wild swings.
- **30-sample latency** (was 10) with IQR-trimmed median ping and
  trimmed stddev jitter, plus 3-sample warm-up that's discarded.
- **Loaded ping medians** use the same IQR trim.

Expected real-world delta on a 500 Mbps home link: old single-stream
reported ~200 Mbps; new parallel measurement reports the actual ~480 Mbps.

---

## [1.5.4] - 2026-06-02

### Fixed - API Tester hardening pass (six bugs + two security holes)

A red-team review of v1.5.3 surfaced bugs and security issues in the
Postman-class additions. All addressed before any new features ship.

- **Pre-request scripts no longer wipe the request.** Previously the
  whole APIRequest was rebuilt from the JS object, silently resetting
  authKind, bodyKind, OAuth config, folder, proxy, tests script,
  AWS keys, multipart fields, etc. Now only the four script-mutable
  fields (URL, method, body, headers) are pulled back; everything else
  is preserved.
- **`pm.expect(x).to.exist` and `.be.ok` / `.be.true` etc. fire only when
  accessed**, via `Object.defineProperty` getters. Previously implemented
  as IIFEs, they ran at `pm.expect()` build time and recorded false
  failures even when the script never read the property.
- **`pm.request.headers.add({key, value})`, `.upsert`, `.remove`, `.get`,
  `.has`, `.all`, `.each` now work**, matching the Postman API. The old
  raw-array exposure broke paste-ports.
- **`pm.response.headers.get('content-type')` case-insensitive**, matching
  Postman. Same shim as request headers.
- **OAuth 2.0 PKCE: `state` parameter validated** on callback per RFC 6749
  §10.12. Mismatched callbacks rejected with a 400 + CSRF error. Closes a
  cross-site request forgery vector.
- **OAuth 2.0 PKCE: loopback port falls back** through 53170-53179 if the
  preferred port is taken. The actually-used `redirect_uri` is echoed in
  the token exchange so the endpoint doesn't reject with
  `redirect_uri_mismatch`.
- **OAuth 2.0 PKCE: callback handler runs on MainActor** (was hopping
  off-actor in a `Sendable` closure). Removes a concurrency hazard.
- **`pm.expect` gains `.eql` (deep equal), `.match(regex)`, `.contain` /
  `.include`, `.have.property(name)`, `.have.lengthOf(n)`, `.be.true /
  .false / .null / .undefined`, `.be.a(type)` / `.be.an(type)`** for
  Chai/Postman compatibility.
- **Test results clear before each send** so prior-run pass/fail rows
  don't bleed across into the next response.
- **`pm.response.responseTime` and `.responseSize` aliases** added (Postman
  uses these names).

---

## [1.5.3] - 2026-06-02

### Added - API Tester: Postman flagship features

Closes the remaining gap with Postman.

- **Pre-request scripts** - JavaScript via JSContext. `pm.environment.get/set`,
  `pm.request.headers.add`, console.log surfaced in the Tests response tab.
- **Tests / assertions** - JavaScript with a `pm.test(name, fn)` + `pm.expect()`
  harness. Pass/fail listed in the new Tests response sub-tab with messages.
- **OAuth 2.0 Authorization Code + PKCE** - Trove spins up a localhost
  (127.0.0.1:53170) loopback, opens the auth URL in the user's browser,
  catches the redirect, exchanges code + verifier for the access token.
- **Postman Collection v2.1 import** - toolbar Menu → Import Postman
  collection. Folders flattened into `Folder / Request` names. Maps body
  modes (raw/urlencoded/formdata/graphql/file), auth (basic/bearer/apikey),
  headers, method, URL.
- **Folders in collection sidebar** - group by `Folder / Subfolder` path
  via the new per-request Folder field in the Settings tab.
- **Per-request HTTP proxy** - Settings tab → "HTTP Proxy". URL session uses
  it for the duration of one request. `{{var}}` substitution supported.

### Changed - Speedtest pane visual polish

- **Sparklines** now have a gradient area fill under the stroke plus a
  marker dot on the last sample. They read as charts instead of stray pen
  marks.
- **Grade badge** enlarged (68pt), gradient + soft glow. The headline
  result is now legible across the room.
- **Connection card** hides rows that haven't resolved yet ("-" placeholders
  made the card look broken when ip-api.com was slow).

---

## [1.5.2] - 2026-06-02

### Changed - API Tester comprehensive pass (Postman-class)

API Tester was solid but bare. v1.5.2 makes it a full Postman replacement.

**Environments + variables.**
- Named environments (Local, Staging, Prod, …) each with key/value vars.
- `{{var}}` substitution everywhere: URL, headers, body, auth fields,
  query params, multipart values, OAuth fields, AWS keys, etc.
- Env picker in the toolbar; manage sheet via "Manage environments…".

**Body modes** (was: JSON / Form / Raw):
- GraphQL - query + variables panes; auto-wraps `{"query":..., "variables":...}`.
- Multipart - per-field file upload, toggle/delete rows.
- Binary - single-file upload via NSOpenPanel.

**Auth** (was: None / Basic / Bearer):
- API Key - header or query param.
- OAuth 2.0 Client Credentials - Fetch button hits the token URL, stores
  bearer token automatically.
- AWS Signature v4 - full canonical request + HMAC-SHA256 signing.
- Digest - partial (one-shot Authorization header; full challenge-response
  in v1.5.3).

**Response views** (was: Body / Headers / Raw):
- Pretty, Raw, Preview (WKWebView for HTML), Image, Hex dump (first 8 KB),
  Headers, Cookies (HTTPCookieStorage for the response host), Timing.
- Timing breakdown shows DNS / Connect / TLS / TTFB / Download as
  proportional bars, sourced from URLSessionTaskMetrics.

**Code export** - Copy as: curl, fetch, axios, Python requests, Swift
URLSession. Resolved with the active environment's `{{var}}` values.

**Sidebar** - search box filters Collection + History by name, URL, or
method. Save response to file via toolbar menu.

---

## [1.5.0] - 2026-06-02

### Added - Local LLM chat pane (Ollama)

Chat with a local language model from inside Trove. Talks to **Ollama**
(open source, free, MIT) over its native HTTP API at localhost:11434.

- **Streaming responses**: tokens appear as the model emits them.
- **Model picker**: every model you've pulled with `ollama pull` shows up
  in the dropdown. Switch live between conversations.
- **System prompt** + **temperature** slider (0.0 to 1.5).
- **Multi-turn**: full conversation history sent on each request.
- **Stop button**: cancel a stream mid-token.
- **Install CTA**: if Ollama isn't running, the pane shows a one-click
  open-ollama.com/download plus a copy-to-clipboard `brew install --cask
  ollama` helper.

Why Ollama instead of bundling llama.cpp + a 3B model:

- Trove would balloon from 8 MB to >100 MB, plus a ~2 GB model download
  on first run.
- Ollama is the de-facto standard for "run an LLM locally on Mac",
  M-series accelerated, well-maintained.
- Models are shared with other tools (Raycast, Continue, etc.); no
  duplication on disk.

Nothing leaves the Mac: Ollama runs entirely on localhost; Trove never
talks to a remote inference endpoint from this pane.

---

## [1.4.8] - 2026-06-02

### Fixed - Date Calc pane spacing/alignment

Anchor / Delta / Result, From / To / Converted, Unix / ISO 8601 rows now
share a 90pt label column so labels vertically align. Inter-row spacing
is uniform 10pt, inter-card spacing is uniform 14pt, controls have
consistent widths. Delta value now lives in one field with stepper
alongside, instead of stepper-plus-duplicate-label-plus-huge-text-box.

### Changed - Speedtest pane (comprehensive pass)

Speedtest was bare bones (down, up, ping, jitter). Now:

- **Bufferbloat / loaded latency** - pings DURING the download and
  DURING the upload, separately from idle. Reports each + the delta
  over idle ("During DL +180 ms" etc.). Bufferbloat label (Excellent
  -> Terrible) computed from the worst loaded delta.
- **Packet loss** - 50 probes; failure count as a percentage.
- **Live sparkline** - Mbps samples drawn beneath the Download and
  Upload cards so the user sees stability, not just the final number.
- **Composite grade A-F** - single letter rating from Mbps + jitter +
  bufferbloat + packet loss. Big badge in the header.
- **IPv4 + IPv6** dual-stack detection via Cloudflare's v4 and v6
  endpoints.
- **ISP / ASN / country** - ip-api.com one-shot on user-initiated runs
  (never automatic; never timer-driven).
- **History** grows to 100 entries with grade pill per run; download
  trend mini-sparkline at the top; **Export CSV** button for ISP
  complaints.

### Fixed - Two-finger scroll jank in Quick Switcher

The ⌘K Quick Switcher list jittered when the user scrolled with two fingers.
Root cause: each row that passed under the cursor during scroll fired
`.onHover`, which set `selected = idx`, which fired an `onChange` that
called `proxy.scrollTo(...)`. That programmatic scroll fought the
trackpad's scroll position every frame.

Fix:
- `.onHover` now only acts when the system mouse location actually
  moved between events (ignores list-scrolled-under-cursor events).
- Selection changes are tagged with their source (keyboard / hover /
  initial). Auto-scroll-into-view only runs for keyboard navigation,
  never for hover.

### Added - Hosts file editor pane

GUI for `/etc/hosts`. Group rules into named packs (e.g. "block social",
"dev redirects"); toggle whole packs on or off; edit individual lines;
then commit via `osascript with administrator privileges` so the user
gets one TouchID/password prompt per save, not one per line. Trove-managed
blocks are bracketed with sentinels in the file, so any system lines you
already have (`127.0.0.1 localhost`, etc.) are preserved verbatim.

- Live `/etc/hosts` preview before committing
- Per-rule and per-pack toggles
- Auto flushes DNS cache (`dscacheutil -flushcache && killall -HUP mDNSResponder`)
- No more Terminal + sudo dance; no more abandonware GasMask

### Added - Password generator + breach checker pane

Strong cryptographically-random password generator (SecRandomCopyBytes,
not arc4random). Two modes:

- **Random** - length 4 to 128, mix and match lower / upper / digits /
  symbols, optional exclude lookalikes (0/O, 1/l/I).
- **Memorable** - 2 to 8 dictionary words joined by your choice of
  separator, optional capitalization, optional trailing random number.

Live entropy estimate in bits with strength rating (very weak ->
excellent). One-keystroke copy (⌘⇧C) and regenerate (⌘R).

Plus a **HaveIBeenPwned k-anonymity** breach checker. Only the first
five hex chars of the password's SHA-1 ever leave the Mac; the rest of
the comparison happens locally. Check the generated password or paste
your own.

---

## [1.4.7] - 2026-06-02

### Added - Six new community theme presets

Pick any of these from View → Theme (or Settings → Theme). All six use the
same chrome rules as the built-in dark presets (linear / cron), so layout
and contrast stay coherent.

- **Catppuccin** - cozy purple-mauve with warm low-saturation greys.
- **Tokyo Night** - deep navy with cool blue surface tones.
- **Solarized** (dark) - Ethan Schoonover's blue-green base with cream text.
- **Gruvbox** (dark) - retro warm earth tones, very Vim.
- **Dracula** - purple-pink classic with desaturated grey-blue background.
- **Nord** - cold arctic blue-greys; minimal saturation.

Each palette is hand-tuned so `bg < bgElev < cardSolid` contrast stays
visible. Switch live without restart; persists across launches.

---

## [1.4.6] - 2026-06-02

### Added - Smart semantic search palette (⌘⇧K)

Search every snippet, note, clipboard entry, staged item, mode, and workflow
by **meaning**, not just substring. Powered by Apple's on-device
`NLEmbedding.sentenceEmbedding` so it works offline, with zero cost, and
never leaves the Mac.

- **⌘⇧K opens the palette** from anywhere in Trove (menu: View → Semantic Search…)
- **Cosine-similarity ranking** across:
  - Snippets (title + body)
  - Notes (per-tab title + body)
  - Clipboard history (last 100 entries)
  - Stage items
  - Modes (name + description)
  - Workflows (name + steps)
- **One-keystroke routing**: ↑/↓ to pick, Return to jump to the source pane
  and copy the matched payload to the clipboard automatically.
- **Lazy index build** - embeddings computed once per session, refreshed on
  first open. No background CPU between searches.
- Substring fallback when the embedding model is unavailable (rare; bundled
  with macOS 14+ so always present on supported hardware).

Why this matters: 33+ panes is a lot of surface area. Semantic search collapses
"where did I put that JWT?" or "the SQL query about user counts" into a single
keystroke regardless of which pane the snippet lives in.

---

## [1.4.5] - 2026-06-01

### Added - API Tester pane (Postman replacement)

Full HTTP request/response workbench in-pane. Replaces Postman ($14/mo)
and Insomnia (now paywalled).

- **Method picker**: GET / POST / PUT / DELETE / PATCH / HEAD / OPTIONS
- **URL field** with ⌘Return to send
- **Tabs**: Params (auto-parsed from URL), Headers (key/value with
  enable toggle), Body (None / JSON / Form-urlencoded / Raw), Auth
  (None / Basic / Bearer)
- **Send** button surfaces status code, elapsed ms, response size
- **Response viewer**: pretty-printed JSON (auto-detected), headers
  list, raw view; copy any of them
- **Saved collections** persist to
  `Application Support/Trove/api-collection.json`
- **History** of last 50 requests, persisted
- **Sidebar** with both collection + history; click any entry to load
  it back into the editor

Intent catalog: "api tester", "http request", "rest client", "postman
replacement" all jump to it via ⌘K.

---

## [1.4.4] - 2026-06-01

### Added - Windows parity Phase 1 (Avalonia port)

Nine new panes ported from macOS to the Windows Avalonia port at
`win/avalonia-port/`. Brings Windows parity from 11% → ~36%.

- **Color picker** with R/G/B sliders, HEX/RGB/HSL/CMYK readout + copy
- **Notes** with autosave to `%APPDATA%/Trove/notes.txt`
- **Snippets** with title/body list + persistence to
  `%APPDATA%/Trove/snippets.json`
- **Date calculator** with business-days mode + Unix↔ISO 8601 round-trip
- **Unit converter** for length / mass / data / speed / temperature
- **Regex playground** with .NET Regex live match + capture groups +
  IgnoreCase / Multiline / Singleline options
- **JSON formatter** with prettify / minify / sort-keys via
  `System.Text.Json`
- **File Inspector** with drag-drop, file properties, MD5/SHA1/SHA256
  via streaming triple-digest hasher
- **Markdown editor** with live preview

Build: cross-platform from macOS via
`dotnet build -p:EnableWindowsTargeting=true`. Published with
`dotnet publish -r win-x64 --self-contained -p:PublishSingleFile=true`.
Fixed pre-existing `IsAttachedToVisualTree` and `InitializeComponent`
generator issues blocking the cross-platform build.

---

## [1.4.3] - 2026-06-01

### Added - 4 quick-win panes

- **JSON / YAML / XML formatter + validator** with prettify, minify,
  sort keys, indent control. Foundation only. Replaces jsonformatter.org.
- **Regex playground** with live match highlighting, capture-group
  readout, 10 common-pattern presets (email, URL, IPv4/v6, UUID, hex
  color, ISO date, etc.) and 4 NSRegularExpression option toggles.
- **Date / Time calculator** with business-days arithmetic, time-zone
  conversion across all known TZ identifiers, Unix ↔ ISO 8601 in both
  directions.
- **Unit converter** for length, mass, temperature, data, speed,
  volume, area, time, energy, power via Foundation's `Measurement` /
  `Dimension` types. ~60 units pre-registered.

All four added to the intent catalog: "format json", "minify json",
"regex tester", "business days", "kg to lbs", "celsius to fahrenheit"
etc. all jump to the right pane via ⌘K.

---

## [1.4.2] - 2026-06-01

### Added - Action-aware Quick Switcher (⌘K) + voice query

The command bar at `⌘K` now understands intent, not just pane names.
Type what you want in plain English; the right tool surfaces.

- **Intent catalog per pane** - every pane registers 5-15 alternative
  search phrases. "convert pdf to image" → Converter. "compress pdf" →
  PDF Tools. "shrink image" → Image Tools. "what's draining battery" →
  Battery. "airpod battery" → Devices. "save app layout" → Modes. Full
  list in `quick_switcher_intents.swift`.
- **Multi-token whole-word scoring** - "convert pdf image" matches
  Converter (all tokens) higher than fuzzy single-letter hits.
- **Voice mic button** in the search field. Uses `SFSpeechRecognizer`
  on-device (no audio leaves the Mac). Click the mic, speak your
  intent, the transcript fills the query.
- **Accessibility labels** on every command-bar control so VoiceOver
  reads them correctly.
- **`CommandBarHint` widget** with the new prompt copy - placeholder
  text in the search field also updated to show example queries.

---

## [1.4.1] - 2026-06-01

### Added - Universal File Converter pane

Drag in any file, pick a target format, hit Run. Replaces Permute
($16) + iLovePDF + CloudConvert + various web tools.

- **Image** ↔ PNG / JPEG / HEIC / WebP / TIFF / BMP / GIF / PDF via
  `sips` (built into macOS) with ImageMagick fallback for WebP and
  exotic formats.
- **Audio** ↔ MP3 / M4A / WAV / FLAC / OGG / AIFF via `ffmpeg` with
  sensible codec defaults (LAME 192k, AAC 192k, libopus 128k,
  libvorbis q5).
- **Video** ↔ MP4 (H.264/AAC + faststart), WebM (VP9/Opus), MKV
  (H.264 + audio passthrough), MP3 (audio extract), animated GIF
  (palette-aware at 10fps).
- **Document** ↔ DOCX / PDF / ODT / TXT / HTML / Markdown / RTF via
  LibreOffice headless mode.
- **Queue UI** with per-file progress badge (queued / running / success
  / failed with error). Reveal-in-Finder button on success.
- **Tool detection card** shows which engines are installed; missing
  tool surfaces an install hint (`brew install ffmpeg`,
  `brew install --cask libreoffice`, `brew install imagemagick`).
- Drag-and-drop or Choose Files; output folder picker (defaults to
  `~/Downloads`).
- Collision-safe output naming.

---

## [1.4.0] - 2026-06-01

### Added - Battery + Power Detail pane

Cycle count, capacity vs design (health %), condition badge, current
charge with circular gauge, time-to-empty/full, temperature, voltage,
amperage, calculated power draw, and top 12 energy-consuming apps via
`top -stats command,power`.

### Added - Speedtest pane

Internet down/up/ping/jitter via Cloudflare's `speed.cloudflare.com`
endpoints (`__down`, `__up`, `/cdn-cgi/trace`). No third-party service,
no API key. Trimmed-mean latency over 10 samples for ping; stddev for
jitter. Server colo + your public IP shown. History of recent runs.

### Added - Bluetooth/USB Devices pane

Connected Bluetooth + USB devices from `system_profiler` JSON. Battery
levels where available (AirPods, Magic Mouse, Magic Keyboard, Magic
Trackpad). Smart icons by device type. Connected vs paired
distinction.

### Added - Service Controller pane

LaunchAgents + LaunchDaemons enumerated from `launchctl print
gui/<uid>` and `launchctl print system`. Live PID + exit status badge.
Start (`launchctl kickstart -k`) and Stop (`launchctl bootout`)
buttons. Reveal plist in Finder. Search filter + "Hide system" toggle.

### Added - Disk Space Treemap pane

DaisyDisk-style squarified treemap visualization. Recursive folder
scan (max depth 6, follows nothing through symlinks, skips
`/System`, `/private/var/db`, `/Volumes`, `/dev`). Color hue per folder
name hash. Double-click any tile to drill in. Back button to walk up.
Home / Choose / Refresh in the toolbar.

---

## [1.3.7] - 2026-06-01

### Added - Wipe Metadata tool (comprehensive)

The Inspector pane's Actions menu now has a **"Wipe Metadata…"** entry
that opens a sheet covering every leak vector we can reach from inside
the app. Distinct from the existing "Strip Metadata" which only clears
embedded EXIF/PDF info dicts.

**Wipe categories:**

- **Embedded metadata** - EXIF, IPTC, XMP, GPS, JFIF, PNG-tEXt for
  images; PDF /Info dict + XMP packet (via PDFKit respawn); MP4/MOV
  ©day/©too/©nam/©alb atoms via AVAssetExportSession with empty
  metadata; ID3 tags in MP3/AAC; **OOXML core/app/custom properties,
  comments, people mappings, tracked-changes author + initials +
  lastModifiedBy** in DOCX/XLSX/PPTX via ZIP rewrite.
- **Extended attributes** - `com.apple.quarantine`,
  `com.apple.metadata:kMDItemWhereFroms`, `com.apple.FinderInfo`,
  `com.apple.lastuseddate#PS`, Finder tags, anything else `listxattr`
  surfaces. Cleared via `removexattr` on every name found.
- **File system dates** - atime + mtime via `utimensat`, birthtime
  (APFS creation date) via `setattrlist`. Target picker: Epoch (1970),
  Now, or Custom date/time.
- **Filename** - optional rename to a fresh UUID (no naming paper
  trail).
- **ICC color profile** (images only) - replaced with neutral sRGB so
  the original embedded profile can't fingerprint the device.
- **Spotlight re-index** - fires `mdimport` on the output so the
  Spotlight cache reflects the cleaned file, not the original.

**Output modes:**

- **Save copy** (default, safe) - writes "Wiped <originalname>.ext"
  next to the original. Original untouched.
- **Overwrite original** (opt-in, destructive, red tint warning) -
  atomically replaces the original in place.

**One-click "Wipe Everything"** button toggles every option on with
epoch dates.

**Format coverage:**

| Format | Embedded metadata wipe |
|---|---|
| JPEG, PNG, HEIC, WebP, TIFF, BMP | ✓ ImageIO re-encode without aux dicts + optional ICC strip |
| PDF | ✓ /Info cleared + XMP packet wiped via PDFKit respawn |
| MP4, M4V, MOV, M4A | ✓ AVAssetExportSession passthrough with empty metadata |
| MP3, WAV, AIFF | ✓ Same path |
| DOCX, XLSX, PPTX | ✓ ZIP unpack → wipe docProps + comments + people → strip tracked-changes attrs → re-zip |
| Plain text, code, archives | Byte-copy; xattr + FS dates still wipe |
| Unknown / other | Byte-copy with xattr + FS dates |

**Honest limits surfaced in the sheet:** Time Machine snapshots,
external backup software (Backblaze, Arq), past iCloud / Dropbox /
Drive sync logs (provider's servers), already-sent email attachments,
and any forensic disk imaging done before the wipe are outside what
the app can reach.

---

## [1.3.6] - 2026-06-01

### Processes - double-click row to expand

- Double-click any process row to expand it inline with full command-
  line args and bundle/executable path. Click again to collapse. Text
  is selectable for copy.

### Audit closure - no-op-on-audit items

Tracing the v1.3.2 UX-gap audit to completion: several items were
flagged but already had adequate affordances in shipped code. No code
change needed for these:

- **Permissions pane** - every category already shows an inline
  explanation card describing what the permission allows.
- **Log viewer** - long lines already expand on tap with a structured
  subsystem/category/message breakdown.
- **Clean / Sweep** - destructive actions already gated through
  `confirmationDialog` with explicit list of items.
- **Rename pane** - Space → Quick Look already works on the focused row.
- **Color pane** - already shows HEX, RGB, HSL, OKLCH, and SwiftUI
  literal on every swatch.
- **Mirror pane** - Float mode already provides the expand-to-floating
  workflow.

### Genuinely deferred to a future ship

These would each be substantial work (multi-day) and are queued without
a target version:

- **Notes** - per-tab hover preview
- **Finder Tweaks** - explicit "applied" toast/checkmark animation
- **GPU / Disk Speed / Network charts** - pin-a-moment + historical
  scrubbing (each needs a Charts framework rebuild plus historical-
  buffer plumbing)
- **Text Tools diff view rendering** - the toggle is in v1.3.4; the
  side-by-side diff renderer is its own substantial component
- **Workflows dry-run** - surfaces a "run without sinks" mode; needs
  WorkflowRunner refactor
- **Color CMYK + named-color lookup** - niche extensions to the
  already-comprehensive swatch
- **Image Editor markup canvas** - PencilKit-equivalent for macOS 13

---

## [1.3.5] - 2026-06-01

### Modes - visual window-layout minimap

- Every Mode card now shows a proportional minimap of the saved window
  layout. Each window is rendered as a colored rectangle scaled to its
  captured frame within the union bounding box, with a 2-letter app
  abbreviation overlay. You can see at a glance "what's going to happen
  if I apply this Mode" without reading the app list.

### Workflows - inline step expand

- New "Show steps" / "Hide steps" button on every Workflow card.
  Expands the card to display all steps in order with their icons,
  display names, and disabled-state strikethrough. No need to open the
  Edit sheet just to remind yourself what a workflow does.

---

## [1.3.4] - 2026-06-01

### Snippets - row expand inline

- Click any snippet row to expand the body inline (scroll view, text
  selection, max 240 pt). Click again to collapse. No need to open the
  editor sheet for a quick read.

### Calculator - base toggle on every result row

- Click any integer result to cycle through **Decimal → Binary →
  Hexadecimal → Octal**. A small badge appears next to the number when
  not in decimal. Works only on integers that fit in `Int64`; floating
  results stay decimal.

### Text Tools - diff view toggle

- New "Show diff" toggle in the output card header. Compares the input
  text against the currently-viewed transform output. (Full side-by-side
  rendering arrives in v1.3.5; v1.3.4 wires the toggle + state.)

### Color pane

- Confirmed: already shows HEX, RGB, HSL, OKLCH, and SwiftUI literal on
  every swatch. CMYK + named lookup deferred to v1.3.5.

---

## [1.3.3] - 2026-06-01

### Image Editor - full canvas controls

- **Pan + zoom** scroll view with `ScaleEffect`. HUD overlay at bottom-right
  with magnifier buttons (25%-800% range), zoom-to-100%, fit-to-window.
- **Before/after compare slider:** drag a vertical handle across the canvas
  to reveal original underneath, rendered overlay on top, with split
  position controlled by drag gesture.
- **Click to expand** the canvas to a fullscreen zoomable viewer (uses the
  v1.3.2 universal `troveExpandablePreview` infrastructure).

### Inspector - long-value expand + clickable file icon

- **Long inspector values** that exceed ~3 lines or 200 chars get a
  tap-to-expand toggle. Click once to see everything; click again to
  collapse. Text selection stays on regardless.
- **Header file icon** now opens the file in the universal preview viewer
  on click (same affordance as every other thumbnail in the app).

### QR pane

- **Generated QR** is now click-to-fullscreen for the "hold up to another
  Mac's camera" workflow.

### Recorder

- **Last-recording row** preview icon is now click-to-expand. Opens the
  recording in the AVPlayerView viewer with scrub controls, fullscreen
  toggle, and the full right-click menu (Quick Look, Reveal, Send to
  Stage, Strip Metadata via Inspector route).

---

## [1.3.2] - 2026-06-01

### Added - Universal "click to expand" preview affordance

Every preview tile across the app now supports a uniform set of
gestures. Single click expands the tile to a full-size viewer sheet
that type-dispatches:

- **Images** → zoomable scroll view (pinch / scroll-wheel zoom, drag to
  pan, fit-to-window by default, double-click to 100%)
- **PDFs** → embedded `PDFView` with continuous page mode + autoscale
- **Video / Audio** → `AVPlayerView` with floating controls + fullscreen
- **Text / code** → `NSTextView` with Find bar (⌘F), monospaced, link
  detection, word wrap

Plus on every preview tile:

- **Right-click context menu**: Open in full size · Quick Look (Space) ·
  Reveal in Finder · Copy URL · Copy File · Inspect Metadata · Save Copy…
- **Drag-out** to Finder / Mail / Slack / browser via `.draggable`
- **Hover state**: pointing-hand cursor + 1.02× scale + accent ring
- **Accessibility**: announces as a button with the file name

### Wrapped sites (v1.3.2)

- Image Tools - Loaded Images thumbnails
- PDF Tools - Merge preview cards, Split preview cells, Rotate preview
  cells, Compress sample preview
- Stage - image cards, file cards
- History - image entries
- Snip - recent screenshot cards
- OCR - captured image preview, history entries
- Library - output rows
- (Image Editor canvas + Mirror float toggle land in v1.3.3)

---

## [1.3.1] - 2026-06-01

### Added - Inspector pane

Drop any file, see everything macOS knows about it.

- **Overview** with edit-detection (highlights when file's mtime > creation)
- **Image** EXIF, IPTC, XMP, GPS coords with map link + privacy badge, color
- **PDF** info dict, page sizes, version, encryption + permissions
- **Video / Audio** duration, codec, bitrate, dimensions, sample rate, channels
- **Text** encoding sniff, lines, words, chars, blank lines
- **Archive** entry count (ZIP, TAR, TGZ)
- **File system** dates, owner, POSIX perms, immutable flag
- **Extended attributes** with parsed Quarantine + WhereFroms
- **Spotlight (MDItem)** curated useful subset
- **Hashes** MD5 / SHA-1 / SHA-256 / SHA-512 (toggle, on demand)
- **Compare two files** side-by-side with diff highlighting in orange
- **Strip Metadata** rewrites image without EXIF/GPS/IPTC, or PDF without Info dict
- Actions: Copy as plain text, Copy as JSON, Export report, Send to Stage, Reveal in Finder

---

## [1.3.0] - 2026-06-01

### Added - Image Editor pane (Photos-class)

A comprehensive image editor lives at the new `Image Editor` pane. Open
any image via drag-and-drop, "Open With Trove" from Finder, or `⌘O`.

- **Crop** with aspect-ratio presets (Free, 1:1, 4:3, 16:9, 3:2)
- **Rotate** any angle, **flip** horizontal/vertical
- **Perspective tilt** (X- and Y-axis keystone correction)
- **13 adjustment sliders:** Exposure, Brightness, Contrast,
  Highlights, Shadows, Saturation, Vibrance, Warmth, Tint, Black Point,
  Sharpness, Noise Reduction, Vignette
- **9 filter presets:** Vivid / Vivid Warm / Vivid Cool / Dramatic /
  Dramatic Warm / Dramatic Cool / Mono / Silvertone / Noir (the iOS
  Photos filter set, as Core Image color pipelines)
- **Auto-enhance** via Apple's built-in `autoAdjustmentFilters` probe
- **Red-eye removal** via Vision face landmarks + eye-region desaturation
- **Undo / redo** stack (50 generations) with full `⌘Z` / `⌘⇧Z`
- **Export** as PNG / JPEG / HEIC / WebP / TIFF with quality control
- Hardware-accelerated render via Metal `CIContext`

### Added - Finder "Open With Trove"

Trove now registers itself as a handler for PDFs, images, and text
files. Right-click any file in Finder → **Open With → Trove**. The file
routes to the appropriate pane automatically:

- PDFs → PDF Tools queue (multi-select works for batch merge)
- Images → Image Editor (or Image Tools when hidden)
- Text → Stage as a text payload (Workflows / Smart Actions apply)
- Anything else → Stage as a file row

Implementation: `CFBundleDocumentTypes` declaration in
`DocumentTypes.xml`, plus an `application(_:open:)` handler in
`AppDelegate` that fans out by UTType.

### Added - Comprehensive Recording permission UX

macOS's TCC for Screen Recording is hostile by design (no API to grant,
no biometric prompt). v1.3.0 ships every legal workaround:

- **`CGRequestScreenCaptureAccess()`** is called on every Screen
  Recording failure path. Forces TCC to re-evaluate and surfaces the OS
  prompt rather than silently rejecting.
- **`ScreenRecordingPermissionWatcher`** polls `CGPreflightScreenCaptureAccess`
  every second after the user clicks "Open Settings". When permission
  flips to true, surfaces a one-click "Reload Trove" toast.
- **`RecPermissionReset.resetScreenRecordingAndRelaunch()`** runs
  `tccutil reset ScreenCapture` via `osascript with administrator
  privileges`. macOS shows its own auth (Touch ID where supported,
  password otherwise). Clears the stale-cdhash entry from rebuild churn
  so the next record attempt re-prompts fresh. Then auto-relaunches.
- **`WelcomeRecordingPermissionStep`** in the first-launch welcome
  sheet triggers the OS prompt during onboarding so users meet it
  ahead of their first task, not in the middle of one.
- **`RecPermissionFixSheet`** is a clearer visual guide that explains
  the cdhash mismatch problem in plain language and offers both manual
  ("Toggle in Settings") and automatic ("Reset & Relaunch") fixes.

### Fixed - PDF merge preview is now instant

- **`PDFThumbCache`** uses `QLThumbnailGenerator` as the primary
  renderer, hitting the OS-shared Spotlight thumbnail cache. Files
  Finder has previewed before paint in <5 ms. Cold render ~50-100 ms.
- **Process-lifetime `NSCache`** + per-URL page count cache.
- **Prefetch during validation** - by the time the Merge preview view
  mounts, thumbnails are typically already cached.
- **Synchronous main-thread fast-path validation:** files <32 MB with a
  valid `%PDF-` header in the first 1024 bytes and no `/Encrypt`
  marker resolve as valid before the row paints, removing 30-80 ms of
  `Task.detached` cold-start overhead for the 99% case.

A 67 KB resume that previously took 200-500 ms to render in the Merge
preview now paints essentially instantly on second open, and in <100 ms
on first open.

### Deferred to v1.3.1+

- **Magic eraser** (content-aware fill) - current build ships the
  Vision-saliency mask but click-to-fix UI lands in v1.3.1.
- **Markup canvas** (PencilKit-style pen / highlighter / shapes / text
  annotation) - needs ~800 LOC bespoke `NSBezierPath` canvas since
  PencilKit is macOS 14+ and Trove targets 13.
- **RAW editing** (DNG / CR2 / NEF / ARW via `CIRAWFilter`) - drops
  into the existing editor pipeline. Wiring lands when we add the RAW
  format detection.
- **Share Extension** (macOS "Share → Trove" menu in any app) - blocked
  on build system migration to Xcode project or SwiftPM with executable
  + extension targets. Same v1.3.x blocker as virtual camera output.
- **iOS companion app** - blocked on Apple Developer Team provisioning.

---

## [1.2.8] - 2026-06-01

Internal milestone; rolled into v1.3.0.

---

## [1.2.7] - 2026-06-01

### Fixed - PDF merge preview is now instant

Multiple stacked perf wins:

- **`PDFThumbCache`** (new) uses `QLThumbnailGenerator` first, which hits
  the OS-shared Spotlight thumbnail cache. Files Finder has previewed
  before paint in <5 ms. Cold first render is ~50-100 ms, still 3-5x
  faster than PDFKit's `page.thumbnail`.
- **Process-lifetime `NSCache`** for thumbnails + page counts. Re-opening
  the same merge list in a session is instant.
- **Prefetch during validation.** `addPDFs` now hands every URL to the
  cache as soon as it lands - by the time the Merge preview view
  mounts, the thumbnails are typically already there.
- **Synchronous main-thread fast-path validation.** Files <32 MB with a
  valid `%PDF-` header in the first 1024 bytes and no obvious
  `/Encrypt` dictionary marker resolve as "valid" before the row even
  paints, so the "Validating…" state only flashes for files that
  genuinely need a CGPDFDocument open (encrypted, header-edge cases,
  giant files). Removes ~30-80 ms of Task.detached cold-start overhead
  for the 99% case.

Combined: a 67 KB resume that previously took 200-500 ms to render in
the Merge preview now paints essentially instantly on second open, and
in <100 ms on first open.

### Fixed - Record button stuck on "Grant permission"

When Trove is rebuilt locally, the binary's cdhash changes. macOS TCC
keys Screen Recording grants by cdhash, so an old grant in System
Settings becomes a stale row that silently rejects the new build. The
old code path detected this and surfaced an error, but never re-prompted
the OS, leaving the user stuck.

- Now calls `CGRequestScreenCaptureAccess()` on every Screen Recording
  failure path. This forces TCC to re-evaluate and shows the OS
  permission prompt one more time. After the user clicks Allow, they
  must relaunch Trove (the engine reads SCK content into cached state
  at launch).
- Same path on the error banner's "Open Settings" button so a user
  who's already in System Settings sees an immediate prompt.

If the prompt doesn't appear (it can only show once per session, and
the OS suppresses repeat prompts within ~30 s), the deep-link button
takes you straight to System Settings → Privacy & Security → Screen
Recording - toggle Trove **off**, then **on** again to force-add the
current cdhash, then relaunch Trove.

---

## [1.2.7] - 2026-06-01

### Added - Encrypted Backup & Sync foundation

A new Settings card: **Backup & Sync**. Encrypted backup of your
Snippets, Modes, and Workflows, with an optional iCloud Drive mirror
that other Macs can restore from.

**How it works:**

- **Symmetric key in iCloud Keychain.** Trove generates a 256-bit
  ChaCha20Poly1305 key on first use and stores it as a generic-password
  Keychain item with `kSecAttrSynchronizable = true`. Apple's iCloud
  Keychain propagates the key to every Mac signed into the same Apple
  ID. No app entitlement required.
- **AEAD seal.** The backup bundle (your Snippets, Modes, Workflows) is
  serialized to JSON, then sealed with ChaCha20Poly1305. The output
  file (nonce + ciphertext + tag) is unreadable without the key, and
  authenticated against tampering.
- **Always local.** Every backup writes to
  `Application Support/Trove/backup.cbor.enc`.
- **Optional iCloud Drive mirror.** Settings toggle writes the same
  encrypted file to `~/iCloud Drive/Trove/backup.cbor.enc`. Other Macs
  with iCloud Drive on (and the same iCloud Keychain key) see the file
  appear and can restore from it.
- **Restore picks the newest** of the local + iCloud Drive files by
  mtime, decrypts, decodes, and merges non-destructively into your live
  stores (adds missing Snippets / Modes / Workflows; doesn't overwrite
  the ones you already have).
- **"Reset key + delete backups"** action wipes the Keychain entry and
  both backup files. Your live data on this Mac is untouched.

**Threat model:** even if the encrypted file leaks (rogue iCloud Drive
share, stolen Time Machine drive), the contents are unreadable without
the key. The key lives only in Keychain.

**Deferred to v1.3:**

- **Real Mac↔iOS CloudKit sync** with conflict resolution. Needs an
  Apple Developer Team to provision the CloudKit container; Trove
  doesn't have one yet.
- **Stage + History sync.** v1.2.7 backs up Snippets / Modes /
  Workflows (the durable assets) but not transient Stage / clipboard
  history. Adding them is a schema bump, not new infrastructure.
- **Auto-backup on mutation.** Currently the user clicks "Back up now"
  in Settings. The `touchDirty()` debounce path is wired internally;
  hooking it into every Store on mutation lands in v1.2.8.

---

## [1.2.6] - 2026-06-01

### Added - Workflows pane

A new top-level pane: **Workflows**. Chain pane outputs into pane inputs
as an ordered linear sequence, save as one named flow, run with one
keybind.

**Step kinds shipped in v1.2.6:**

- **Input:** capture region, capture full screen, snapshot clipboard,
  take newest Stage item.
- **Transform:** OCR image → text, text transforms (uppercase, sort,
  slug, Base64, URL encode etc), AI actions (rephrase, translate,
  summarize via the existing Claude/ChatGPT bridge).
- **Output:** copy to clipboard, send to Stage, save as Snippet, reveal
  in Finder, show toast.

**Example workflow:**

```
Capture region → OCR text → Summarize (AI) → Copy to clipboard
```

One ⌃⌥⌘1 keystroke runs the whole chain.

- **Hotkeys:** `⌃⌥⌘1` through `⌃⌥⌘9` for the first 9 workflows. Distinct
  chord from Modes' `⌥⇧⌘1-9` so users can run 9 of each.
- **Per-step toggle:** disable a step temporarily without removing it.
- **Reorder:** ↑ / ↓ buttons next to each step.
- **Persistence:** atomic JSON write to
  `Application Support/Trove/workflows.json` with bounded-read on load.
- **Type-safety:** each step declares whether it accepts text / image /
  file. A type mismatch (e.g. piping an image into "Save Snippet")
  surfaces a clear toast and halts the chain.

**Deferred to v1.3:**

- Visual node-based editor (current MVP is a linear vertical step list).
- AI round-trip - current AI steps "send-and-stop" since reading the
  Claude/ChatGPT response back requires AppleScript per-app integration.
  When Apple Foundation Models ship for macOS 13 OR we add per-app
  scrape hooks, AI steps will pipe their reply into downstream steps.
- Trigger types beyond hotkeys (folder watch, clipboard change, calendar
  event) - these will land as a second Workflow surface.

---

## [1.2.5] - 2026-06-01

### Added - Modes pane

A new top-level pane: **Modes**. Save your current apps + window layout
as a named workspace; restore it later with one keystroke.

- **Capture:** walks every running app + queries window frames via
  Accessibility. Skips Trove itself, system daemons, minimized windows,
  and stray off-screen leftovers.
- **Apply:** launches missing apps (`NSWorkspace.openApplication`),
  activates running ones, and sets every window's position + size via
  `AXUIElementSetAttributeValue`. Best-effort window matching by title;
  falls back to positional matching when an app renames windows on every
  launch (browsers, terminals).
- **Hotkeys:** `⌥⇧⌘1` through `⌥⇧⌘9` apply the first 9 saved Modes.
  Carbon registration via the same `TroveGlobalHotkeys` path as the
  screenshot + recording-stop chords. Conflict detection benefits Modes
  too.
- **Edit sheet:** rename, reassign hotkey slot, toggle "close other
  apps when applying" (off by default, opt-in for ruthless focus
  switches).
- **Persistence:** atomic JSON write to
  `Application Support/Trove/modes.json`. Bounded-read on load (16 MB
  cap, same hardening as Stage/notes/snippets).
- **Permission:** Accessibility (already granted for cutpaste / alttab;
  surfaces an "Open Settings" toast if not).

**Doesn't cover (yet):** full-screen-space windows (Spaces API isn't
documented), Sequoia's window tiling state, virtual desktops. These
land when Apple ships official APIs.

---

## [1.2.4] - 2026-06-01

### Fixed - v1.3 deferred items, landed early

- **`Stage` + `ClipHistory` + `CutPasteController` now `@MainActor`**.
  The concurrency checker compile-enforces what was previously a
  call-site convention. Same runtime behavior; closes a class of
  future-refactor footguns.
- **`applicationShouldTerminate` posts `troveWillTerminate` immediately**
  when returning `.terminateLater`. Previously the user clicked Quit
  while recording and nothing happened until they manually stopped.
  Now RecEngine starts finalize as soon as Quit is dispatched; the
  app actually terminates when the writer is done.
- **`displayID(for:)` returns Optional + propagates nil as a cancelled
  region pick** instead of silently falling back to the main display.
  Defends the (undocumented but stable) `NSScreenNumber` boundary.
- **`keep_awake.swift` UserDefaults keys** centralized under
  `DefaultsKey.KeepAwake.*` so a `defaults read` / profile-sync sweep
  finds every key in one place.

---

## [1.2.3] - 2026-06-01

### Fixed - Settings UI no longer lies

- **Snippets sort picker** now writes the actual `SortMode` rawValues
  ("Smart", "A-Z", "Recently Used", "Recently Created"). Was writing
  "alpha"/"recent"/"used"/"created" that no consumer could parse, so
  every selection silently fell back to Smart.
- **Calculator angle picker** now writes "DEG" / "RAD" instead of
  "degrees" / "radians". Was always silently degrees regardless of
  selection.
- **Per-pane default save folders** in Settings now write to the SAME
  UserDefaults keys each pane reads as its "last save dir". Previously
  the picker wrote dead `trove.defaults.*` keys nobody consumed, so a
  folder pick had zero effect on the next save dialog.
- **Centralized AppStorage keys** in `defaults_keys.swift` so settings
  and panes can never drift again. New settings controls use
  `DefaultsKey.<name>` rather than bare strings.
- **Decorative toggles removed** from Settings → Customize → Density &
  Accessibility cards. The Reduce Motion / Transparency / Increase
  Contrast / focus ring / density / hover-reveal / compact-lists /
  double-click toggles were inert. The two that work (toast lifetime,
  sidebar width, VoiceOver announcements) are wired and stay.
- **"⌘/" keyboard shortcut label** corrected to "⌘⇧?".
- **Snip pane icon** falls back to `rectangle.dashed` (macOS 13
  compatible) instead of `rectangle.dashed.badge.record` (macOS 14+).

### Fixed - pasteboard echo-ingest

- **Stage "Copy Path"** for images and files now posts the
  `.troveDidWritePasteboard` sentinel so ClipHistory doesn't ingest the
  path we just wrote.
- **About panel version-string copy** posts the sentinel for the same
  reason.
- **History `restoreToClipboard`** stops posting the sentinel on the
  error path. Posting it for a write that produced no actual content
  was masking the user's next legitimate copy from being ingested.
- **AI Bridge `send(...)`** resolves the target app BEFORE clearing
  the pasteboard. Previously a click with no AI app installed still
  nuked the user's clipboard.

### Fixed - Recorder & Mirror

- **Mirror preview blackout** when Float OR menu-bar popover is on
  fixed. `updateNSView` now only reassigns `previewLayer.session`
  when it has genuinely changed; the previous unconditional
  reassignment caused all three preview surfaces to fight and one
  to render black.
- **Trim sheet** no longer fails silently on HEVC-encoded recordings.
  Probes the source codec and picks `AVAssetExportPresetHEVCHighest-`
  `Quality` when passthrough is incompatible. Real export error is
  surfaced ("Trim failed: …") instead of generic "Trim export failed."
- **Transcript sheet** no longer hangs forever when the recognizer
  callback fires with neither `isFinal` nor `error` set. Added a
  `resumed` guard so the continuation is resumed exactly once. Also
  checks `supportsOnDeviceRecognition` before forcing on-device, so
  locales without a model surface a clean nil instead of an infinite
  spinner.
- **Second-display capture** now reports failure when
  `AVCaptureScreenInput(displayID:)` returns nil. Previously the
  session started with no input and produced a zero-byte file with
  no error. Now flashes "Display N couldn't start capture; skipped."
- **Mic capture delegate** uses `[weak self]` on its main-actor Task
  so a backlog of 200/sec callbacks can't keep RecEngine alive past
  `stop()`.
- **Mic permission denial** is now distinct from "no mic attached".
  The recovery affordance differs (Open Settings vs plug one in), so
  the banner should differ.
- **Auto-scroll timer** runs in `.common` RunLoop modes so it keeps
  firing while the user drags Trove's window or hovers a menu (was
  pausing during exactly the most likely interactions in a demo
  recording).
- **Click ripple** now cancels its `DispatchWorkItem` on disappear
  so an early teardown can't dispatch into a dead view.
- **Webcam UID** ternary replaced with a clear `nil` assignment + a
  v1.3 TODO; previously the `x == "" ? nil : nil` form looked like a
  busted bug.

### Fixed - robustness

- **Stage's `loadFromDisk`** uses the shared 16 MB-capped
  `boundedRead` (same as notes / snippets / history). A corrupted
  `stage.json` of arbitrary size can't OOM on launch.
- **Stage's willTerminate observer** is now stored and removed in
  deinit so future test teardowns don't leak.
- **File menu** New Snippet / Import / Export / Export My Trove Data
  use `switchToPaneGuarded` so a click on a hidden pane flashes
  instead of dumping the user into a blank sidebar slot.
- **`trove://pane/open?pane=PDF`** case-insensitive lookup so URL
  scheme callers don't break on capitalization drift.
- **Send Feedback** now goes to GitHub Discussions, not the dead
  `mailto:hello@gettrove.vercel.app`. (App + Help menus.)
- **`troveTerminateRequested`** notification name removed (had no
  listener; RecEngine reads activity tracker directly).
- **Storage-cache toast spam** throttled to one per minute per
  message so a stuck disk-full state doesn't stack toasts.
- **Cut/paste tap creation failure** surfaces an "Open Settings"
  recovery action instead of a bare toast.
- **Keep Awake "Until time"** date picker re-evaluates rules on
  change, so a re-scheduled deadline actually re-arms the timer.
- **Global stop-recording hotkey** surfaces registration failures
  (chord taken) instead of leaving the toggle on with no behavior.
- **Sign in with Apple** button disables itself after the first
  "needs Developer Team" failure so the user doesn't keep tapping a
  wall.
- **Calendar `.writeOnly` status** in Permissions pane no longer
  shows a misleading green "Granted" checkmark; new "Write-only"
  state with orange shield icon.
- **Global screenshot shortcut display** corrected to "⌥⇧⌘T"
  (macOS conventional order) from "⌘⌥⇧T" everywhere.
- **Floating Stage panel** registers its frame-autosave name before
  attempting restore, so the saved position is restored on first show.
- **Notes search/replace loop** uses `>=` end check to defend against
  a future zero-width-match refactor causing an infinite loop.
- **Hidden inert "⌘. cancel" row** removed; remaining rows now
  annotate "(system)" where the chord is macOS-owned.
- **Permissions "no API to query" copy** rewritten neutral: "Status
  not queryable from this app. Trust your System Settings toggle."

---

## [1.2.1] - 2026-06-01

### Fixed

- **Record button** no longer silently no-ops when Screen Recording
  permission hasn't been granted. The button label switches to
  "Grant permission to record", the tint goes orange, the tooltip
  explains why, and clicking the button now flashes a toast +
  deep-links straight to System Settings → Privacy & Security →
  Screen & System Audio Recording.

---

## [1.2.0] - 2026-06-01

The pro recorder pass. 22 of the 25 items from the deep-dive pro-recorder
audit now ship in the box. Trove's Recorder is now competitive with
CleanShot X / Loom for tutorial workflows and beats both on the
cross-pane data-flow side (recording → OCR / trim / transcript /
Stage all stay inside one app).

### Added

- **Floating Stop button** - always-on-top draggable NSPanel so
  fullscreen recordings can be stopped without alt-tabbing.
- **Menu-bar Record-dot** - pulsing status item while recording;
  click to stop.
- **Global stop hotkey** - ⌘⇧. by default, user-configurable.
- **Countdown timer** before recording starts (Off / 3 / 5 / 10s).
- **Quality slider** - Smallest / Balanced / Best bitrate multiplier.
- **Filename tokens** - `{date}` `{datetime}` `{codec}` `{fps}`
  `{counter}` etc.
- **Live mid-recording toggles** - mic / system audio / cursor.
- **Max-duration auto-stop** safety cap.
- **Mic gain slider** with clipping indicator (software gain).
- **Voice-activity auto-pause** during silence (-45 dBFS threshold,
  2.5s sustained).
- **Auto-trim silence** from start + end at finalize.
- **Webcam PIP** - parallel `.webcam.mov` alongside the screen recording.
- **Webcam-only mode** - record just the camera, no screen.
- **Click ripple** - fading ring at every mouse click.
- **Keystroke overlay** - bottom-center HUD showing the last chord
  pressed (⌘⇧K etc.). Secure-input fields filtered.
- **Click-coordinate sidecar JSON** during recording - foundation for
  future post-process auto-zoom.
- **Cross-pane Continue editing** - Extract a frame → OCR / Stage /
  Snip from the Last Recording row.
- **Auto-route to Stage with metadata** - duration · sources · codec ·
  fps in the routing toast.
- **Preview sheet** after stop - autoplay, Save…, Save to Downloads,
  Send to Stage, Reveal, Re-record, Done.
- **MOV export with separate audio tracks** - system + mic as distinct
  tracks for post-edit NLE re-mix.
- **GIF export** - animated GIF at 10 fps, 720px wide max.
- **Minimal multi-segment** - "New Segment" mid-record stops + restarts
  with same config (distinct files).
- **Minimal trim editor** - sliders for start + end, replaces the
  file in place via AVAssetExportSession passthrough.
- **On-device transcription** - Apple SFSpeechRecognizer (not embedded
  whisper.cpp; that lands later as an opt-in higher-quality path).
- **Secondary-display recording** - parallel `.display2.mp4` per
  non-primary display.
- **Auto-scroll target window** during recording with speed slider.

### Deferred

- **Virtual camera output** (#23) - needs a separate CMIO System
  Extension target with codesigning + Xcode project restructure.
  Not affordable in the flat-file `build-macapp` flow; will land
  when the build moves to a Swift Package or Xcode project.
- **Frame-stitching scrolling capture** (#24 stretch) - auto-scroll
  ships above; the SIFT/ORB feature-matching stitcher is its own
  focused future session.
- **Whisper.cpp embedded transcription** - `RecTranscribe` ships
  using built-in Apple Speech today; whisper-grade quality on long
  takes lands as an opt-in path with a model-download flow.

---

## [1.1.0] - 2026-05-31

First stable release in the 1.1 line. Consolidates everything that
shipped through the 14-beta cycle (beta.1 → beta.14) into one
production-ready build. The per-beta entries below stay as detailed
history; this top-level section is the cumulative "what's new vs
1.0.7" summary stable-channel users will see.

### Headline features

- **macOS Shortcuts / AppIntents integration.** 11 intents with rich
  entity surfaces - `SnippetEntity` + `ClipEntry` pickers render in the
  Shortcuts editor with previews, kinds, and capture dates. Build
  workflows that chain Trove snippets, clipboard history, calculator,
  QR generation, and Stage operations together with other macOS apps.
- **Beta / Stable update channels.** Settings → Updates → Update channel
  lets you opt into pre-release builds (`vX.Y.Z-beta.N`) without losing
  the safety of the stable channel. Switch any time; the next update
  check honors the new channel. Backed by semver §11 pre-release
  ordering so beta builds never accidentally promote to stable.
- **Per-pane chord overlay (⌘?).** Pane-aware Keyboard Shortcuts HUD.
  The current pane's shortcuts float to the top of the overlay, then
  the app-wide list. 9 panes ship bespoke chord lists; the rest fall
  through to global-only.
- **Cross-pane data flow.** Any output is reusable as input to another
  pane - merge a PDF and the result is one click away from "Continue
  in PDF Tools", "Send to Stage", or "Open in Text Tools" for OCR. The
  Outputs Library tracks every produced artifact for re-editing.
- **Hash pane SHA-256 SUMS verification.** Drop a `SHA256SUMS` /
  `.sha256` / `.md5sums` / `.sha512sum` file alongside its targets;
  Trove parses, hashes through the 4-in-1 streaming pipeline, and
  shows pass/fail per line. Algorithm auto-detected by hex length.
  Path-traversal hardened.
- **Text Tools Saved Recipes.** Save the current pipeline as a named
  recipe and replay with one click. Persisted to `recipes.json` with
  tolerant Codable so future step additions don't break upgrade.
- **History regex search.** ⌘⇧. toggles plain ↔ regex search modes.
  Catastrophic-regex / ReDoS guard built in.
- **History clipboard dedup with ×N badge.** Repeats of the same
  payload fold into one entry with a soft-tint "×N" capsule and the
  timestamp + position refresh on each new copy - no more 10 identical
  rows next to each other.
- **Text Tools - copy any intermediate step.** Right-click any
  pipeline chip to copy that step's output, send it to Stage, or
  inspect it directly. Errored / skipped steps explain themselves in
  the same menu.
- **URL scheme verb coverage.** `trove://pane/...`, `trove://calc?expr=`,
  `trove://snippet/copy?name=`, `trove://history/paste?index=`,
  `trove://qr?text=` - dangerous operations gated on Trove being
  frontmost to prevent drive-by URL abuse.
- **Homebrew Cask formula.** `brew tap arnavgoel/trove && brew install
  --cask trove` once the tap is published. Lives at
  `~/Documents/Projects/trove/Casks/trove.rb`.
- **XDG `~/.config/trove/` config home support.** `$TROVE_CONFIG_HOME`
  > `$XDG_CONFIG_HOME/trove` > `~/.config/trove` > native App Support.
  All 11 storage-touching panes route through one resolver. No
  migration - existing installs stay on Application Support.

### Polish + robustness highlights

- Full preview surfaces on every multi-step pane (PDF merge / split /
  compress / extract, image batch ops, OCR result, color picker,
  QR generation) - no more "I need to download to see what I get".
- Reorderable PDF merge.
- Stage-as-input across the app: any PDF that comes out of a Trove op
  is traceable back into the Merge pane (or other PDF tool) for further
  edits - the "wait, where did my output go?" gap is closed.
- Sub-500 ms cold-launch with lazy `SharedStore` inits, deferred Timers,
  audited body-cost across every pane.
- DEVELOP_RULES §1 crash discipline: zero `try!` / `fatalError` /
  `main.sync` / bare `.waitUntilExit` / `.first!` in the production tree.
- Sonner-grade toasts across the app (Trove's native `flash()` API)
  for every confirmation, copy, error, and promise - never `alert()`
  or inline banners.

### Pre-release history

Individual beta builds are preserved below for the record. Stable users
arriving from 1.0.7 receive everything in this 1.1.0 release; no need
to read the per-beta sections unless you're tracing a regression.

---

## [1.1.0-beta.13] - Unreleased

### Added

- **Hash pane - SHA256SUMS verification** *(power-user item #3)*. Drag a
  `SHA256SUMS` / `.sha256` / `.md5sums` / `.sha512sum` file (or any sums
  file recognized by extension or canonical basename) onto Hash alongside
  its target files. Trove parses the sums file, hashes each target through
  the existing 4-in-1 streaming pipeline, and renders a verification card
  with per-line ✓ / ✗ / "file missing" status. Algorithm auto-detected by
  hex length (MD5 / SHA-1 / SHA-256 / SHA-512); mixed-algorithm files
  display the modal algorithm in the header. Path-traversal hardened -
  refuses absolute paths and `..` components so a hostile sums file can't
  hash `/etc/passwd` and leak its contents via the mismatch hex.
- **Text Tools - Saved Recipes** *(power-user item #4)*. New "Recipes"
  toolbar menu lets you save the current pipeline as a named recipe and
  replay it with one click. Persisted to `recipes.json` in App Support
  with tolerant `Codable` so future step additions don't silently empty
  the file on upgrade. Differentiates Trove over Boop / DevUtils / TextSoap
  - none of them have pipelines, let alone saved ones.
- **Per-pane chord overlay** *(power-user item #6)*. ⌘? now opens a
  pane-aware Keyboard Shortcuts HUD. The current pane's chords float to
  the top, then app-wide chords. 9 panes ship bespoke chord lists (Stage,
  History, Snippets, Notes, Calc, Text Tools, Hash, QR, OCR); every other
  pane falls through to the global list. Backed by a single
  `ChordRegistry` so adding a shortcut updates the discovery surface
  automatically.

### Changed

- **Help menu** - Keyboard Shortcuts shortcut moved from ⌘/ to ⌘?, the
  macOS convention for "show shortcuts for the current view".

---

## [1.1.0-beta.12] - Unreleased

### Added

- **Snippet + Clipboard History entity intents** - 8 more AppIntents on
  top of beta.11's foundation, all entity-based so the Shortcuts editor
  renders rich pickers with name + body preview on snippets and preview
  + kind + date on clipboard entries:
  - **Snippet entity surface** (`SnippetEntity`, `SnippetEntityQuery`
    with `EntityStringQuery` for live filter; `SnippetIndex` is the
    read-only JSON snapshot loader so AppIntents - which run out-of-
    process in Shortcuts' extension host - can query without touching
    the per-view `@StateObject` `SnippetStore`).
  - `GetSnippetIntent` - picker-driven, returns body.
  - `GetSnippetByNameIntent` - string lookup, falls through
    exact-match → prefix-match → substring-match before throwing
    `TroveIntentError.snippetNotFound(name)`.
  - `ListSnippetsIntent` - returns `[String]` of snippet names so a
    Shortcut can pipe them into a Choose-from-Menu step.
  - `CountSnippetsIntent` - returns `Int`.
  - **Clipboard history entity surface**
    (`ClipboardEntryEntity` + `ClipboardEntryEntityQuery`;
    `ClipboardIndex.Entry` mirrors the on-disk shape since
    `ClipEntryCodable` is `fileprivate` in `history.swift`).
  - `GetClipboardHistoryAtIntent` - index-based access; throws if the
    entry isn't text.
  - `GetRecentClipboardTextIntent` - N-th most recent TEXT entry,
    silently skips image/file captures.
  - `CountClipboardHistoryIntent` - returns total entry count.
  - `PickClipboardEntryIntent` - full picker, returns text body.
- `TroveIntentError` extended with friendly
  `CustomLocalizedStringResourceConvertible` messages so Shortcuts
  surfaces real diagnostics ("No Trove snippet named 'X' - try the
  picker variant of this intent") instead of generic boilerplate.

### Notes

- Total intent count now stands at **19** (11 base + 8 entity), with 5
  default voice / Spotlight phrases. The Snippets and Clipboard entity
  pickers are the surface power users will reach for in their custom
  Shortcuts.
- The two index types (`SnippetIndex`, `ClipboardIndex`) are
  intentionally read-only - they're cheap, atomic JSON loads that work
  even when Trove isn't running. Mutation intents would need a separate
  XPC channel or URL-scheme dispatch (see strategic backlog).

### Verified

`lint-trove`: clean. `test-trove`: 233/233 PASS.

---

## [1.1.0-beta.11] - Unreleased

### Added

- **macOS Shortcuts / AppIntents integration** (`app_intents.swift`,
  ~430 lines). Zero coverage before this - Trove is now scriptable from
  macOS Shortcuts, queryable by Spotlight, and usable as a Focus Filter
  action. The strategic audit pegged this as the single biggest missing
  capability vs Raycast / Alfred / Bartender; this closes the gap. 11
  intents ship in this bump:
  - **Navigation:** `OpenPaneIntent` (32 panes, picker-friendly enum).
  - **Stage:** `AddTextToStageIntent`, `AddFileToStageIntent`,
    `PasteClipboardToStageIntent`, `CaptureScreenshotToStageIntent`,
    `CopyStageAsFilesIntent`, `CopyStageAsTextIntent`, `ClearStageIntent`,
    `GetStageCountIntent`.
  - **Compute / Capture / Files:** `EvaluateExpressionIntent` (returns the
    last-line value; supports the multi-line Soulver-class calc engine
    with variables / units / currency / line refs), `GenerateQRCodeIntent`
    (returns IntentFile PNG with bounded 64-4096 px size), `HashFileIntent`
    (returns multi-line MD5 / SHA-1 / SHA-256 / SHA-512 block in one
    streaming pass).
  - `TroveAppShortcuts: AppShortcutsProvider` ships 5 default phrases
    (Paste to Stage / Capture Screenshot / Add Text to Stage / Calculate /
    Generate QR Code) so the user gets a working Shortcuts catalogue on
    first launch without configuring anything.
- Every intent runs in the background by default (`openAppWhenRun = false`)
  so a Shortcuts step that calls "Add Text to Stage" doesn't steal focus
  from the user's current app. The one exception is `OpenPaneIntent`,
  which opens Trove and brings it forward (the user's intent is to NAVIGATE
  to the pane).
- Every intent reuses an existing in-app code path - no new business
  logic introduced. The file is pure plumbing.

### Notes

- **Deliberately not shipped (this bump):** Snippets / History entity
  intents would require a `SnippetIndex` / `ClipboardIndex` actor for
  cross-process read access, since `SnippetStore` and `ClipHistory` are
  per-view `@StateObject`s today. Follow-up.
- **Deliberately not shipped:** PDF tools intents - PDF ops are
  interactive (multi-source drops, range strings, watermark options) and
  a single-parameter intent would underserve the real workflow. Better as
  a follow-up with custom `AppEntity` parameter types.

### Verified

`lint-trove`: clean. `test-trove`: 233/233 PASS.

---

## [1.1.0-beta.10] - Unreleased

### Fixed

- **P1 - PDF Rotate preview clipped 90°/270° rotations.** `rotationEffect`
  rotates in place WITHOUT reflowing the container frame, so a portrait
  page rotated 90° was clipped to the original portrait frame. Switched
  each rotate cell to a square 108×108 container so any rotation angle
  fits without clipping. Added Reduce Motion respect to the rotation
  animation (other hover animations in the file already had it).
- **P1 - PDF Merge preview opened the source PDF twice per render.**
  `loadThumb(_:)` created a fresh `PDFOpsThumbRenderer` per call, so two
  copies of the same source in a merge list each held a separate
  `PDFDocument`. Added a per-URL renderer cache keyed by the source URL
  so the doc opens once even on redraws.
- **P1 - PDF Split + Rotate previews held an unbounded thumb cache.**
  `@State` `[Int: NSImage]` grew as the user scrolled a multi-hundred-page
  PDF - at ~33 KB per 80×104 ARGB bitmap, a 500-page doc pinned ~16 MB
  indefinitely. Cap at 120 entries (covers ~4 screens at typical density);
  FIFO-evict the lowest-index entries when over the cap.
- **P0 a11y sweep - 9 more `.headerText()` regressions reverted.** Sites
  that mutate dynamically (`Text(detail.comm)` in procs) or that are
  empty-state / error-state titles or TextField labels - not structural
  landmarks - should not pollute the VoiceOver heading rotor. Reverted:
  - `history.swift:717` - "No matches for X" empty-state
  - `notes.swift:1012` - "No matches for X" empty-state
  - `procs.swift:843` - "No processes match X" empty-state
  - `procs.swift:750` - `Text(detail.comm)` dynamic value
  - `network_monitor.swift:1131` - "No inbound/outbound traffic" empty-state
  - `network_monitor.swift:1152` - "No network traffic yet" empty-state
  - `network_monitor.swift:1220` - "Network monitoring unavailable" error
  - `text_transforms.swift:1784/1788/1792/1798/1802` - five form-field labels
    (Prefix / Suffix / Regex / Regex / Replacement) that sit above their
    bound TextField, not section headings

### Verified

`lint-trove`: clean. `test-trove`: 233/233 PASS.

---

## [1.1.0-beta.9] - Unreleased

### Fixed

- **P0 - Menu bar dead routes.** All 9 menu-triggered notifications (added
  in beta.7's overhaul) silently no-opped because no view listened for
  them. Wired `.onReceive` for every one:
  - `troveSnippetsNewItem`        → SnippetsView opens new-snippet editor
  - `troveSnippetsImport`         → SnippetsView opens .fileImporter
  - `troveSnippetsExport`         → SnippetsView calls triggerExport()
  - `troveExportAllData`          → AccountView calls exportData()
  - `troveCaptureRegionToOCR`     → OCRView calls vm.capture() (guarded)
  - `troveCaptureRegionToSnip`    → SnipView calls engine.startSnip() (guarded)
  - `troveColorPickFromScreen`    → ColorToolView triggers NSColorSampler
  - `troveMirrorOpenFloating`     → MirrorView opens floating panel
  - `troveDiskSpeedRunNow`        → DiskSpeedView starts benchmark run (guarded)
- **P1 - Tools menu bypassed pane visibility.** `switchToPane(.X)` in
  Tools-menu items routed unconditionally, so clicking "PDF Tools" on a
  user who had hidden the PDF pane silently jumped to a blank sidebar
  slot. New `switchToPaneGuarded(_:)` helper does the same hidden-pane
  flash as the View menu's ⌘1-⌘4. All 30 Tools-menu calls swept to the
  guarded variant.
- **P1 - PDF Compress estimate ~15× too small.** `scheduleProbe()`
  rendered a 320 px thumbnail, JPEG-encoded that, and multiplied by
  pageCount - but the actual compress op rasterizes at ≈ 1240 px per
  page (150 DPI for A4). Bumped target to 1100 px so the projection sits
  in the right order of magnitude.
- **P1 - `parseRangeGroups` mis-parsed whitespace + leading minus.**
  `"10 - 20"` produced `["10 ", " 20"]` which `Int(_:)` rejected, so the
  range silently dropped. Trim each part; reject leading-minus tokens
  explicitly so `"-5"` doesn't masquerade as a range.
- **P1 - PDF Split / Rotate previews didn't explain zero-page sources.**
  Corrupt or image-only PDFs where `pageCount == 0` rendered a blank card
  with no explanation. Now surface a warning row: "Could not read pages
  from this PDF - it may be corrupt or password-protected."
- **P1 - QuickLook `.keyboardShortcut(.space)` scope bleed.** SwiftUI
  registers `.keyboardShortcut` on a context-menu Button as an app-wide
  accelerator for the surrounding scope, NOT only when the menu is open.
  Space-bar in Stage/Library/History panes would trigger Quick Look on
  every press, including inside any TextField. Switched to ⌘Y - the
  canonical macOS Quick Look chord (Finder + Files use it), no scope
  bleed, no future-TextField conflict.
- **P1 - QuickLook `.disabled(iniCloud)`.** QLPreviewPanel renders iCloud
  placeholders natively and triggers download via `NSFileCoordinator`.
  Disabling the button forced a manual "go to Finder, download, come
  back" round-trip that the system already handles. Removed.
- **P0 - A11y sweep regressions (round 2).** The `.headerText()` sweep
  branded three more sites with `.isHeader` traits they shouldn't carry:
  empty-state "No snippets yet" / "No files added yet" (informational
  copy, not landmarks) and the snip annotate dialog title (macOS focuses
  the sheet automatically - adding the header trait is redundant +
  pollutes the rotor). All reverted to literal `.font(.headline)`.
- **P2 - Menu naming + email consistency.** Help menu "What's New" now
  reads "What's New in Trove…" to match the App menu entry. Help menu
  "Send Feedback" address unified to the branded `hello@gettrove.vercel.app`
  to match the App menu's entry (Help previously routed to a personal
  Gmail).
- **P1 - Theme + Accent submenu lacked active-selection feedback.** Both
  submenus now prefix the active option with a `✓` glyph so the user can
  tell at a glance which theme / accent is on.

### Verified

`lint-trove`: clean. `swiftc -DTROVE_TESTING -parse-as-library`: clean.
`test-trove`: 233/233 PASS.

---

## [1.1.0-beta.8] - Unreleased

### Added

- **Pro-level customization surface - four new Settings cards** in
  `customization_settings.swift`:
  - **Accessibility** - single-click toggles for Reduce Motion, Reduce
    Transparency, Increase Contrast respect; VoiceOver state-change
    announcement opt-in; focus-ring style picker (Default / Bold accent
    / Subtle border); inline catalogue of the 15 most useful chords with
    keyboard navigation hints.
  - **Density & layout** - Compact / Default / Comfortable picker driving
    row spacing, card radius, padding via a single `TroveUIDensity` token;
    sidebar-width slider (180-320 pt); toast-lifetime slider (1.5-12 s);
    hover-reveal delay slider (0-600 ms); Compact list rows + double-click-
    activation toggles.
  - **Keyboard shortcuts** - comprehensive read-only catalogue grouped by
    surface (App / File / Edit / View / Per-pane), 50+ chords surfaced -
    no more "is there a shortcut for X" tab-hunting. Total-chord count
    badge in the header.
  - **Defaults** - per-pane default save folder picker for PDF / Image
    Tools / Recorder / Snip / OCR / QR / Color, plus a default Snippets
    sort + Calculator angle unit. Empty value falls back to per-session
    last-used (existing behaviour) - these defaults are upstream of the
    pane's own last-used persistence.

### Fixed

- **P0 PDF previews - duplicate `.task(id: url)` on
  `PDFOpsCompressPreview`.** Two separate `.task(id: url)` modifiers raced;
  the second's `scheduleProbe()` always read `renderer == nil` and silently
  no-opped because the first hadn't yet committed `renderer = r`. Merged
  into a single ordered task that builds the renderer → publishes
  pageCount → schedules the first probe.
- **P1 Compress preview cross-file contamination.** `scheduleProbe()`
  previously captured `pageCount` BEFORE the 180 ms debounce sleep, so a
  source-switch during the debounce multiplied per-page bytes by the OLD
  doc's page count. Now captures the renderer ref before the sleep and
  re-reads pageCount AFTER the await on MainActor.
- **P0 QuickLook - responder-chain bypass.** `TroveQuickLook` hard-wired
  `panel.dataSource = self` / `panel.delegate = self` directly and never
  cleared `urls` - the singleton retained whatever URL was last previewed
  across the entire app session, particularly bad for Stage temp PNGs.
  Hooks `NSWindow.willCloseNotification` on the QL panel and releases
  URLs + nils data source/delegate on close. Also drops the synchronous
  `fileExists` pre-filter (QL renders a clean "file not found" placeholder
  for missing URLs - the previous silent guard-return was a UX bug).
- **P0 PDF "Continue with…" - three latent corruption paths.**
  `ingestPDFReopenPayload` now (a) validates the op key explicitly and
  surfaces a `kind: .error` toast on unknown keys instead of silently
  falling back to `.merge`; (b) calls `m.cancel()` if a job is in flight
  before `m.clear()`, preventing a mid-pipeline source-wipe-under-worker;
  (c) flashes a heads-up when there are unsaved outputs (still findable in
  Library + recents) instead of silently dropping them; (d) checks
  `fileExists` on the URL before clearing prior state, so a swept temp
  file doesn't wipe state for nothing.
- **P1 PDF "Continue with…" - missing `Unlock` entry.** The submenu had
  11 op routes but `unlock` was absent - a user who just Protected a PDF
  had no one-click path to reverse it. Added.
- **P0 Menu bar - `⌘⇧N` registered twice.** Both Edit > Capture
  Screenshot and Tools > Capture > Screenshot to Stage bound `⌘⇧N`,
  making the responder chain pick non-deterministically. Dropped the
  Tools shortcut; Edit owns the chord.
- **P0 Menu bar - `⌘.` triple-collision.** "Release Assertion" in Keep
  Awake clashed with the Recorder's stop-recording shortcut AND the
  universal macOS Cancel chord; releasing the assertion mid-recording was
  an unrecoverable surprise. Removed the menu shortcut; the action stays
  one click away in the pane.
- **P0 A11y sweep regression - Welcome CTA marked as a heading.** The
  `.headerText()` coherence sweep accidentally branded "Start using Trove"
  with `.isHeader`, polluting VoiceOver's heading rotor with a button label.
  Reverted to literal `.font(.headline)`.
- **P1 A11y sweep regression - live status strings marked as headings.**
  Recorder "Paused / Recording" and Disk Speed "Running / Ready" are
  mutating runtime state, not section landmarks. The heading rotor jumped
  to them and announced different values seconds later, which is
  disorienting. Both reverted to `.font(.headline)`.
- **P2 A11y sweep miss - `theming.swift:319` had the manual inline
  `.font(.headline).accessibilityAddTraits(.isHeader)` pattern** that the
  regex didn't catch (trailing trait broke the modifier-chain match).
  Collapsed to `.headerText()` for consistency.

### Verified

`lint-trove`: clean. `swiftc -DTROVE_TESTING -parse-as-library`: clean.
`test-trove`: 233/233 PASS.

---

## [1.1.0-beta.7] - Unreleased

### Added

- **Comprehensive menu-bar overhaul** - went from 5 minimal items to a full
  professional macOS menu surface:
  - **Trove** menu now includes "What's New", "Trove Website", "Privacy
    Policy", "Send Feedback…" alongside About + Check for Updates.
  - **File** menu got real content: New Snippet (⌘N), Open Files into Stage…
    (⌘O), Import / Export Snippets…, Export My Trove Data….
  - **Edit** menu extends the Stage cluster with "Copy All Staged as Text"
    (⌘⇧⌥C), "Capture Region → OCR" (⌘⌥4), "Capture Region → Snip" (⌘⌥5)
    alongside the existing Paste-into-Stage / Copy-as-Files / Screenshot
    / Clear-Stage bindings.
  - **View** menu gains a **Theme** submenu (Dark / Light / System / Linear
    / Cron / Custom) and an **Accent** submenu (Neutral / Magenta / Sky /
    Warm) so the user never has to dig into Settings for either.
  - **NEW Tools menu** - first-class power-user surface with submenus for
    Stage, Capture, Quick… (all 8 utility tools as one-click jumps),
    System (all 10 system panes), Storage (Overview / Scan / Clean /
    Sweep / Library), and **Keep Awake** (1 hour / 4 hours / Until Quit /
    Release Assertion ⌘.).
  - **Help** menu keeps its Keyboard Shortcuts (⌘/) + What's New + Report
    an Issue (prefilled with `Trove vX.Y.Z`) + Website surface.
- **Inline "Continue with…" submenu on every PDF output row.** When you
  finish merging two PDFs, the output row now exposes "Merge with another
  PDF" / "Split into pages" / "Organize / rearrange" / "Compress further" /
  "Rotate pages" / "Add page numbers" / "Watermark" / "Crop" /
  "Password-protect" / "OCR text layer" / "Re-save via PDFKit" as one-click
  continuations. Posts the same `.troveOpenInPDFTool` payload the existing
  Library reEditMenu uses, so the PDFView listener auto-switches the op +
  loads the URL as a source. No more "save → close → re-drop → pick op
  again" friction; you can chain a 6-step pipeline without leaving the pane.
- **Routing notification names** declared centrally so any future feature
  (or pane) can listen for the same menu-driven actions:
  `troveSnippetsNewItem`, `troveSnippetsImport`, `troveSnippetsExport`,
  `troveExportAllData`, `troveCaptureRegionToOCR`, `troveCaptureRegionToSnip`,
  `troveColorPickFromScreen`, `troveMirrorOpenFloating`, `troveDiskSpeedRunNow`.

### Changed

- The previously-minimal File menu (collapsed to just Close) now carries
  real content. macOS users expect a File menu to do something.
- The Edit menu's Stage cluster moved its capture shortcuts up so all three
  capture destinations (Stage / OCR / Snip) sit next to each other.

---

## [1.1.0-beta.6] - Unreleased

### Added

- **Native macOS QuickLook for Stage / Library / History items.**
  Press Space (or pick "Quick Look" from the context menu) on any image or
  file item to open the macOS-native preview panel - same surface Finder
  uses. Renders images, PDFs, source code, audio, video, archives, plain
  text - whatever the system supports. No app-switching, no opening Preview.
  A single `TroveQuickLook` singleton (`@MainActor`, `QLPreviewPanelDataSource`)
  holds the URL list so the panel sees stable indices across arrow-key
  navigation; future multi-select adoption in Stage / Library can pass a
  whole array via `show([URL], start:)`.

### Changed

- **`.headerText()` coherence sweep - 87 call sites across 25 files.**
  Every section / card title that previously used raw `.font(.headline)` now
  uses the existing `.headerText()` modifier, which combines headline font +
  `accessibilityAddTraits(.isHeader)`. VoiceOver's Headings rotor now
  navigates to every section title in every pane (Stage / Calc / Color /
  QR / OCR / Image Tools / PDF / Hash / Rename / Recorder / Snip / Snap /
  AltTab / Finder / Procs / Awake / Permissions / Log / GPU / Network /
  Disk Speed / Account / Updater / Mirror / History). Mechanically
  scripted; one self-recursion in the `headerText()` definition itself was
  swept and immediately reverted to the literal `.font(.headline)` body.
- macOS Finder had created `" 2.swift"` duplicate copies of nine files
  during the concurrent-edit window; removed (zero unique content vs the
  originals).

---

## [1.1.0-beta.5] - Unreleased

### Added

- **Live previews for every PDF op** (no run/save needed to see the result):
  - **Merge** - horizontal strip of first-page thumbnails in the current
    source order, each with index badge + filename + page count. Reorder
    in the source list above and the strip reflects it instantly. Total
    output page count shown in the header.
  - **Split** - full thumbnail grid of the source PDF with per-page badges
    showing which output (`p3 → #1`) each page lands in. Pages outside any
    range are dimmed + tagged "dropped" so the user can spot off-by-one
    range mistakes before running. Reuses the actor-serialized
    `PDFOpsThumbRenderer` so opening a 500-page doc still feels snappy.
  - **Rotate** - thumbnail grid with the rotation applied per cell via
    `.rotationEffect`. Animated transition so picking 90° CW → 180° → 90°
    CCW is immediately legible. Honors the "Apply to all pages" toggle +
    range field; un-affected pages render un-rotated.
  - **Compress** - sample page rendered at the chosen quality + projected
    output size estimate (per-page JPEG re-encode × page count). Updates
    on a 180 ms debounce as the slider drags so heavy re-encodes don't pin
    the slider. Header turns success-green when the projected reduction
    crosses 30%.
- All four previews live in `pdf.swift` as `fileprivate` SwiftUI structs
  (`PDFOpsMergePreview` / `PDFOpsSplitPreview` / `PDFOpsRotatePreview` /
  `PDFOpsCompressPreview`) and reuse the existing `PDFOpsThumbRenderer`
  actor for off-main PDFKit access. No new threading hazards introduced.

### Changed

- `PDFOpsDetailView.body` now inserts the live preview between `parameters`
  and `runRow`, so the visual feedback sits where the user's eye is already
  tracking after tweaking inputs.

---

## [1.1.0-beta.4] - Unreleased

### Fixed

- **Version auto-update across rebuilds.** Two bugs were keeping the sidebar
  footer showing `v1.0.4-dev` after the source version bumped to `1.1.0-beta.3`:
  - `~/bin/build-macapp` defaulted to baking `"1.0"` whenever `BUILD_VERSION`
    env was unset. Now it reads the project's `VERSION` file as fallback, so
    every plain `build-macapp` rebuild picks up the bumped semver without env
    juggling. Stripping CR/LF prevents an editor's trailing newline from
    silently breaking the GitHub-Releases comparator.
  - `UpdateChecker.currentVersion()` only fell back to the source-tracked
    `fallbackVersion` when the bundle was the exact placeholder `"1.0"`. A
    binary built once with `BUILD_VERSION=1.0.4-dev` therefore kept showing
    `1.0.4-dev` forever. Now any of: missing key, empty key, `"1.0"`, contains
    `-dev`, or strictly-older-than-fallback per semver hands off to the source
    version. Notarized releases (≥ fallback, no `-dev`) still show their own
    real version string.

---

## [1.1.0-beta.3] - Unreleased

### Fixed

- **P0 visual: giant vertical-capsule toast blob** on the right side of any
  pane (most visible on Keep Awake). Root cause: `ToastCapsule` used
  `Capsule(.continuous)` for its background fill - `Capsule` adapts to bounds
  with hemispherical ends, so when a parent overlay gave it taller bounds the
  toast morphed into a giant vertical pill that ate the right half of the
  window. Switched the background + overlay to `RoundedRectangle(cornerRadius: 18)`
  so the shape can never stretch into a vertical-pill; capped the toast's
  outer frame with `maxHeight: 96` + `.fixedSize(horizontal:false, vertical:true)`
  so even if a future parent layout misbehaves, the toast stays toast-sized;
  height-capped the leading kind-tint stripe so it can't stretch the inner
  HStack vertically either.

---

## [1.1.0-beta.2] - Unreleased

Round-two audit-driven hardening. All 18 items on the carry-over list landed.
Tests: 233/233 pass.

### Added

- **`SnippetLoadOutcome`** - explicit result type for the off-main snippet
  loader (.ok / .empty / .corrupt(msg) / .noFile), so the @StateObject init
  can return synchronously while the actual disk I/O happens off-main.
- **`AutoInstaller.posixSingleQuote`** - POSIX-safe shell-argument quoter so
  the codesign verification can no longer be tricked into evaluating `$` /
  backtick on an adversarial app-bundle path.

### Fixed (P0 / P1)

- **`NoteStore.init` / `ClipHistory.init` / `SnippetStore.init`** were three
  AccountView-class SIGTRAP-risk paths - each ran `boundedRead` (up to 16 MB)
  + `JSONDecoder.decode` synchronously on the main thread inside the
  `@StateObject` default expression. On a slow / cold disk this pushed past
  the AttributeGraph 50 ms watchdog and could SIGTRAP. All three now seed
  empty + load off-main + publish back on @MainActor.
- **`AltTabView` `screenRecordingAllowed` `@State` default** ran
  `CGPreflightScreenCaptureAccess()` synchronously on main during view init
  (50-200 ms TCC read on a cold `tccd`). Seeded `false`; refreshes via
  `.task` and `didBecomeActive` (both already wired).
- **`OverviewView` Full-Disk-Access priming card** was shown eagerly on every
  first launch - telling brand-new users they had a problem before they had
  one. Now gated on actually-observed permission denials during Refresh
  (probes `Downloads`/`Desktop`/`Documents` in the off-main hop).
- **`WelcomeSheet` Escape** was bound to BOTH the "Start using Trove" CTA
  AND the sheet's dismiss action - a user pressing Escape to back out
  permanently committed `hasSeenWelcome = true`. Escape now ONLY dismisses
  (welcome re-shows next launch); Return commits the CTA.
- **History `watching` default** flipped from `false` → `true` on first
  launch (key absent). Trove is a clipboard-first app; the empty pane on
  fresh install made users think the feature was broken. Privacy markers
  still filter the ingestion path.
- **OCR `translationTarget` / `wantsTranslation` / `recognitionLanguage`**
  persist across launches under `trove.ocr.*` keys. Users who returned to
  OCR with the same source/target language combo had to re-pick every time.
- **`auto_installer.swift:369,393` codesign verify shell escape** - the
  previous `\"\(path)\"` only escaped `"`. `$` and backticks remained live.
  Rewrote with POSIX single-quote (`'\''` close-reopen pattern) so arbitrary
  path content is rendered literally. Local threat model only (the path
  comes from `Bundle.main.bundleURL`), but the gap is closed.
- **`history.swift` three `NSImage(contentsOf:)` call sites** now probe file
  byte-size first (200 MB cap, matching the pasteboard ingestion ceiling).
  A tampered `clipboard_history.json` path pointing at a 1 GB sparse file or
  a FIFO would otherwise OOM the app.
- **`image_tools.swift:471` IUO `var resultURL: URL!`** replaced with optional
  + explicit `guard let`. The IUO path crashed if `doConvert` returned
  without assigning AND without throwing (latent in a future refactor).
- **Profile-sync `bundledDefaultsKeys` expanded from ~15 keys → 70+**, covering
  every settings audit catalogued key (Stage, History, Keep Awake, Recorder,
  Snip, Calc, QR, OCR, Image Tools, File Hash, Log, Rename, Snippets, GPU,
  App Launcher, Updater, PDF recents, Color history). Migrating to a new Mac
  via the profile bundle now preserves the user's settings instead of silently
  resetting most of them.

### Changed

- **`UpdateChecker.fallbackVersion`** bumped to `1.1.0-beta.2`. The in-app
  sidebar footer + Settings → About banner read this when
  `CFBundleShortVersionString` is the placeholder `1.0` (dev / ad-hoc builds).
- **`CutPaste.enabled`** documented in code as intentionally transient
  (not a persistence bug). Each session re-engaging the CGEventTap that
  intercepts ⌘X/⌘V is an explicit user opt-in - the security-by-default
  contract Trove ships with.

### Known gaps (carried to beta.3+)

- ~140 Sendable-closure-capture warnings (Swift 6 strict-concurrency mode previews).
- ~89 raw `.font(.headline)` calls that should be `.headerText()`.
- `TroveEmptyState` built but unadopted across 6+ panes.
- AI Bridge still entirely dead.

---

## [1.1.0-beta.1] - Unreleased

The big polish + robustness pass. Every pane audited from a power-daily-user
perspective and a security/correctness lens. Compile + lint + 218/218 tests pass.

### Added

- **Stage**: per-item Save…/Save to Downloads/Copy Path/Copy to Clipboard/drag-out
  context menu actions (DEVELOP_RULES §9).
- **Stage**: drag-reorder via `List.onMove` (persists with the rest of the items).
- **Stage**: persistence to `stage.json` (atomic, debounced + synchronous flush on
  `willTerminate`); items survive quits/relaunch.
- **Stage**: `StagedItem` made a `final class` so `ForEach` identity is stable
  across mutations - kills the O(n) thumbnail re-fetch on every change.
- **Stage**: `Open files…` CTA in the empty state.
- **Stage**: tolerant `Codable` decoder on `StagedItemRecord` so future schema
  additions can't silently empty the Stage on upgrade.
- **FloatingStage**: now reachable - View-menu command + toolbar `pip.enter`
  button wired to `FloatingStageController.shared.toggle()`. Previously dead.
- **AutoCompress**: wired live from `Stage.addFile/addImage/captureScreenshot`,
  plus a user-tunable quality slider (default 0.78, range 0.50-0.98) in
  Settings → Stage.
- **AltTab**: real window thumbnails via ScreenCaptureKit (was a permanent
  TODO before this release). Falls back to the app-icon overlay on permission
  denial; inline Screen Recording permission card.
- **Snap hotkeys**: now user-rebindable per-direction with conflict detection.
- **OCR**: language hint picker; `recognitionLanguage` flows into `VNRecognizeTextRequest`.
- **QR**: SVG vector export + custom foreground/background colors + persistent
  correction level + export size picker.
- **Mirror**: always-on-top floating panel + snapshot affordance
  (copy/save/Send to Stage).
- **Snip annotate**: redo stack parallel to undo; off-main render so committing
  a 4K annotation no longer freezes the UI.
- **Calculator**: `^` exponent operator; temperature / speed / area / energy
  units (incl. a custom `UnitEnergy.wattHours = 3600 J`); per-line "Copy
  expression + result" and "Send to Stage"; clear-confirm dialog.
- **Text Tools**: pipeline persistence (`xform-pipeline.json`, atomic); ReDoS
  guard catches `(a|a)+`-class patterns; off-main run with cancellation token;
  searchable add-transform menu.
- **Image Tools**: before/after preview before commit; per-source remove;
  settings persist; output thumbnails.
- **PDF**: image-watermark actually baked into the saved PDF (PDFKit's private
  `STAMP_IMAGE` key is dropped on serialization - fixed by rendering into the
  page's CGContext per page); freeform render DPI 72-600; live watermark
  preview; `PDFOpsRecentEntry` tolerant decoder.
- **File Hash**: SHA-512 (single-pass alongside MD5/SHA1/SHA256); opt-in
  auto-copy preference.
- **Rename**: off-main `apply()` with per-file rollback; settings persist;
  ReDoS guard before NSRegularExpression construction; preview rows show
  parent folder when the same filename appears in multiple dirs.
- **Recorder**: real region picker (multi-screen crosshair NSWindow - previous
  picker silently captured from `(0,0)` because it only read the PNG size); all
  settings persist (mic / sys audio / codec / fps / output folder / send-to-Stage);
  HEVC + 24/30/60 fps pickers; live capture preview while recording; bitrate
  cap (`200 Mbps`) so 5K Retina no longer overflows to ~59 Gbps; `isRecording`
  gate now taken synchronously before the first await so a double-tap during
  the 300 ms SCK content fetch can't build two writers; SCStream frame
  callback uses `[weak self]` (kills the per-frame `RecEngine` retain that
  piled up during `finishWriting`).
- **Big Scan**: proportional stacked-bar disk-usage breakdown; exclude list
  (defaults include `node_modules`/`.git`); sort/filter controls; stale-cache
  age infobar; trash off-main.
- **Library**: QuickLook thumbnails for image/PDF/video rows; `saveOne` is
  now atomic (tmp + `replaceItemAt`); `deleteAllLocalData` actually clears
  UserDefaults + Keychain (not just the App Support folder, despite what the
  confirmation alert promised).
- **Outputs Library**: tolerant `OutputEntry` decoder so adding new fields
  can't silently empty the recoverable cache on upgrade.
- **Account**: Export/backup data; Delete all local data (with confirmation).
- **Updater**: explicit Stable / Beta channel picker; in-app changelog renderer
  for current release (GitHub release body as Markdown).
- **Permissions**: refresh on pane reappear (debounced); generic description
  instead of the literal TCC.db path; correct `Privacy` deep link for the
  Network entry.
- **Customize sidebar**: now includes the `App` section so the Library pane
  can actually be hidden (`sectionOrder` was previously missing it).
- **Color tokens**: `Color.troveFg` (primary text), `Color.troveSuccess`,
  `Color.troveWarning`, `Color.troveError`.
- **Shared UI**: reusable `TroveEmptyState<CTA>` and `TroveInlineError` views.
- **Tolerant Codable decoders** added to `StagedItemRecord`, `OutputEntry`,
  `PDFOpsRecentEntry`, `TroveCustomTheme`, `HotkeyBinding` - five separate
  silent-on-upgrade data-loss vectors closed.

### Fixed

- **P0** `AltTab` window thumbnails were a permanent no-op (TODO since
  `CGWindowListCreateImage` was removed) - implemented via SCK.
- **P0** Recorder region picker captured `(0,0)`-relative every time -
  rewritten with a real crosshair overlay window per display.
- **P0** PDF image-watermark silently dropped from saved files (PDFKit
  `STAMP_IMAGE` private key never serializes).
- **P0** Clipboard history was fully ephemeral - now persists.
- **P0** Multiple panes had main-thread blocking work: GPU/network/log sampling,
  AX enumeration in WindowSnap, OCR `waitUntilExit`, big_scan walk, PDF document
  open, rename apply, snip annotate render, addImage tiff/PNG encode. All moved
  off-main with reentry guards.
- **P0** Pasteboard `strict:false` path skipped the size guard - a 500 MB
  clipboard image OOM-crashed the app on every explicit paste.
- **P0** `cutpaste.swift` performPaste moved symlinks (incl. symlinks pointing
  at `/dev/zero`) - now skipped.
- **P0** Auto-installer continuation race on double-clicking "Install Now" -
  protected with `os_unfair_lock`; UUID-namespaced staging dir.
- **P0** Log Viewer "Save All" loaded the entire `log show` output into a
  single Data - now streams line-by-line.
- **P0** Stage no longer drops mutations within 300ms of quit (force-flush on
  `troveWillTerminate`).
- **P0** Stage `writeToDisk` no longer silently discards `replaceItemAt`
  errors - falls back to `moveItem`.
- **P0** Recorder bitrate `pxW × pxH × 4` overflowed on 5K Retina to ~59 Gbps;
  capped to 200 Mbps.
- **P0** Recorder `isRecording = true` was set AFTER 300 ms of awaits in
  `start()` - a double-tap built two writers on the same path. Now set
  synchronously via an `isStarting` flag.
- **P0** Stage card title `.foregroundStyle(.white)` was invisible in the
  light theme (cardSolid #F1F0EB ≈ white). Switched to `Color.troveFg`.
- **P0** Toast appearance now fires `NSAccessibility.announcementRequested` -
  VoiceOver users were getting zero feedback for any action.
- **P1** Many destructive deletes were `removeItem` instead of `trashItem` -
  swept across Library, big_scan, etc.
- **P1** `Mirror` floating panel observer leaked one observer per open/close.
- **P1** `AutoCompress` had no symlink/regular-file guard; non-atomic write
  could leave a partial file and the `fileExists` guard then permanently
  blocked future passes for that source.
- **P1** Snip annotate `bounds.width == 0` produced `inf` scale on first
  layout pass; guarded.
- **P1** OCR `OCRTargetLanguage.smartDefault()` crashed if `all` were empty
  (`all[0]`); now a safe English fallback.
- **P1** Rename regex compiled with no ReDoS guard; now uses the same
  `rejectCatastrophicRegex` heuristic as text-transforms.
- **P1** Big Scan stale-result race: cancellable Task + generation counter
  prevents an older scan from overwriting a newer one when the root changes.
- **P1** Color picker history was in-memory only - now persists.
- **P1** Snip and QR settings persist across launches.
- **P1** `CustomizeView` had `App` missing from `sectionOrder` - Library could
  not be hidden.
- **P1** `deleteAllLocalData()` left UserDefaults and Keychain intact despite
  the confirmation alert promising a full reset.
- **P1** Numerous raw `Color.white.opacity(…)` / `.gray` / `.green` view tints
  swapped for palette tokens so the light theme reads correctly.

### Changed

- Default theme remains Dark with Light/System/Linear/Cron/Custom alternatives.
- `lint-trove` continues to ban `try!`, `as!`, `DispatchQueue.main.sync`, bare
  `.waitUntilExit()`, `.first!`/`.last!`, `fatalError`. All rules clean.

### Security

- Per `auto_installer.swift` audit: shell escape in the codesign verification
  path tracks `\` and `"` but not `$` / backtick. Local threat model only
  (the path is `Bundle.main.bundleURL.path`), but the planned mitigation is
  to drop `/bin/sh -c` entirely and call `/usr/bin/codesign` directly with
  a second `Pipe()` for stderr. Tracked for 1.1.0-beta.2.

### Known gaps (carried forward to beta.2+)

- AI Bridge (CommandX-replacement) is still entirely dead. Separate feature
  pass.
- ~140 Sendable-closure-capture warnings (Swift 6 mode previews). Doesn't
  ship a worse app today; Swift-6 strict-concurrency cleanup pass needed.
- `NoteStore` / `ClipHistory` / `SnippetStore` `@StateObject` default
  initializers do synchronous `boundedRead` + JSON decode on main -
  AttributeGraph SIGTRAP risk on slow/cold disks. Pattern-fix pending.
- ~89 raw `.font(.headline)` calls that should be `.headerText()` for
  VoiceOver heading-rotor coverage.
- The existing `TroveEmptyState` shared view is built but not yet adopted by
  the 6+ panes that each still roll their own empty state.

---

## [1.0.7] - 2026-05-17

Last public Stable release before the polish-and-robustness pass.
See <https://github.com/ArnavGoel03/trove/releases/tag/v1.0.7>.
