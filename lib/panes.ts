// Single source of truth for the 40+ tools Trove ships in v1.11.2.
//
// Mirrors `enum Pane` in `macos/main.swift` line-for-line: same rawValue,
// same icon name (SF Symbol, mapped here to a Lucide equivalent for the
// web), same one-line blurb as the in-app Customize panel. Group names
// match the sidebar section labels.
//
// Adding a pane on the macOS side? Append it here too so the website
// stays in sync. The /features page renders directly from this array.

import {
  Activity,
  ArrowDownToLine,
  ArrowLeftRight,
  BatteryFull,
  Bluetooth,
  BookOpen,
  Braces,
  Brain,
  Calculator,
  CalendarClock,
  Clipboard,
  ClipboardList,
  Coffee,
  Cpu,
  Crop,
  Disc3,
  Eye,
  FileDigit,
  FileEdit,
  FileSearch,
  FileText,
  Folder,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  Hash as HashIcon,
  Heading,
  History,
  Image as ImageIcon,
  KeyboardMusic,
  KeyRound,
  Layers,
  LayoutGrid,
  ListTree,
  type LucideIcon,
  Network,
  Palette,
  Pipette,
  PlugZap,
  QrCode,
  Regex,
  Ruler,
  ScanLine,
  ScanSearch,
  Scissors,
  ScrollText,
  Settings2,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Terminal,
  Thermometer,
  Trash2,
  Type,
  UserCircle,
  Video,
  Wand2,
} from "lucide-react";

export type PaneSection =
  | "Clipboard"
  | "Compute"
  | "Capture"
  | "Files"
  | "System"
  | "Storage"
  | "App"
  | "Profile";

export type Pane = {
  /** Matches `enum Pane` rawValue in main.swift. */
  name: string;
  /** Sidebar section. Matches `Pane.section` in main.swift. */
  section: PaneSection;
  /** Lucide icon picked to evoke the SF Symbol the app uses. */
  icon: LucideIcon;
  /** The SF Symbol the macOS app uses for this pane. */
  sfSymbol: string;
  /** Customize-panel blurb from main.swift. */
  blurb: string;
  /** Accent color hint, used to tint the per-section column. */
  accent: string;
};

