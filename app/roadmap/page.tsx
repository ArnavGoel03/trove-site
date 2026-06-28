import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Roadmap: Trove",
  description:
    "What's shipped in Trove 1.11.2, what's in active development, and what's deferred. The honest list: no aspirational vaporware.",
  alternates: { canonical: "https://gettrove.vercel.app/roadmap" },
};

type Item = {
  id: string;
  title: string;
  body: string;
  size: "S" | "M" | "L";
};

const SHIPPED: Item[] = [
  {
    id: "intents",
    title: "macOS Shortcuts / AppIntents: 11 intents, 8 entity pickers",
    body: "Snippets and clipboard history render as rich pickers in the Shortcuts editor with name + body / kind + capture-date previews.",
    size: "L",
  },
  {
    id: "channels",
    title: "Beta / Stable update channels",
    body: "Settings → Updates → Update channel. Opt in to pre-release builds without losing stable-channel safety. Semver §11 pre-release ordering.",
    size: "M",
  },
  {
    id: "chord-hud",
    title: "Per-pane chord HUD (⌘?)",
    body: "Current pane's chords float above the global list. Backed by a single ChordRegistry so adding a shortcut auto-updates the HUD.",
    size: "M",
  },
  {
    id: "cross-pane",
    title: "Cross-pane data flow",
    body: "Any output is reusable as input. Library tracks every produced artifact for re-editing.",
    size: "L",
  },
  {
    id: "sums",
    title: "Hash · SHA256SUMS verification",
    body: "Drop the SUMS file alongside its targets. Per-line ✓ / ✗ / missing. Algorithm auto-detected by hex length. Path-traversal hardened.",
    size: "M",
  },
  {
    id: "recipes",
    title: "Text Tools · Saved Recipes",
    body: "Save any pipeline as a named recipe and replay tomorrow. Tolerant Codable on `recipes.json` so upgrades don't drop data.",
    size: "M",
  },
  {
    id: "history-regex",
    title: "History · regex search + ×N dedup",
    body: "⌘⇧. toggles plain ↔ regex with ReDoS guard. Repeats fold into one entry with a soft-tint ×N badge.",
    size: "S",
  },
  {
    id: "url-scheme",
    title: "URL scheme verb coverage",
    body: "`trove://pane/...`, `calc?expr=`, `snippet/copy?name=`, `history/paste?index=`, `qr?text=`. Frontmost-gated on dangerous verbs.",
    size: "M",
  },
  {
    id: "brew",
    title: "Homebrew Cask formula",
    body: "`brew tap arnavgoel/trove && brew install --cask trove`. Lives at `Casks/trove.rb`.",
    size: "S",
  },
  {
    id: "xdg",
    title: "XDG `~/.config/trove/` support",
    body: "$TROVE_CONFIG_HOME > $XDG_CONFIG_HOME/trove > ~/.config/trove > native. All 11 storage-touching panes use one resolver. No silent migration.",
    size: "S",
  },
  {
    id: "recorder-pro",
    title: "Recorder pro pass: 17 items",
    body: "Webcam PIP, keystroke overlay, click ripple, floating Stop, global stop hotkey ⌘⇧., quality slider, mic gain, filename tokens, auto-trim silence, countdown, menu-bar dot, preview sheet, voice-activity auto-pause, webcam-only mode, MOV with separate audio tracks.",
    size: "L",
  },
];

const IN_PROGRESS: Item[] = [
  {
    id: "swiftpm",
    title: "SwiftPM build (`Package.swift`)",
    body: "Migrating the existing `build-macapp` flow onto SwiftPM. Current focus: resolve `swift-tools-version` vs `unsafeFlags` conflict that hangs the build. The current `build-macapp` flow keeps shipping in the meantime.",
    size: "M",
  },
];

