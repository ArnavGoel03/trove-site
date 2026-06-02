// Catalog of long-form how-to guides. Each guide has its own route at
// /guides/[slug] and is also linked from the /guides index. The list
// drives both the index grid and the JSON-LD HowTo emitter on each page.

export type GuideStep = { name: string; text: string };

export type Guide = {
  slug: string;
  title: string;
  eyebrow: string;
  lede: string;
  estimate: string;
  /** Panes this guide touches, by name (must match lib/panes.ts). */
  panes: string[];
  steps: GuideStep[];
  /** Optional final paragraph after the numbered steps. */
  outro?: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "record-tutorial-video",
    title: "Record a tutorial video with click ripples + keystroke overlay",
    eyebrow: "Recorder",
    lede: "Trove's Record pane has every Screen Studio-style polish flag built in. This is the 60-second checklist to get a publishable tutorial out the door without leaving Trove.",
    estimate: "5 min",
    panes: ["Record", "Stage"],
    steps: [
      {
        name: "Open Record and pick the source",
        text: "Press ⌘0 or click Record in the sidebar. Pick Display, Window, or Area. For a Mac walkthrough, Display is usually right.",
      },
      {
        name: "Turn on click ripple + keystroke overlay",
        text: "Both live under the Overlays disclosure. The ripple is a fading concentric ring at every click; the overlay HUD floats at the bottom-center of the screen with the keys you press.",
      },
      {
        name: "Set the countdown to 3 seconds",
        text: "Use the Countdown stepper. Pressing Esc during the countdown cancels — you don't have to recover from a misclick.",
      },
      {
        name: "Optional: enable webcam PIP and choose a position",
        text: "Toggle Webcam PIP under Sources. Trove records a parallel `.webcam.mov` so you can resize / move the PIP in Final Cut or Premiere later.",
      },
      {
        name: "Hit Record",
        text: "Trove minimizes; the menu-bar Record-dot starts pulsing (if you opted in to it). The floating Stop button stays draggable so it's never in the shot you're capturing.",
      },
      {
        name: "Stop with ⌘⇧. from anywhere",
        text: "Global stop hotkey works from any frontmost app. Or click the floating Stop. The Preview sheet opens so you can re-record without leaving Trove.",
      },
      {
        name: "Trim or send to Stage",
        text: "The preview sheet has Trim, Re-record, and Send to Stage. From Stage, drag the recording into your NLE or upload destination.",
      },
    ],
    outro:
      "MOV with separate audio tracks ships under Export → Container. Pick MOV if you're handing the footage to a Premiere / DaVinci editor — they'll see the mic and system-audio tracks as separate so it's trivial to duck one against the other.",
  },
  {
    slug: "ocr-screenshot",
    title: "OCR a screenshot — region capture, recognize, translate, copy",
    eyebrow: "OCR",
    lede: "Apple Vision runs OCR on-device in under a second. This walks the full Region → Text → optional Translate → Clipboard flow without leaving Trove.",
    estimate: "2 min",
    panes: ["OCR", "Stage", "Text Tools"],
    steps: [
      {
        name: "Open OCR",
        text: "Click OCR in the sidebar (or run trove://pane/open?pane=OCR).",
      },
      {
        name: "Press ⌘⇧N to capture a region",
        text: "Drag the crosshair over the text you want to recognize. macOS shows the standard region overlay — Esc cancels.",
      },
      {
        name: "Pick a recognition language",
        text: "Vision auto-detects in most cases but the Languages popup lets you pin a primary + secondary. Useful for mixed-language docs.",
      },
      {
        name: "Optional: translate",
        text: "If the source isn't in your target language, tap Translate. Apple Translate runs locally for the supported pairs — no cloud.",
      },
      {
        name: "Copy or send onward",
        text: "Copy as Text with ⌘C, or send the recognized text to Stage / Text Tools for further processing.",
      },
    ],
    outro:
      "Need to OCR an existing PDF? The PDF pane has an OCR action that does the same Vision pipeline on every page and writes a searchable PDF — see the PDF pane page for the keystroke.",
  },
  {
    slug: "verify-download-hashes",
    title: "Verify a download with SHA256SUMS",
    eyebrow: "Hash",
    lede: "Drop the SUMS file alongside the files it covers. Trove parses the SUMS, streams each target through the 4-in-1 hashing pipeline, and renders per-line ✓ / ✗ / missing.",
    estimate: "1 min",
    panes: ["Hash"],
    steps: [
      {
        name: "Open Hash",
        text: "Click Hash in the sidebar (or run trove://pane/open?pane=Hash).",
      },
      {
        name: "Drop the SUMS file + the files it covers",
        text: "Drag SHA256SUMS / .sha256 / .md5sums / .sha512sum onto the pane, alongside the binaries / archives it references.",
      },
      {
        name: "Read the verification card",
        text: "Trove shows the algorithm (auto-detected by hex length), the modal algorithm if mixed, and one row per line of the SUMS file: ✓ match, ✗ mismatch, or missing.",
      },
      {
        name: "Investigate any ✗ rows",
        text: "Click a row → Reveal in Finder. Re-download or check the source — a mismatch means the file you got isn't the file the publisher signed.",
      },
    ],
    outro:
      "Trove's path-traversal hardening refuses absolute paths and `..` components in the SUMS file, so a hostile sums file can't redirect Trove to hash /etc/passwd and leak its contents via the mismatch hex.",
  },
  {
    slug: "clipboard-workflow",
    title: "Build a clipboard workflow — Stage + History + ⌃⇧⌘V HUD",
    eyebrow: "Clipboard",
    lede: "Stage is the multi-clipboard holding pen. History is the persistent log. ⌃⇧⌘V is the global HUD. This guide stitches all three into a clipboard workflow that beats single-buffer macOS by a country mile.",
    estimate: "3 min",
    panes: ["Stage", "History"],
    steps: [
      {
        name: "Turn on the global history HUD",
        text: "Settings → Clipboard → enable the global hotkey. The default is ⌃⇧⌘V; it works from any frontmost app.",
      },
      {
        name: "Use Stage as a multi-clipboard",
        text: "Drag files, paste text (⌘⇧V), screenshot (⌘⇧N) — all land in Stage. When you're ready, Copy All as Files or Copy All as Text dumps everything to the system clipboard.",
      },
      {
        name: "Search history with regex",
        text: "Inside History, press ⌘⇧. to toggle into regex mode. ReDoS-guarded — no runaway patterns. Pin entries to keep them at the top.",
      },
      {
        name: "Recover a deleted clip",
        text: "History persists to quarantine before delete. Open the Recover tab to restore anything you dropped in the last 30 days.",
      },
    ],
  },
  {
    slug: "text-transforms-pipeline",
    title: "Build and save a text-transform pipeline",
    eyebrow: "Text Tools",
    lede: "Text Tools is a chainable pipeline — Base64 → JSON pretty → JWT decode → regex. The chain is reusable. Save it as a Recipe and replay tomorrow.",
    estimate: "3 min",
    panes: ["Text Tools", "Stage"],
    steps: [
      {
        name: "Paste your input",
        text: "Open Text Tools, paste raw input (⌘V), or right-click a Stage item → Send to Text Tools.",
      },
      {
        name: "Add ops to the chain",
        text: "Click + to add an op. 40+ ops cover encoding, formatting, parsing, hashing, regex. Each op renders as a chip; right-click any chip to copy that intermediate step or send it to Stage.",
      },
      {
        name: "Save the chain as a recipe",
        text: "Recipes menu → Save as recipe. Name it. Trove writes recipes.json to App Support / XDG with tolerant Codable.",
      },
      {
        name: "Replay tomorrow",
        text: "Recipes menu → click the recipe. The whole chain rebuilds against your current input.",
      },
    ],
    outro:
      "Errored steps explain themselves in the chip's right-click menu — no silent skipping. Skipped steps (e.g. JSON pretty on non-JSON input) say why they were skipped so the chain stays debuggable.",
  },
  // ── v1.5.32 SEO long-tail guides ───────────────────────────────────────
  // Each targets a specific high-volume "how do I X on my Mac" search and
  // resolves to a Trove answer in 30 seconds.
  {
    slug: "decode-jwt-on-mac",
    title: "Decode a JWT on Mac (without uploading the token)",
    eyebrow: "JWT",
    lede:
      "Most JWT decoders are web tools that upload your token. Trove decodes it locally in ⌘K — three keystrokes, never leaves the Mac.",
    estimate: "30 sec",
    panes: ["Stage", "Snippets"],
    steps: [
      {
        name: "Open ⌘K (the Trove Quick Switcher)",
        text:
          "Press your Trove hotkey from anywhere. Default is ⌘ K.",
      },
      {
        name: "Type 'jwt decode' followed by the token",
        text:
          "Trove splits the eyJ.eyJ.sig payload, base64url-decodes the payload segment, and pretty-prints the JSON. Signature is NOT verified — use HMAC-SHA256 or the Passwords pane if you need that.",
      },
      {
        name: "Hit Return — the decoded payload is on your clipboard",
        text:
          "Paste anywhere. The token never touches the network. Trove has no telemetry.",
      },
    ],
    outro:
      "Why local matters: a JWT payload often contains user IDs, scopes, and email addresses. Pasting it into a web decoder hands that data to whoever owns the site. Trove keeps it on the Mac.",
  },
  {
    slug: "find-local-ip-on-mac",
    title: "Find your local IP address on Mac (the fast way)",
    eyebrow: "Network",
    lede:
      "Instead of System Settings → Network → Wi-Fi → Details, type two letters in ⌘K and get a clean list of every interface and its IPv4.",
    estimate: "5 sec",
    panes: ["Network"],
    steps: [
      {
        name: "Press your Trove hotkey",
        text: "⌘K opens the Quick Switcher.",
      },
      {
        name: "Type 'ip'",
        text:
          "Trove enumerates the non-loopback IPv4 addresses per interface (e.g. `en0: 192.168.1.42, awdl0: 169.254.x.x`). Link-local 169.254 ranges are filtered out by default.",
      },
      {
        name: "⏎ to copy",
        text:
          "Result lands on your clipboard. Paste into a terminal, a chat, a config file. Done.",
      },
    ],
  },
  {
    slug: "verify-sha256-of-download-mac",
    title: "Verify the SHA-256 of a download on Mac",
    eyebrow: "Hash",
    lede:
      "Project publishes a SHA-256 next to its download link? Trove verifies the file you downloaded matches, then writes a SHA256SUMS file if you want to share.",
    estimate: "20 sec",
    panes: ["Hash"],
    steps: [
      {
        name: "Drop the file into the Hash pane",
        text:
          "Trove hashes MD5 + SHA-1 + SHA-256 in a single streaming pass — works on multi-GB files.",
      },
      {
        name: "Paste the expected hash",
        text:
          "Paste the value from the publisher's page into Compare Against. A green check appears next to the matching algorithm.",
      },
      {
        name: "Optional: export SHA256SUMS",
        text:
          "Toolbar → Export… picks the format. The file is the standard `<hash>  <filename>` shape that `shasum -c` consumes.",
      },
    ],
    outro:
      "Trove also offers an auto-copy SHA256 toggle in the Hash toolbar — handy when you're verifying a queue of downloads.",
  },
  {
    slug: "flush-dns-cache-mac",
    title: "Flush the DNS cache on Mac (without remembering the command)",
    eyebrow: "Hosts",
    lede:
      "Changing /etc/hosts on macOS doesn't take effect until you flush the DNS cache and HUP mDNSResponder. Trove's Hosts editor does both for you, behind one authentication prompt.",
    estimate: "30 sec",
    panes: ["Hosts"],
    steps: [
      {
        name: "Open the Hosts pane",
        text:
          "Sidebar → Hosts (under System).",
      },
      {
        name: "Edit your rule packs and hit Apply",
        text:
          "Trove writes /etc/hosts via one `osascript with administrator privileges` call. The same call then runs `dscacheutil -flushcache && killall -HUP mDNSResponder` — the official combo.",
      },
      {
        name: "Done",
        text:
          "No need to remember the incantation; no Terminal window required.",
      },
    ],
    outro:
      "If you only want to flush without editing: open Hosts, hit Apply with no rule packs changed.",
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
