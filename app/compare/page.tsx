import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { Check, Minus, X } from "lucide-react";
import { PRODUCT, STUDIO } from "@/lib/brand";
import { citedPrice, oldestCheck } from "@/lib/rivals";

export const metadata: Metadata = {
  title: "Compare Trove vs CleanShot X, Loom, iStat, Boop, CleanMyMac, asitop, Raycast, Maccy, Rectangle, DaisyDisk, TextSniper, Alfred, Soulver",
  description:
    "Honest side-by-side: where Trove overlaps with the popular Mac utilities, where it doesn't, and where each one is still the right call.",
  alternates: { canonical: `${STUDIO.domain}/compare` },
};

type Row = {
  feature: string;
  group: string;
  trove: "yes" | "no" | "partial";
  /** Per-competitor mark. Keys must match COMPETITORS[].key. */
  marks: Record<string, "yes" | "no" | "partial">;
  note?: string;
};

const COMPETITORS = [
  { key: "cleanshot", name: "CleanShot X" },
  { key: "loom", name: "Loom" },
  { key: "istat", name: "iStat Menus" },
  { key: "boop", name: "Boop" },
  { key: "cleanmymac", name: "CleanMyMac" },
  { key: "asitop", name: "asitop" },
  { key: "raycast", name: "Raycast" },
  { key: "maccy", name: "Maccy" },
  { key: "rectangle", name: "Rectangle" },
  { key: "daisydisk", name: "DaisyDisk" },
  { key: "textsniper", name: "TextSniper" },
  { key: "alfred", name: "Alfred" },
  { key: "soulver", name: "Soulver" },
  { key: "clop", name: "Clop" },
  { key: "dropover", name: "Dropover" },
  { key: "numi", name: "Numi" },
  { key: "commandx", name: "Command X" },
  { key: "handmirror", name: "Hand Mirror" },
] as const;

/**
 * The price row's footnote, built from the cited ledger.
 *
 * This sentence used to carry thirteen hand-typed prices with no source and no
 * date, four of which disagreed with lib/rivals.ts. Now only the products whose
 * price was actually read from a vendor page get a number; the rest are named
 * without one, which is the honest thing to write about a price nobody here
 * checked. FREE is a claim about a product having no paid tier at all, which is
 * checkable by anyone in a second and does not need a ledger entry.
 */
const FREE = ["Boop", "asitop", "Maccy", "Rectangle"];

const PRICE_NOTE = [
  `Trove: ${PRODUCT.priceAdjective}.`,
  ...COMPETITORS.map(({ name }) => {
    if (FREE.includes(name)) return `${name} is free.`;
    const price = citedPrice(name);
    return price ? `${name}: ${price}.` : null;
  }).filter(Boolean),
  `Prices read from each vendor's own page, oldest check ${oldestCheck()}. Products listed above without a price are ones whose page could not be read reliably, so no figure is claimed for them.`,
].join(" ");