export const PANES: Pane[] = [
  // Clipboard
  {
    name: "Stage",
    section: "Clipboard",
    icon: Clipboard,
    sfSymbol: "tray.full.fill",
    blurb:
      "Multi-clipboard staging: drop, paste, screenshot, copy all at once.",
    accent: "#ff7a45",
  },
  {
    name: "History",
    section: "Clipboard",
    icon: History,
    sfSymbol: "clock.arrow.circlepath",
    blurb:
      "Persistent clipboard history with regex search, pin, dedup, and recovery.",
    accent: "#ff7a45",
  },
  {
    name: "Snippets",
    section: "Clipboard",
    icon: ClipboardList,
    sfSymbol: "text.append",
    blurb: "Reusable text templates, copy with one click.",
    accent: "#ff7a45",
  },
  {
    name: "Notes",
    section: "Clipboard",
    icon: StickyNote,
    sfSymbol: "note.text",
    blurb: "Five colored tabs of always-on markdown scratchpad.",
    accent: "#ff7a45",
  },

  // Compute
  {
    name: "Calculator",
    section: "Compute",
    icon: Calculator,
    sfSymbol: "function",
    blurb:
      "Soulver-style tape: variables, units, live currency, smart percent.",
    accent: "#4cb8ff",
  },
  {
    name: "Text Tools",
    section: "Compute",
    icon: Wand2,
    sfSymbol: "wand.and.stars",
    blurb:
      "Chainable text pipeline: Base64, JSON, JWT, regex, 40+ ops, saved recipes.",
    accent: "#4cb8ff",
  },
  {
    name: "JSON / XML",
    section: "Compute",
    icon: Braces,
    sfSymbol: "curlybraces",
    blurb:
      "JSON, YAML and XML format, validate, sort keys, minify. Replaces jsonformatter.org.",
    accent: "#4cb8ff",
  },
  {
    name: "Regex",
    section: "Compute",
    icon: Regex,
    sfSymbol: "slash.circle",
    blurb:
      "Regex playground with live match highlighting, capture groups, and 10 common-pattern presets.",
    accent: "#4cb8ff",
  },
  {
    name: "Date Calc",
    section: "Compute",
    icon: CalendarClock,
    sfSymbol: "calendar.badge.clock",
    blurb: "Date calculator: business days, time zones, Unix to ISO 8601.",
    accent: "#4cb8ff",
  },
  {
    name: "Units",
    section: "Compute",
    icon: Ruler,
    sfSymbol: "ruler",
    blurb:
      "Unit converter: length, mass, temperature, data, speed, volume, area, time, energy, power.",
    accent: "#4cb8ff",
  },
  {
    name: "API Tester",
    section: "Compute",
    icon: Globe,
    sfSymbol: "globe.americas",
    blurb:
      "HTTP API client: method, URL, headers, body, auth (including OAuth PKCE). Response with status, headers and pretty JSON. Saved collections, history, and Postman import.",
    accent: "#4cb8ff",
  },
  {
    name: "Passwords",
    section: "Compute",
    icon: KeyRound,
    sfSymbol: "key.fill",
    blurb:
      "Strong password generator (random or memorable) plus a Have I Been Pwned breach checker. Only the first 5 hex characters of the SHA-1 ever leave the Mac (k-anonymity).",
    accent: "#4cb8ff",
  },
  {
    name: "Local AI",
    section: "Compute",
    icon: Brain,
    sfSymbol: "brain",
    blurb:
      "Local LLM chat through Ollama on localhost. Pick any model you have pulled. Streaming replies, system prompt, temperature, multi-turn. Nothing leaves the Mac.",
    accent: "#4cb8ff",
  },
  {
    name: "Terminal",
    section: "Compute",
    icon: Terminal,
    sfSymbol: "terminal",
    blurb:
      "Embedded command runner: zsh with a persistent working directory, command history, and ANSI color. A quick runner, not a full TTY.",
    accent: "#4cb8ff",
  },
  {
    name: "Markdown",
    section: "Compute",
    icon: Heading,
    sfSymbol: "text.justify.left",
    blurb:
      "Markdown editor with a live, natively rendered preview (no WebView). Split or focus modes, open and save .md, export or copy HTML, live word count.",
    accent: "#4cb8ff",
  },

  // Capture
  {
    name: "Color",
    section: "Capture",
    icon: Pipette,
    sfSymbol: "eyedropper.halffull",
    blurb: "Pick from screen, palette from image, WCAG contrast checker.",
    accent: "#b27cff",
  },
  {
    name: "QR",
    section: "Capture",
    icon: QrCode,
    sfSymbol: "qrcode",
    blurb: "Generate QR codes from any text. Live preview.",
    accent: "#b27cff",
  },
  {
    name: "OCR",
    section: "Capture",
    icon: ScanLine,
    sfSymbol: "doc.viewfinder",
    blurb:
      "Capture region → recognize text → optional translate, all local.",
    accent: "#b27cff",
  },
  {
    name: "Record",
    section: "Capture",
    icon: Video,
    sfSymbol: "record.circle",
    blurb: "Screen recording with system audio + mic. ScreenCaptureKit.",
    accent: "#b27cff",
  },
  {
    name: "Snip",
    section: "Capture",
    icon: ScanSearch,
    sfSymbol: "rectangle.dashed.badge.record",
    blurb:
      "Screenshot with delay timer + multi-destination (Stage / Clipboard / file).",
    accent: "#b27cff",
  },
  {
    name: "Mirror",
    section: "Capture",
    icon: Eye,
    sfSymbol: "video",
    blurb:
      "Webcam preview with horizontal flip + opt-in menu bar item. Local-only, no recording.",
    accent: "#b27cff",
  },
  {
    name: "Image Editor",
    section: "Capture",
    icon: Crop,
    sfSymbol: "wand.and.stars.inverse",
    blurb:
      "Photos-class image editor: crop, rotate, perspective, 13 adjustments, 9 filters, auto-enhance, red-eye removal, multi-format export.",
    accent: "#b27cff",
  },

  // Files
  {
    name: "Image Tools",
    section: "Files",
    icon: ImageIcon,
    sfSymbol: "photo.on.rectangle.angled",
    blurb: "Convert / resize / compress images. HEIC, PNG, JPEG, WebP.",
    accent: "#5be3a4",
  },
  {
    name: "PDF",
    section: "Files",
    icon: FileText,
    sfSymbol: "doc.richtext",
    blurb:
      "Merge (reorderable), split, compress, rotate, OCR, watermark, all local.",
    accent: "#5be3a4",
  },
  {
    name: "Hash",
    section: "Files",
    icon: HashIcon,
    sfSymbol: "number",
    blurb:
      "MD5/SHA1/SHA256/SHA512 in one streaming pass · SHA256SUMS verification.",
    accent: "#5be3a4",
  },
  {
    name: "Rename",
    section: "Files",
    icon: FileEdit,
    sfSymbol: "textformat.alt",
    blurb:
      "Mass file rename: find/replace, regex, sequence, date prefix, EXIF date.",
    accent: "#5be3a4",
  },
  {
    name: "Inspector",
    section: "Files",
    icon: FileSearch,
    sfSymbol: "doc.text.magnifyingglass",
    blurb:
      "Drop any file to see EXIF, GPS, PDF info, video tracks, hashes, xattr, Spotlight metadata. Strip metadata. Compare two files.",
    accent: "#5be3a4",
  },
  {
    name: "Converter",
    section: "Files",
    icon: ArrowLeftRight,
    sfSymbol: "arrow.up.arrow.down.square",
    blurb:
      "Universal file converter: HEIC to JPG, MOV to MP4, AAC to MP3, DOCX to PDF, anything ffmpeg, LibreOffice and sips can handle. Drag in, pick a target, run.",
    accent: "#5be3a4",
  },

  // System
  {
    name: "Snap",
    section: "System",
    icon: LayoutGrid,
    sfSymbol: "rectangle.split.2x1",
    blurb: "Aero-Snap-style window tiling with smart per-app presets.",
    accent: "#ffd166",
  },
  {
    name: "Switcher",
    section: "System",
    icon: Activity,
    sfSymbol: "rectangle.stack",
    blurb: "AltTab-style window switcher with type-to-filter.",
    accent: "#ffd166",
  },
  {
    name: "Move Files",
    section: "System",
    icon: Scissors,
    sfSymbol: "scissors",
    blurb: "⌘X / ⌘V in Finder actually moves files (Windows behavior).",
    accent: "#ffd166",
  },
  {
    name: "Finder",
    section: "System",
    icon: Folder,
    sfSymbol: "macwindow.and.cursorarrow",
    blurb: "Show extensions, path bar, hidden files: Finder tweaks bundled.",
    accent: "#ffd166",
  },
  {
    name: "Processes",
    section: "System",
    icon: Cpu,
    sfSymbol: "cpu",
    blurb: "Live process list, kill, group by parent app.",
    accent: "#ffd166",
  },
  {
    name: "Awake",
    section: "System",
    icon: Coffee,
    sfSymbol: "powerplug",
    blurb:
      "Prevent display + system sleep with conditional rules (app, time, power).",
    accent: "#ffd166",
  },
  {
    name: "Permissions",
    section: "System",
    icon: ShieldCheck,
    sfSymbol: "lock.shield",
    blurb: "Audit macOS privacy permissions, deep-link to System Settings.",
    accent: "#ffd166",
  },
  {
    name: "Log",
    section: "System",
    icon: ScrollText,
    sfSymbol: "doc.text.magnifyingglass",
    blurb: "Searchable view of macOS unified log with color-coded levels.",
    accent: "#ffd166",
  },
  {
    name: "GPU",
    section: "System",
    icon: Thermometer,
    sfSymbol: "memorychip",
    blurb:
      "GPU utilization, thermal pressure, VRAM, battery temp (Apple Silicon SEP-honest).",
    accent: "#ffd166",
  },
  {
    name: "Network",
    section: "System",
    icon: Network,
    sfSymbol: "network",
    blurb: "Per-process network throughput (Little Snitch read-only).",
    accent: "#ffd166",
  },
  {
    name: "Modes",
    section: "System",
    icon: Layers,
    sfSymbol: "rectangle.3.group",
    blurb:
      "Save apps and window layout as a named workspace. Restore with a hotkey.",
    accent: "#ffd166",
  },
  {
    name: "Workflows",
    section: "System",
    icon: GitBranch,
    sfSymbol: "arrow.triangle.branch",
    blurb:
      "Chain pane outputs into pane inputs. Capture to OCR to AI to Clipboard, all as one keybind.",
    accent: "#ffd166",
  },
  {
    name: "Battery",
    section: "System",
    icon: BatteryFull,
    sfSymbol: "battery.100",
    blurb:
      "Battery cycles, capacity vs design, condition, top energy users, temperature, voltage, amperage.",
    accent: "#ffd166",
  },
  {
    name: "Speedtest",
    section: "System",
    icon: Gauge,
    sfSymbol: "speedometer",
    blurb:
      "Internet download, upload, ping and jitter via Cloudflare. No third-party service. History of recent runs.",
    accent: "#ffd166",
  },
  {
    name: "Devices",
    section: "System",
    icon: Bluetooth,
    sfSymbol: "antenna.radiowaves.left.and.right",
    blurb:
      "Connected Bluetooth and USB devices with battery levels (AirPods, Magic Mouse, and more).",
    accent: "#ffd166",
  },
  {
    name: "Services",
    section: "System",
    icon: Settings2,
    sfSymbol: "gearshape.2",
    blurb:
      "LaunchAgents and LaunchDaemons: enumerate, start, stop, and reveal the plist.",
    accent: "#ffd166",
  },
  {
    name: "Hosts",
    section: "System",
    icon: ListTree,
    sfSymbol: "list.bullet.indent",
    blurb:
      "/etc/hosts editor. Group rules into named packs (block social, dev redirects), toggle whole packs on or off, commit with one auth prompt.",
    accent: "#ffd166",
  },

  // Storage
  {
    name: "Overview",
    section: "Storage",
    icon: HardDrive,
    sfSymbol: "internaldrive",
    blurb: "Disk usage at a glance with top-folders breakdown.",
    accent: "#ff5d8f",
  },
  {
    name: "Scan",
    section: "Storage",
    icon: ScanSearch,
    sfSymbol: "magnifyingglass.circle",
    blurb: "Drill down into any folder's biggest sub-items.",
    accent: "#ff5d8f",
  },
  {
    name: "Clean",
    section: "Storage",
    icon: Sparkles,
    sfSymbol: "sparkles",
    blurb:
      "One-click cleanup of dev caches: npm / pnpm / brew / Xcode / etc.",
    accent: "#ff5d8f",
  },
  {
    name: "Sweep",
    section: "Storage",
    icon: ArrowDownToLine,
    sfSymbol: "tray.and.arrow.down",
    blurb: "Auto-organize ~/Downloads by age + type.",
    accent: "#ff5d8f",
  },
  {
    name: "Disk Speed",
    section: "Storage",
    icon: Disc3,
    sfSymbol: "speedometer",
    blurb: "Sequential + random read/write benchmark per volume.",
    accent: "#ff5d8f",
  },
  {
    name: "Treemap",
    section: "Storage",
    icon: LayoutGrid,
    sfSymbol: "square.grid.3x3.fill",
    blurb:
      "Folder size as a squarified treemap. Double-click any tile to drill in.",
    accent: "#ff5d8f",
  },

  // App
  {
    name: "Library",
    section: "App",
    icon: BookOpen,
    sfSymbol: "books.vertical",
    blurb:
      "Recoverable cache of everything Trove has produced: re-open, re-edit, send to Stage.",
    accent: "#c4b5fd",
  },

  // Profile
  {
    name: "Account",
    section: "Profile",
    icon: UserCircle,
    sfSymbol: "person.crop.circle",
    blurb: "Sign in with Apple, system identity, preferences.",
    accent: "#9ca3af",
  },
];

