// Per-pane deep-dive content for /pane/[slug]. Kept here so each of the
// 33 pages stays a tiny route file that just consumes a typed bag. Each
// entry mirrors what the in-app pane actually does as of v1.1.0 — no
// roadmap aspirations, only shipped capabilities.

export type PaneURL = { example: string; note: string };

export type PaneDetail = {
  overview: string;
  capabilities: string[];
  urlScheme?: PaneURL[];
  /** Privacy / local-only note shown in its own block when present. */
  privacy?: string;
};

const GENERIC: PaneDetail = {
  overview:
    "Part of Trove's 33-pane native macOS workspace. Open it from the sidebar, ⌘K Quick Switcher, or the `trove://pane/open` URL scheme.",
  capabilities: [
    "Built into Trove, no separate install",
    "Persists state per-user under XDG / Application Support",
    "Local-only — never makes network calls",
    "Scriptable via macOS Shortcuts and the trove:// URL scheme where it makes sense",
  ],
};

export const PANE_DETAIL: Record<string, PaneDetail> = {
  Stage: {
    overview:
      "Stage is Trove's multi-clipboard staging surface. Drop files, paste text, capture screenshots, and drag images into a single tray, then copy everything out as files, as text, or save it to disk in one shot. It's the default first-launch pane and the destination for almost every cross-pane Continue action.",
    capabilities: [
      "Mixed drop target — text, files, screenshots, in-memory images",
      "Copy all as files / as text in one action",
      "Save all to a chosen folder",
      "Quick Look any item with Space",
      "Cross-pane Continue editing — receives PDF / OCR / Snip / Record outputs",
      "Per-recording metadata banner (duration, source, codec, fps)",
    ],
    urlScheme: [
      {
        example: "trove://add?type=text&value=hello",
        note: "Adds the URL-encoded text to Stage. Frontmost-gated.",
      },
      {
        example: "trove://add?type=file&path=/Users/you/Desktop/x.pdf",
        note: "Adds a file to Stage. Path-validated, 200 MB cap.",
      },
      {
        example: "trove://copy-text",
        note: "Copies all Stage items as text. Frontmost-gated.",
      },
      {
        example: "trove://clear",
        note: "Clears Stage after confirmation. Frontmost-gated.",
      },
    ],
    privacy:
      "Stage holds items in memory only until you copy them out or save them. Nothing is uploaded; nothing leaves the machine.",
  },
  History: {
    overview:
      "Persistent clipboard history with regex search, pinning, dedup, and recovery. Press ⌃⇧⌘V from anywhere on macOS to open the floating HUD and pick a recent copy without losing your current selection.",
    capabilities: [
      "Plain ↔ regex search (⌘⇧.), ReDoS-guarded",
      "Soft-tint ×N badge for repeated payloads (dedup)",
      "Pin any entry to keep it at the top",
      "Recover deleted entries from quarantine",
      "Global HUD via ⌃⇧⌘V — type-to-filter, ↩ to paste",
      "Search by content kind (text / image / file)",
    ],
    urlScheme: [
      {
        example: "trove://history/paste?index=0",
        note: "Adds the N-th text entry from history to Stage.",
      },
      {
        example: "trove://history/copy?index=2",
        note: "Copies the N-th text entry to the system clipboard. Frontmost-gated.",
      },
    ],
    privacy:
      "History persists locally under XDG / Application Support. Encrypted at rest by FileVault if you have it on. Never leaves your Mac.",
  },
  Snippets: {
    overview:
      "Reusable text templates — signatures, common replies, addresses, code blocks — copy with one click. Snippets render as a rich entity picker inside the macOS Shortcuts editor with name + body preview.",
    capabilities: [
      "Name + body, plain text or markdown",
      "One-click copy or stage from the sidebar",
      "Shortcuts pickers: by name, by ID, list all, count",
      "Tolerant Codable persistence — future fields don't break old files",
      "Cross-launch ordering by usage frequency",
    ],
    urlScheme: [
      {
        example: "trove://snippet/copy?name=signature",
        note: "Copies the named snippet to the clipboard. Frontmost-gated.",
      },
      {
        example: "trove://snippet/get?name=signature",
        note: "Adds the snippet body to Stage (no clipboard write).",
      },
    ],
  },
  Notes: {
    overview:
      "Five colored tabs of always-on markdown scratchpad. The Notes pane is your in-app stage for quick thinking — auto-saved per-tab, no cloud sync, never overwritten.",
    capabilities: [
      "Five color-coded tabs",
      "Markdown rendering (bold, italic, links, lists, code)",
      "Auto-save per tab on every keystroke",
      "⌘B / ⌘I / ⌘K formatting",
      "Quarantine-on-corrupt — never silently loses content",
    ],
    privacy:
      "Notes live in plain `.md` files under XDG / Application Support. You can rsync or git them — they're yours.",
  },
  Calculator: {
    overview:
      "Soulver-style tape calculator with variables, unit conversions, live currency, and smart percent. Type expressions line-by-line; previous results are recallable via ↑ or the `ans` keyword.",
    capabilities: [
      "Variables — `x = 100`, then use `x * 1.09`",
      "Unit conversions — `12 inches in cm`, `2 GB / 1024`",
      "Live currency — `100 usd in eur` (cached)",
      "Smart percent — `1200 + 18%`",
      "History tape with ⌘C to copy last result",
      "Tab to insert `ans` (previous result)",
    ],
    urlScheme: [
      {
        example: "trove://calc?expr=100*1.09",
        note: "Evaluates the expression and flashes the result.",
      },
      {
        example: "trove://calc?expr=100*1.09&copy=1",
        note: "Evaluates and copies to clipboard. Frontmost-gated.",
      },
    ],
  },
  "Text Tools": {
    overview:
      "Chainable text pipeline with 40+ ops — Base64, JSON, JWT, regex, hashing, casing, encoding. Save the chain as a named recipe and replay tomorrow.",
    capabilities: [
      "40+ ops covering encoding, formatting, parsing, hashing, regex",
      "Pipeline chips — right-click to copy step / send to Stage / inspect",
      "Saved Recipes — name and replay any pipeline",
      "Errored steps explain themselves inline",
      "Tolerant Codable on `recipes.json` so upgrades don't drop data",
      "Cross-pane Continue receives OCR / PDF outputs as input",
    ],
  },
  Color: {
    overview:
      "Pick a color from any pixel on screen, extract a palette from an image, and check WCAG AA / AAA contrast — all in one pane.",
    capabilities: [
      "Eyedropper picker — magnifier + hex / rgb / hsl readout",
      "Palette from image — N-color median-cut quantizer",
      "WCAG contrast checker (AA / AAA, normal + large text)",
      "Copy as hex / rgb / hsl / Swift Color / SwiftUI Color / CSS var",
      "Recent picks history",
    ],
  },
  QR: {
    overview:
      "Generate QR codes from any text — URL, Wi-Fi credential, vCard — with live preview at 1024×1024 PNG. Drag the result out, or copy / save it.",
    capabilities: [
      "1024×1024 PNG output",
      "Error-correction level toggle (L / M / Q / H)",
      "Foreground / background color swap",
      "⌘C to copy PNG, ⌘S to save",
      "Right-click → stage for cross-pane reuse",
    ],
    urlScheme: [
      {
        example: "trove://qr?text=https://gettrove.vercel.app",
        note: "Generates the QR and adds the PNG to Stage.",
      },
    ],
  },
  OCR: {
    overview:
      "Capture a region of the screen, recognize text on-device with Vision, optionally translate, send anywhere. Fully local — no cloud OCR.",
    capabilities: [
      "Region capture via ⌘⇧N",
      "On-device Vision recognition — 19 languages",
      "Optional translation (Apple Translate)",
      "Send to Stage / Text Tools / clipboard",
      "Preview surface — see what was recognized before committing",
    ],
    privacy:
      "OCR runs entirely on-device via Apple's Vision framework. Images and recognized text never leave your Mac.",
  },
  Record: {
    overview:
      "Screen recording with system audio + mic via ScreenCaptureKit. Webcam PIP, keystroke overlay, click ripple, floating Stop button, global ⌘⇧. hotkey, mic gain, voice-activity auto-pause, countdown, filename tokens, MOV with separate audio tracks. Auto-routes to Stage with metadata banner.",
    capabilities: [
      "ScreenCaptureKit pipeline — display, window, or area capture",
      "Webcam PIP — parallel `.webcam.mov` alongside screen",
      "Webcam-only mode (bypasses SCStream entirely)",
      "Keystroke overlay (CGEventTap + bottom-center HUD)",
      "Click ripple animation",
      "Floating always-on-top Stop button",
      "Global stop hotkey ⌘⇧. (Carbon registration)",
      "Quality slider (Smallest / Balanced / Best)",
      "Mic gain slider + clipping indicator",
      "Filename tokens — `{date} {datetime} {codec} {fps} {counter}`",
      "Auto-trim silence at finalize",
      "Countdown (Off / 3 / 5 / 10s)",
      "Voice-activity auto-pause (-45 dBFS, 2.5s sustained)",
      "Menu-bar Record-dot during recording (opt-in)",
      "Preview sheet after stop with Re-record",
      "MOV export with separate audio tracks (NLE-friendly)",
    ],
    privacy:
      "Recordings save to your chosen folder. Trove never uploads, transcodes, or tracks recordings — they're files on disk you own outright.",
  },
  Snip: {
    overview:
      "Screenshot pane with a delay timer and multi-destination routing — Stage, clipboard, file, or all three. Ships with cross-pane Continue so the shot is one click from OCR / Stage.",
    capabilities: [
      "Delay timer (Off / 3 / 5 / 10s)",
      "Multi-destination: Stage + Clipboard + File",
      "Configurable save folder + filename pattern",
      "Continue in OCR / Image Tools / Stage from the preview",
      "Window or area capture",
    ],
  },
  Mirror: {
    overview:
      "Front-facing webcam preview with horizontal flip and an opt-in menu bar item. Mirror is a passive viewer — it never records. Use it to check yourself before a call without launching Photo Booth.",
    capabilities: [
      "Horizontal flip toggle (mirror ↔ true)",
      "Opt-in menu bar item with mini preview",
      "Camera permission deep-link to System Settings",
      "Quick switch between connected cameras",
    ],
    privacy:
      "Mirror does not record, save frames, or stream anywhere. The video buffer stays in the AVCaptureSession for live preview only.",
  },
  "Image Tools": {
    overview:
      "Batch convert, resize, and compress images across HEIC, PNG, JPEG, and WebP. Drop a folder, pick the target format and dimensions, hit go — all local, no upload.",
    capabilities: [
      "Convert between HEIC / PNG / JPEG / WebP",
      "Resize by max dimension or exact pixels",
      "Compress with quality slider + estimated output size",
      "Batch on folder drop",
      "Preview before write — never overwrite without confirmation",
      "EXIF metadata preserve / strip toggle",
    ],
  },
  PDF: {
    overview:
      "Merge, split, compress, rotate, OCR, and watermark PDFs locally. Reorderable merge, full preview surfaces, and cross-pane Continue so every output is traceable back into another pane.",
    capabilities: [
      "Merge — reorderable with thumbnail preview",
      "Split by range, by every N pages, or extract pages",
      "Compress with size estimate",
      "Rotate any subset of pages",
      "OCR (Vision-backed) → searchable PDF",
      "Watermark — text or image, position + opacity",
      "Cross-pane Continue — every output is reusable as input",
    ],
  },
  Hash: {
    overview:
      "MD5, SHA-1, SHA-256, and SHA-512 in a single streaming pass — drop a file and get all four hashes simultaneously without re-reading the file. Verify a `SHA256SUMS` / `.sha512sum` file by dropping it alongside the files it covers.",
    capabilities: [
      "4-in-1 streaming pipeline — one read, four hashes",
      "Drop a SUMS file → per-line ✓ / ✗ / missing verification",
      "Algorithm auto-detected by hex length (MD5/SHA-1/SHA-256/SHA-512)",
      "Path-traversal hardened — refuses absolute paths and `..`",
      "Copy any hash with ⌘C on the focused row",
      "Drop a folder to hash every file inside",
    ],
    privacy:
      "Files are hashed locally. Trove never uploads bytes anywhere — even for SUMS verification the comparison happens in memory.",
  },
  Rename: {
    overview:
      "Mass file renamer with find/replace, regex, sequence numbers, date prefix, and EXIF date extraction. Live preview every change before committing.",
    capabilities: [
      "Find / replace — plain or regex",
      "Sequence numbering with custom start + padding",
      "Date prefix from file mtime",
      "EXIF date prefix for photos",
      "Live diff before commit — no silent overwrites",
      "Undo last batch",
    ],
  },
  Snap: {
    overview:
      "Aero-Snap-style window tiling. Drag a window to any edge or corner for half / quarter splits, or use ⌃⌥ chords for keyboard tiling. Smart per-app presets remember the layout you prefer per workflow.",
    capabilities: [
      "Edge / corner drag tiling",
      "⌃⌥ + arrow keys for half/quarter splits",
      "Smart per-app presets",
      "Multi-display aware",
      "Animated snap with subtle outline preview",
    ],
  },
  Switcher: {
    overview:
      "AltTab-style window switcher with type-to-filter. ⌘⇥ shows every open window as a thumbnail grid; start typing to narrow down by app or title.",
    capabilities: [
      "Thumbnail grid of every open window",
      "Type-to-filter by app name or window title",
      "Spaces-aware (current space first, then others)",
      "Arrow-key navigation",
      "Quit / close from the switcher",
    ],
  },
  "Move Files": {
    overview:
      "Makes ⌘X / ⌘V in Finder actually move files — the way Windows has done it for decades, instead of macOS's quirky copy-only ⌘C / ⌘V flow.",
    capabilities: [
      "⌘X marks selected Finder files as cut (subtle dim)",
      "⌘V at destination moves them",
      "⌘Z undoes the move",
      "Cross-volume copies + deletes the original",
      "Conflict handling — rename / replace / skip",
    ],
  },
  Finder: {
    overview:
      "Bundle of Finder tweaks — show file extensions, path bar, hidden files, status bar — one click each. Reverts to default with the same click.",
    capabilities: [
      "Show all file extensions",
      "Show path bar in every Finder window",
      "Show hidden files (.dotfiles)",
      "Show status bar",
      "Disable .DS_Store on network volumes",
      "Each toggle is reversible from the same row",
    ],
  },
  Processes: {
    overview:
      "Live process list with CPU, memory, and energy columns. Group by parent app to see what each app spawned. Kill any process inline.",
    capabilities: [
      "Live update at ~1 Hz",
      "Sort by CPU / memory / energy / PID / name",
      "Group by parent app",
      "Kill process from the row (SIGTERM, then SIGKILL on confirm)",
      "Filter by name / PID",
      "Show command-line args on hover",
    ],
  },
  Awake: {
    overview:
      "Prevent display and system sleep with conditional rules — while a specific app is frontmost, during a time window, while on AC power, or while a Trove recording is active.",
    capabilities: [
      "Toggle from the menu bar item or the pane",
      "Conditional rules — per app, per time, per power source",
      "Auto-disable when condition no longer matches",
      "Visual feedback in the menu bar (filled cup ↔ empty cup)",
      "Backed by `IOPMAssertion`",
    ],
  },
  Permissions: {
    overview:
      "Single dashboard for every macOS privacy permission Trove (and other apps you care about) uses. Each row shows status + a deep-link to the exact System Settings pane.",
    capabilities: [
      "Status for Screen Recording, Accessibility, Microphone, Camera, Full Disk Access, Automation, Input Monitoring",
      "Deep-link button → opens System Settings pane",
      "Per-row explanation of what Trove uses each permission for",
      "Refreshes on focus so toggles flip without a re-launch",
    ],
    privacy:
      "Trove only requests the permissions you actively use. Screen Recording is asked only when you first open Record / Snip / OCR — never on launch.",
  },
  Log: {
    overview:
      "Searchable view of the macOS unified log (`os_log`) with color-coded levels. Live tail, regex filter, and pause / resume.",
    capabilities: [
      "Live tail with pause / resume",
      "Color-coded levels (debug / info / default / error / fault)",
      "Regex filter on subsystem, category, message",
      "Predicate builder for common queries",
      "Export visible rows as `.log` for sharing",
    ],
  },
  GPU: {
    overview:
      "GPU utilization, thermal pressure, VRAM usage, and battery temperature — honest readouts from public-where-possible IOKit sources. On Apple Silicon, battery temperature comes from AppleSmartBattery to keep the SEP-honest pact.",
    capabilities: [
      "GPU % utilization sparkline",
      "Thermal pressure level (nominal / fair / serious / critical / heavy)",
      "VRAM in use / allocated",
      "Battery temperature via AppleSmartBattery (Apple Silicon)",
      "Apple Silicon SEP-honest — no private SMC keys",
    ],
  },
  Network: {
    overview:
      "Per-process network throughput (read-only). Like a Little Snitch monitor without the firewall — see who's uploading, who's downloading, in real time.",
    capabilities: [
      "Per-process up / down throughput",
      "Lifetime sent / received counters per process",
      "Sort by current up / down / total",
      "Filter by process name",
      "Sparkline per process",
    ],
    privacy:
      "Network is read-only — Trove never modifies routes, intercepts traffic, or proxies anything. It's a viewer.",
  },
  Overview: {
    overview:
      "Disk usage at a glance — total / used / free per volume, top folders by size, and the biggest single files. The Storage section's home screen.",
    capabilities: [
      "Per-volume capacity bars",
      "Top 10 folders by size",
      "Top 10 single files",
      "APFS snapshot reclaim hint when applicable",
      "Click any row → drill into the Scan pane",
    ],
  },
  Scan: {
    overview:
      "Drill down into any folder's biggest sub-items. Click a row to descend, hit ⌫ to ascend. Builds a one-shot size tree, no background indexer.",
    capabilities: [
      "Click-to-descend, ⌫ to ascend",
      "Sort by size, count, modified",
      "Reveal in Finder with ⌘R",
      "Move to Trash from the row (with confirm)",
      "Honors hidden file toggle from the Finder pane",
    ],
  },
  Clean: {
    overview:
      "One-click cleanup of developer caches — npm, pnpm, yarn, brew, Xcode DerivedData, Carthage, Bun, Deno, pip, Cargo. Per-cache size, per-cache toggle, dry-run preview before delete.",
    capabilities: [
      "Targets npm / pnpm / yarn / brew / Xcode DerivedData / Carthage / Bun / Deno / pip / Cargo",
      "Per-cache size + last-modified",
      "Per-cache toggle — clean what you want, skip what you need",
      "Dry-run preview before delete",
      "Move-to-Trash, not unlink — undoable",
    ],
  },
  Sweep: {
    overview:
      "Auto-organize ~/Downloads by age and type. Files older than N days move to Year/Month subfolders, optionally by type — Images / Docs / Archives / Installers — so the top level stays scannable.",
    capabilities: [
      "Age threshold slider (7 / 14 / 30 / 90 days)",
      "Group by year/month and/or type",
      "Per-file preview before move",
      "Undo last sweep",
      "Manual run, or schedule via macOS Shortcuts",
    ],
  },
  "Disk Speed": {
    overview:
      "Sequential and random read/write benchmark per volume. Quick way to check whether an external SSD is delivering the throughput it's rated for.",
    capabilities: [
      "Sequential read / write MB/s",
      "Random 4K IOPS",
      "Configurable test file size (256 MB / 1 GB / 4 GB)",
      "Per-volume picker",
      "History — see how a drive's numbers drift over time",
    ],
  },
  Library: {
    overview:
      "Recoverable cache of every artifact Trove has produced — merged PDFs, OCR outputs, recordings, hashes, QR codes. Re-open in the pane that made them, or send back to Stage.",
    capabilities: [
      "Every output tagged with source pane + timestamp",
      "Search by name, kind, source pane",
      "Re-open in pane / Send to Stage / Reveal in Finder",
      "Auto-prunes oldest entries past the configured size cap",
      "Manual pin to prevent prune",
    ],
  },
  Account: {
    overview:
      "Sign in with Apple, view system identity, manage preferences. Account is where Trove surfaces the (very few) things it knows about you.",
    capabilities: [
      "Sign in with Apple — privacy-relay friendly",
      "macOS user identity readout",
      "Preferences shortcut",
      "License status (active / lapsed / trial)",
      "Sign-out clears credentials but never local data",
    ],
    privacy:
      "Trove only stores your Apple ID's verified email (or relay address) if you sign in. Sign-out clears it. Nothing else identifying is collected.",
  },
};

export function paneDetail(name: string): PaneDetail {
  return PANE_DETAIL[name] ?? GENERIC;
}