const ROWS: Row[] = [
  {
    group: "Files",
    feature: "Image / video / PDF compression from one drop",
    trove: "yes",
    marks: { clop: "yes", cleanshot: "partial" },
    note: "Replaces Clop: Trove compresses images, video (ffmpeg) and PDFs, plus a lossless PDF optimize mode that keeps selectable text.",
  },
  {
    group: "Files",
    feature: "Drag-and-drop file shelf / staging area",
    trove: "yes",
    marks: { dropover: "yes" },
    note: "Replaces Dropover: the Stage pane holds files and text mid-task and feeds every other tool.",
  },
  {
    group: "Files",
    feature: "Cut & paste files in Finder",
    trove: "yes",
    marks: { commandx: "yes" },
    note: "Replaces Command X: the Move Files pane does true cut/paste relocation.",
  },
  {
    group: "System",
    feature: "Quick webcam / appearance check",
    trove: "yes",
    marks: { handmirror: "yes" },
    note: "Replaces Hand Mirror: the Mirror pane is a flip-capable webcam preview with an opt-in menu-bar toggle.",
  },
  {
    group: "Text + clipboard",
    feature: "Natural-language calculator",
    trove: "yes",
    marks: { numi: "yes", soulver: "yes", raycast: "partial" },
    note: "Replaces Numi: the Calc pane parses natural-language math plus unit/currency/base conversions.",
  },
  // Capture
  {
    group: "Capture",
    feature: "Region screenshot with delay timer",
    trove: "yes",
    marks: {
      cleanshot: "yes",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "partial",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Capture",
    feature: "Screen recording with system audio + mic",
    trove: "yes",
    marks: {
      cleanshot: "yes",
      loom: "yes",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Capture",
    feature: "Webcam PIP during recording",
    trove: "yes",
    marks: {
      cleanshot: "yes",
      loom: "yes",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Capture",
    feature: "Keystroke overlay during recording",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
    note: "Trove ships a CGEventTap-driven HUD pinned to the bottom of the recording.",
  },
  {
    group: "Capture",
    feature: "Click ripple animation",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Capture",
    feature: "Cloud upload + link sharing",
    trove: "no",
    marks: {
      cleanshot: "yes",
      loom: "yes",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
    note: "Trove is local-only. If you need a CDN link you'll keep CleanShot / Loom for that.",
  },
  {
    group: "Capture",
    feature: "MOV export with separate audio tracks",
    trove: "yes",
    marks: {
      cleanshot: "partial",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Capture",
    feature: "On-device OCR + translate",
    trove: "yes",
    marks: {
      cleanshot: "yes",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "yes",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "partial",
      alfred: "no",
      soulver: "no",
    },
    note: "TextSniper does the OCR half on-device but has no translation step.",
  },

  // System
  {
    group: "System",
    feature: "CPU + memory live monitor",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "yes",
      boop: "no",
      cleanmymac: "yes",
      asitop: "yes",
      raycast: "yes",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "System",
    feature: "GPU utilization + VRAM",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "yes",
      boop: "no",
      cleanmymac: "no",
      asitop: "yes",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "System",
    feature: "Battery temperature (Apple Silicon SEP-honest)",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "yes",
      boop: "no",
      cleanmymac: "no",
      asitop: "yes",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
    note: "Trove reads AppleSmartBattery, no private SMC keys.",
  },
  {
    group: "System",
    feature: "Per-process network throughput",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "yes",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "System",
    feature: "Menu-bar weather / calendar widgets",
    trove: "no",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "yes",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "yes",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
    note: "Out of scope. Trove is focused on the utility surface, not menu-bar real estate.",
  },

  // Storage
  {
    group: "Storage",
    feature: "Disk overview + biggest-folder drilldown",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "yes",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "yes",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Storage",
    feature: "Dev cache cleanup (npm/brew/Xcode/etc.)",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "yes",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Storage",
    feature: "Disk speed benchmark",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Storage",
    feature: "Auto-organize ~/Downloads by age/type",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "partial",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },

  // Text + clipboard
  {
    group: "Text + clipboard",
    feature: "Persistent clipboard history",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "yes",
      maccy: "yes",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "yes",
      soulver: "no",
    },
  },
  {
    group: "Text + clipboard",
    feature: "Clipboard regex search + ×N dedup",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "partial",
      maccy: "partial",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "partial",
      soulver: "no",
    },
    note: "Maccy and Alfred dedup and fuzzy-search clipboard items but neither does regex matching.",
  },
  {
    group: "Text + clipboard",
    feature: "Chainable text pipeline (40+ ops)",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "partial",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "partial",
      soulver: "no",
    },
    note: "Boop ships single-op scripts. Trove chains them, saves the chain, replays it. Alfred can approximate this with a custom workflow.",
  },
  {
    group: "Text + clipboard",
    feature: "Saved text-pipeline recipes",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "partial",
      soulver: "no",
    },
  },
  {
    group: "Text + clipboard",
    feature: "Snippets",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "yes",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "yes",
      soulver: "no",
    },
  },

  // Files
  {
    group: "Files",
    feature: "MD5 / SHA-1 / SHA-256 / SHA-512 (4-in-1)",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "partial",
      cleanmymac: "no",
      asitop: "no",
      raycast: "partial",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "partial",
      soulver: "no",
    },
  },
  {
    group: "Files",
    feature: "SHA256SUMS file verification",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "no",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Files",
    feature: "PDF merge / split / compress / OCR",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "partial",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Files",
    feature: "Batch image convert / resize / compress",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "partial",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },

  // Platform
  {
    group: "Platform",
    feature: "macOS Shortcuts intents",
    trove: "yes",
    marks: {
      cleanshot: "partial",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "yes",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Platform",
    feature: "URL scheme automation",
    trove: "yes",
    marks: {
      cleanshot: "partial",
      loom: "no",
      istat: "no",
      boop: "no",
      cleanmymac: "no",
      asitop: "no",
      raycast: "yes",
      maccy: "no",
      rectangle: "partial",
      daisydisk: "no",
      textsniper: "no",
      alfred: "yes",
      soulver: "no",
    },
  },
  {
    group: "Platform",
    feature: "Telemetry / analytics off-device",
    trove: "no",
    marks: {
      cleanshot: "yes",
      loom: "yes",
      istat: "no",
      boop: "no",
      cleanmymac: "yes",
      asitop: "no",
      raycast: "yes",
      maccy: "no",
      rectangle: "no",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
    note: "Lower is better in this row. Trove sits with the privacy-respecting single-purpose apps here, with zero outbound calls beyond release polling.",
  },
  {
    group: "Platform",
    feature: "Source on GitHub",
    trove: "yes",
    marks: {
      cleanshot: "no",
      loom: "no",
      istat: "no",
      boop: "yes",
      cleanmymac: "no",
      asitop: "yes",
      raycast: "no",
      maccy: "yes",
      rectangle: "yes",
      daisydisk: "no",
      textsniper: "no",
      alfred: "no",
      soulver: "no",
    },
  },
  {
    group: "Platform",
    feature: "Annualized price",
    trove: "yes",
    marks: {
      cleanshot: "partial",
      loom: "partial",
      istat: "partial",
      boop: "yes",
      cleanmymac: "partial",
      asitop: "yes",
      raycast: "partial",
      maccy: "yes",
      rectangle: "yes",
      daisydisk: "partial",
      textsniper: "partial",
      alfred: "partial",
      soulver: "partial",
    },
    note: PRICE_NOTE,
  },
];

function Mark({ value }: { value: "yes" | "no" | "partial" }) {
  if (value === "yes")
    return (
      <span className="inline-flex w-6 h-6 rounded-full items-center justify-center bg-[rgba(91,227,164,0.15)] text-[#5be3a4]">
        <Check size={14} strokeWidth={2.5} />
      </span>
    );
  if (value === "partial")
    return (
      <span className="inline-flex w-6 h-6 rounded-full items-center justify-center bg-[rgba(255,209,102,0.15)] text-[#ffd166]">
        <Minus size={14} strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="inline-flex w-6 h-6 rounded-full items-center justify-center bg-surface-2 text-fg-mute">
      <X size={14} strokeWidth={2.5} />
    </span>
  );
}

export default function ComparePage() {
  // Group rows for the section headers.
  const groups = Array.from(new Set(ROWS.map((r) => r.group)));

  return (
    <PageShell
      wide
      eyebrow="Honest comparison"
      title="How Trove compares"
      lede="Where Trove replaces something in your stack and where it doesn't. A few of these apps still win their column outright; the table below tells you which ones, so you can decide what stays in your dock."
    >
      <JsonLd
        data={webPageLd(
          "Compare Trove",
          "Side-by-side feature comparison: Trove vs CleanShot X, Loom, iStat Menus, Boop, CleanMyMac, asitop, Raycast, Maccy, Rectangle, DaisyDisk, TextSniper, Alfred, Soulver.",
          `${STUDIO.domain}/compare`,
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Compare", url: `${STUDIO.domain}/compare` },
        ])}
      />

      <div className="pane rounded-xl overflow-x-auto">
        <table className="w-full text-caption text-left">
          <thead>
            <tr className="border-b border-line-soft">
              <th className="px-4 py-3 font-medium text-fg-mute uppercase text-micro min-w-[260px]">
                Capability
              </th>
              <th className="px-3 py-3 text-center font-medium text-white">
                Trove
              </th>
              {COMPETITORS.map((c) => (
                <th
                  key={c.key}
                  className="px-3 py-3 text-center font-medium text-fg-dim"
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g}>
                <tr>
                  <td
                    colSpan={COMPETITORS.length + 2}
                    className="px-4 pt-6 pb-2 text-micro uppercase tracking-[0.2em] text-accent"
                  >
                    {g}
                  </td>
                </tr>
                {ROWS.filter((r) => r.group === g).map((r) => (
                  <tr
                    key={r.feature}
                    className="border-t border-line-soft"
                    title={r.note}
                  >
                    <td className="px-4 py-3 text-white">
                      <div>{r.feature}</div>
                      {r.note ? (
                        <div className="text-caption text-fg-mute mt-0.5 leading-snug">
                          {r.note}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Mark value={r.trove} />
                    </td>
                    {COMPETITORS.map((c) => (
                      <td key={c.key} className="px-3 py-3 text-center">
                        <Mark value={r.marks[c.key] ?? "no"} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-caption text-fg-mute mt-6 max-w-3xl">
        Legend: <Mark value="yes" /> shipped · <Mark value="partial" /> partial
        or limited · <Mark value="no" /> not present. Annualized prices are at
        the time of writing; see each vendor&rsquo;s site for current pricing.
        Where the row says &ldquo;lower is better&rdquo; in the note, the
        Trove column intentionally shows X.
      </p>
    </PageShell>
  );
}

// React.Fragment shorthand with a key, keeps grouping rows tidy without
// adding a wrapper element to the table layout.
import { Fragment } from "react";