const DEFERRED: Item[] = [
  {
    id: "auto-zoom",
    title: "Auto-zoom on click (Screen Studio-style)",
    body: "Stamp click coords during recording, run AVMutableComposition with custom layer transforms at finalize. ~500 LOC post-process.",
    size: "M",
  },
  {
    id: "gif-export",
    title: "GIF export",
    body: "AVAssetReader → CGImage frames → ImageIO `CGImageDestinationCreateWithURL(fileType: gif)` + median-cut palette + Floyd-Steinberg dithering. ~300 LOC.",
    size: "M",
  },
  {
    id: "multi-segment",
    title: "Multi-segment recording",
    body: "Config change mid-record → close writer → open new writer → concat at finalize. Touches the engine state machine.",
    size: "L",
  },
  {
    id: "multi-display-pip",
    title: "Multi-display PIP",
    body: "Two `SCStream` instances composited side-by-side via CIContext. Engine writer needs a CVPixelBuffer pipeline (currently appends CMSampleBuffer). ~600 LOC.",
    size: "L",
  },
  {
    id: "trim-editor",
    title: "Built-in trim editor",
    body: "Drag-handles + split + delete + rearrange clips, output via AVMutableComposition. Mini NLE in a sheet. ~1500 LOC.",
    size: "L",
  },
  {
    id: "whisper",
    title: "Local Whisper transcription",
    body: "Embed `whisper.cpp` via WhisperKit or SwiftPM target. Run on the last recording. Transcript pane with per-segment timestamps, search, copy.",
    size: "L",
  },
  {
    id: "virtual-camera",
    title: "Virtual camera output",
    body: "Apple's `CMIOExtension` (macOS 12.3+). Ship a separate CMIO bundle Trove pumps frames into. Zoom / Teams see 'Trove Virtual Camera'.",
    size: "L",
  },
  {
    id: "scrolling-capture",
    title: "Scrolling capture",
    body: "Scroll wheel emulator while capturing via SCStream, stitch overlapping frames at finalize via feature matching.",
    size: "L",
  },
];

function Bucket({
  title,
  blurb,
  items,
  tint,
}: {
  title: string;
  blurb: string;
  items: Item[];
  tint: string;
}) {
  return (
    <section className="mb-16">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white">
          {title}
        </h2>
        <span className="text-[12px] text-[var(--color-fg-mute)]">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)] mb-6 max-w-2xl">
        {blurb}
      </p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="pane rounded-xl p-5 flex gap-4"
            style={{ borderColor: `${tint}30` }}
          >
            <span
              className="inline-flex shrink-0 mt-0.5 w-6 h-6 rounded-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ background: `${tint}22`, color: tint }}
              title={
                it.size === "S"
                  ? "Small"
                  : it.size === "M"
                    ? "Medium"
                    : "Large"
              }
            >
              {it.size}
            </span>
            <div>
              <div className="text-[15px] font-medium text-white">
                {it.title}
              </div>
              <div className="text-[14px] text-[var(--color-fg-dim)] leading-[1.65] mt-1.5">
                {it.body}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function RoadmapPage() {
  return (
    <PageShell
      eyebrow="Roadmap"
      title="What's shipped, what's next, what's deferred"
      lede="Bucketed by status, not by quarter. Items move up when they ship and stay parked when they need a focused session to do right. Nothing on this page is aspirational."
    >
      <JsonLd
        data={webPageLd(
          "Trove Roadmap",
          "Shipped, in-progress, and deferred items for Trove.",
          "https://gettrove.vercel.app/roadmap",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "Roadmap", url: "https://gettrove.vercel.app/roadmap" },
        ])}
      />

      <Bucket
        title="Shipped: v1.11.2"
        blurb="On the stable channel as of May 31, 2026. The changelog has the per-build breakdown."
        items={SHIPPED}
        tint="#5be3a4"
      />
      <Bucket
        title="In progress"
        blurb="Being built right now. Beta-channel users see these before they reach stable."
        items={IN_PROGRESS}
        tint="#4cb8ff"
      />
      <Bucket
        title="Deferred"
        blurb="Worth doing, but worth doing properly. Each item needs its own week: none are slipping into the next point release."
        items={DEFERRED}
        tint="#ffd166"
      />
    </PageShell>
  );
}
