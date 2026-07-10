import type { Metadata } from "next";
import {
  Clipboard,
  History,
  StickyNote,
  Calculator,
  KeyRound,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Brand directions",
  robots: { index: false, follow: false },
};

// Solid accent, monochrome base: the "feels like software" school. No
// gradients, no orange/purple. Each card renders the same mini product UI so
// the directions can be judged against each other for real.
type Dir = {
  key: string;
  name: string;
  accent: string;
  accentSoft: string; // low-alpha accent for fills/rings
  note: string;
};

const DIRECTIONS: Dir[] = [
  {
    key: "cobalt",
    name: "Graphite + Cobalt",
    accent: "#3B6FF6",
    accentSoft: "rgba(59,111,246,0.16)",
    note: "Dependable, unmistakably real software. The safe, classic craft-tool read.",
  },
  {
    key: "red",
    name: "Graphite + Signal Red",
    accent: "#E5484D",
    accentSoft: "rgba(229,72,77,0.15)",
    note: "Raycast energy. Reads power tool: bold, distinctive, memorable.",
  },
  {
    key: "emerald",
    name: "Graphite + Emerald",
    accent: "#2E8B6B",
    accentSoft: "rgba(46,139,107,0.16)",
    note: "Calm, private, on-device. Reinforces the nothing-leaves-your-Mac promise.",
  },
];

const TILES = [
  { icon: Clipboard, label: "Stage" },
  { icon: History, label: "History" },
  { icon: StickyNote, label: "Notes" },
  { icon: Calculator, label: "Calc" },
  { icon: KeyRound, label: "Keys" },
  { icon: Globe, label: "API" },
];

function DirectionCard({ dir }: { dir: Dir }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Faux app window, monochrome base + this accent */}
      <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0E1012] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-black/30">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white/20" />
            <span className="w-3 h-3 rounded-full bg-white/20" />
            <span className="w-3 h-3 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center gap-2">
            {/* Solid logo mark in the accent */}
            <span
              className="inline-flex w-5 h-5 rounded-[6px] items-center justify-center text-[11px] font-bold text-white"
              style={{ background: dir.accent }}
            >
              Q
            </span>
            <span className="text-[12px] font-semibold tracking-tight text-white">
              Quiver
            </span>
          </div>
          <div className="w-12" />
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-white leading-tight">
            Three native apps.
            <br />
            One subscription.
          </h3>
          <p className="mt-2 text-[12.5px] text-[#9BA1A9] leading-relaxed">
            Fast, private Mac apps. One key unlocks all three.
          </p>

          {/* Primary + ghost buttons */}
          <div className="mt-4 flex items-center gap-2.5">
            <button
              className="rounded-full px-4 py-2 text-[12.5px] font-semibold text-white"
              style={{ background: dir.accent }}
            >
              Download
            </button>
            <button className="rounded-full px-4 py-2 text-[12.5px] font-medium text-white/85 border border-white/[0.12] bg-white/[0.03]">
              See features
            </button>
          </div>

          {/* Tile grid: one active tile in the accent, one focus ring */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {TILES.map((t, i) => {
              const Icon = t.icon;
              const active = i === 0;
              const focused = i === 4;
              return (
                <div
                  key={t.label}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 border"
                  style={{
                    background: active ? dir.accentSoft : "rgba(255,255,255,0.02)",
                    borderColor: active
                      ? dir.accent
                      : "rgba(255,255,255,0.06)",
                    boxShadow: focused ? `0 0 0 2px ${dir.accent}` : "none",
                  }}
                >
                  <Icon
                    size={16}
                    style={{ color: active ? dir.accent : "rgba(255,255,255,0.8)" }}
                  />
                  <span className="text-[10px] text-[#9BA1A9]">{t.label}</span>
                </div>
              );
            })}
          </div>

          {/* Text link + inline accent */}
          <div className="mt-4 flex items-center justify-between text-[12px]">
            <span className="text-[#9BA1A9]">
              Trial ends in{" "}
              <span style={{ color: dir.accent }} className="font-semibold">
                14 days
              </span>
            </span>
            <span style={{ color: dir.accent }} className="font-medium">
              Learn more
            </span>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ background: dir.accent }}
          />
          <span className="text-[14px] font-semibold text-white">
            {dir.name}
          </span>
          <span className="text-[11.5px] font-mono text-[#6b7280]">
            {dir.accent}
          </span>
        </div>
        <p className="mt-1.5 text-[12.5px] text-[#9BA1A9] leading-relaxed">
          {dir.note}
        </p>
      </div>
    </div>
  );
}

export default function BrandPreview() {
  return (
    <main className="min-h-screen bg-[#0A0B0D] px-6 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#6b7280] mb-3">
            Brand directions
          </p>
          <h1 className="text-[30px] sm:text-[40px] font-semibold tracking-[-0.03em] text-white leading-[1.05]">
            Which one feels like software?
          </h1>
          <p className="mt-4 text-[15px] text-[#9BA1A9] leading-relaxed">
            Monochrome graphite base, one solid accent doing minimal work: the
            premium native-tool look, not an AI launch page. Same mini UI in
            each direction so you can compare the feel, not the mockup. No
            orange, no purple, no gradients.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DIRECTIONS.map((d) => (
            <DirectionCard key={d.key} dir={d} />
          ))}
        </div>
      </div>
    </main>
  );
}