export const SECTIONS: { name: PaneSection; tagline: string; accent: string }[] =
  [
    {
      name: "Clipboard",
      tagline: "Four panes for everything you copy.",
      accent: "#ff7a45",
    },
    {
      name: "Compute",
      tagline: "Numbers and text, one keystroke away.",
      accent: "#4cb8ff",
    },
    {
      name: "Capture",
      tagline: "Pixels, screens, and recordings. Local.",
      accent: "#b27cff",
    },
    {
      name: "Files",
      tagline: "Convert, hash, batch-rename without uploading.",
      accent: "#5be3a4",
    },
    {
      name: "System",
      tagline: "Tile windows, audit permissions, watch processes.",
      accent: "#ffd166",
    },
    {
      name: "Storage",
      tagline: "Find what's big, clean what's stale.",
      accent: "#ff5d8f",
    },
    {
      name: "App",
      tagline: "A cache of what Trove has produced for you.",
      accent: "#c4b5fd",
    },
    {
      name: "Profile",
      tagline: "Identity and preferences.",
      accent: "#9ca3af",
    },
  ];

// Headline / power-user capabilities introduced in v1.11.2.
export type Capability = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  icon: LucideIcon;
  accent: string;
};

export const CAPABILITIES: Capability[] = [
  {
    eyebrow: "macOS Shortcuts",
    title: "11 AppIntents · 8 entity pickers",
    body: "Every Trove action is a Shortcut. Snippets and clipboard entries show up as real entities inside the Shortcuts editor with body and capture-date previews, so picking the right one feels like browsing your data, not stringly-typed guessing.",
    bullets: [
      "Open Pane · Stage operations (add text/file, paste clipboard, capture screenshot, copy/clear)",
      "Snippet pickers: get by ID, by name, list all, count",
      "Clipboard history: get-at-index, recent text, count, picker",
      "Friendly errors via CustomLocalizedStringResourceConvertible",
    ],
    icon: KeyboardMusic,
    accent: "#ff7a45",
  },
  {
    eyebrow: "URL Scheme",
    title: "trove:// for everything",
    body: "Anything that can open a URL can drive Trove. `trove://pane/...`, `trove://calc?expr=`, `trove://snippet/copy?name=`, `trove://history/paste?index=`, `trove://qr?text=`. The destructive verbs check that Trove is frontmost before they fire, so a malicious link can't quietly empty your clipboard.",
    bullets: [
      "Pane navigation · calculator evaluation · snippet copy",
      "History paste-by-index · QR generation",
      "Frontmost-only gating for paste-style verbs",
      "Same scheme works from Shortcuts, Alfred, Raycast",
    ],
    icon: PlugZap,
    accent: "#4cb8ff",
  },
  {
    eyebrow: "Per-pane Chord HUD",
    title: "⌘? floats the pane's shortcuts first",
    body: "The Keyboard Shortcuts HUD is pane-aware: the current pane's chords float to the top of the overlay, then the app-wide list. Nine panes ship bespoke chord lists, the rest fall through to global-only. Backed by a single ChordRegistry so adding a shortcut auto-updates the discovery surface.",
    bullets: [
      "Bespoke chords for Stage, History, Snippets, Notes, Calc, Text Tools, Hash, QR, OCR",
      "⌘? convention (was ⌘/) matches macOS standard for current-view shortcuts",
      "Global chords always present below the pane-specific block",
      "One registry, zero drift between code and HUD",
    ],
    icon: KeyboardMusic,
    accent: "#b27cff",
  },
  {
    eyebrow: "Cross-pane Data Flow",
    title: "Any output is reusable as input",
    body: "Merge a PDF and the result is one click from Continue in PDF Tools, Send to Stage, or Open in Text Tools for OCR. The Outputs Library remembers every artifact Trove has produced, so the 'wait, where did that file go?' moment never happens.",
    bullets: [
      "Stage-as-input across every pane",
      "Reorderable PDF merge with full preview surfaces",
      "Outputs Library = recoverable cache of everything Trove has produced",
      "Right-click any Text Tools pipeline chip → copy step / send to Stage / inspect",
    ],
    icon: Sparkles,
    accent: "#5be3a4",
  },
  {
    eyebrow: "Hash · SHA256SUMS",
    title: "Drop the SUMS file. Get a pass/fail report.",
    body: "Drag a `SHA256SUMS` / `.sha256` / `.md5sums` / `.sha512sum` alongside the files it covers. Trove parses the sums file, streams each target through the 4-in-1 hashing pipeline, and renders ✓ / ✗ / missing per line. Algorithm auto-detected by hex length; mixed files show the modal algorithm.",
    bullets: [
      "MD5 · SHA-1 · SHA-256 · SHA-512 auto-detected by hex length",
      "Path-traversal hardened: refuses absolute paths and `..`",
      "Mixed-algorithm sums files supported",
      "Same 4-in-1 streaming pipeline as single-file hashing",
    ],
    icon: FileDigit,
    accent: "#ffd166",
  },
  {
    eyebrow: "Text Tools · Saved Recipes",
    title: "Save the pipeline. Replay it tomorrow.",
    body: "Save the current chain as a named recipe, run it again tomorrow. Persisted to `recipes.json` with tolerant Codable so future step additions don't silently empty the file on upgrade. Boop, DevUtils, and TextSoap all do single-shot conversions; none of them chain.",
    bullets: [
      "Name, save, replay any 40+-op pipeline",
      "Right-click pipeline chip → copy step / send to Stage / inspect",
      "Errored steps explain themselves in the same menu",
      "Forward-compatible Codable on disk",
    ],
    icon: Palette,
    accent: "#ff5d8f",
  },
  {
    eyebrow: "History · Regex + Dedup",
    title: "ReDoS-guarded regex · ×N badge for repeats",
    body: "⌘⇧. toggles plain ↔ regex search with a ReDoS guard on the regex path so a bad pattern can't lock the UI. Repeats of the same payload fold into one row with a soft-tint ×N capsule. Copying the same URL ten times leaves you with one entry, not ten.",
    bullets: [
      "Plain ↔ regex toggle (⌘⇧.)",
      "ReDoS guard on the regex path",
      "Dedup with ×N badge",
      "Pin, recover, search across persisted history",
    ],
    icon: History,
    accent: "#ff7a45",
  },
  {
    eyebrow: "Stable / Beta Channels",
    title: "Opt in to pre-release, opt out anytime",
    body: "Settings → Updates → Update channel flips between Stable and Beta. Beta gets `vX.Y.Z-beta.N` builds the moment they tag; switch back any time and the next poll respects the new channel. Semver §11 pre-release ordering makes sure a beta never silently promotes to stable.",
    bullets: [
      "Stable channel: only `vX.Y.Z` releases (default)",
      "Beta channel: `vX.Y.Z-beta.N` builds (opt-in)",
      "Semver §11 pre-release ordering guarantees safety",
      "In-app updater polls GitHub Releases every 6h",
    ],
    icon: Gauge,
    accent: "#4cb8ff",
  },
  {
    eyebrow: "Homebrew",
    title: "brew install --cask trove",
    body: "There's a Homebrew Cask formula at `Casks/trove.rb`. Once the tap publishes, install and upgrade ride the same `brew upgrade --cask` path as every other cask on your machine, no extra updater to babysit.",
    bullets: [
      "`brew tap arnavgoel/trove && brew install --cask trove`",
      "`livecheck` against the GitHub Releases page",
      "macOS 13 Ventura or later",
      "`zap` cleans App Support, prefs, and caches on uninstall",
    ],
    icon: PlugZap,
    accent: "#b27cff",
  },
  {
    eyebrow: "XDG Config Home",
    title: "$TROVE_CONFIG_HOME, then XDG, then native",
    body: "Park Trove's config under `~/.config/trove/` if that's where your other tools live. Lookup order: `$TROVE_CONFIG_HOME` > `$XDG_CONFIG_HOME/trove` > `~/.config/trove` > native App Support. All 11 storage-touching panes route through one resolver, and there's no silent migration, existing installs stay where they were.",
    bullets: [
      "Single resolver, 11 panes",
      "Per-user override via `$TROVE_CONFIG_HOME`",
      "Native default for everyone who doesn't care",
      "No silent migration of existing data",
    ],
    icon: HardDrive,
    accent: "#5be3a4",
  },
  {
    eyebrow: "Performance",
    title: "Sub-500 ms cold launch",
    body: "Lazy `SharedStore` init, deferred timers, body-cost audit per pane. Apple Silicon cold-launches Trove in under half a second and resting memory stays below 30 MB. ~14 MB on disk, one Swift binary, no helper processes.",
    bullets: [
      "Lazy stores, deferred timers, audited body cost",
      "Single Swift / SwiftUI binary, no helpers",
      "~14 MB on disk",
      "< 30 MB resident at rest",
    ],
    icon: Gauge,
    accent: "#ffd166",
  },
  {
    eyebrow: "Crash Discipline",
    title: "Zero try! / fatalError in production",
    body: "DEVELOP_RULES §1 enforced: no `try!`, no `fatalError`, no `main.sync`, no bare `.waitUntilExit`, no `.first!` in the production tree. The lint-trove pass runs clean across 45 files. Every error path surfaces as a Sonner-style flash toast. `alert()` and silent failure are not options.",
    bullets: [
      "lint-trove clean across the production Swift tree",
      "Sonner-grade flash() toasts everywhere",
      "Quarantine-on-corrupt for every JSON-backed store",
      "Test suite: 233/233 PASS at 1.11.2",
    ],
    icon: ShieldCheck,
    accent: "#ff5d8f",
  },
];

export const PANE_COUNT = PANES.length; // 53
