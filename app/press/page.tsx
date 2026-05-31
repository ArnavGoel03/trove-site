import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Press kit — Trove",
  description:
    "Pitch lines, key facts, screenshots, and brand assets for press, podcasts, and reviewers covering Trove.",
  alternates: { canonical: "https://gettrove.vercel.app/press" },
};

const FACTS: { label: string; value: string }[] = [
  { label: "Name", value: "Trove" },
  { label: "Tagline", value: "Your Mac, finally tidy." },
  { label: "Category", value: "macOS productivity utility" },
  { label: "Platform", value: "macOS 13 Ventura and later" },
  { label: "Architecture", value: "Apple Silicon + Intel (universal)" },
  { label: "Binary size", value: "~14 MB" },
  { label: "Resident memory at rest", value: "< 30 MB" },
  { label: "Panes shipped (v1.1.0)", value: "33" },
  { label: "macOS Shortcuts intents", value: "11" },
  { label: "Price", value: "$10 per year" },
  { label: "License", value: "Single-user, multi-device" },
  { label: "Distribution", value: "GitHub Releases + Homebrew Cask" },
  { label: "Network use", value: "GitHub Releases poll only (opt-out)" },
  { label: "Telemetry", value: "None" },
  { label: "Source code", value: "Public on GitHub" },
];

const PITCHES = [
  {
    angle: "The one-line",
    body: "Trove replaces a dozen menu-bar utilities with 33 panes in one ~14 MB native Mac app — clipboard, capture, system, files, and storage — scriptable from Shortcuts, local-only, no telemetry.",
  },
  {
    angle: "For the privacy-first reader",
    body: "Trove makes no outbound calls except a 6-hour GitHub Releases poll for updates. OCR runs on-device via Apple Vision. Recordings and screenshots stay on disk. There's no analytics, no crash reporter, no cloud sync.",
  },
  {
    angle: "For the power-user reader",
    body: "Eleven macOS Shortcuts intents (with rich entity pickers for snippets and clipboard history), a full `trove://` URL scheme, a ChordRegistry-backed ⌘? overlay, and Saved Recipes in Text Tools. The Recorder pane shipped 17 pro features in one pass — Screen Studio-style click ripple, keystroke overlay, voice-activity auto-pause, MOV with separate audio tracks.",
  },
  {
    angle: "For the bundle-fatigue reader",
    body: "If you currently pay for Raycast Pro + iStat Menus + CleanMyMac + Bartender + TextSniper + Stats, Trove replaces enough of that stack to pay for itself in the first month. It's $10/year, not $10/month.",
  },
];

const ASSETS = [
  {
    name: "App icon (1024×1024 PNG)",
    href: "/opengraph-image",
    size: "Generated",
  },
  {
    name: "OpenGraph card (1200×630 PNG)",
    href: "/opengraph-image",
    size: "Generated",
  },
];

export default function PressPage() {
  return (
    <PageShell
      eyebrow="Press"
      title="Press kit"
      lede="Everything a writer, podcaster, or reviewer needs to cover Trove without back-and-forth email. If something's missing, contact us — we'll add it."
    >
      <JsonLd
        data={webPageLd(
          "Trove Press Kit",
          "Pitch lines, key facts, screenshots, and brand assets for press covering Trove.",
          "https://gettrove.vercel.app/press",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "Press", url: "https://gettrove.vercel.app/press" },
        ])}
      />

      <section className="mb-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-5">
          Pitch lines
        </h2>
        <div className="space-y-4">
          {PITCHES.map((p) => (
            <article key={p.angle} className="pane rounded-xl p-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
                {p.angle}
              </div>
              <p className="text-[15px] leading-[1.75] text-[var(--color-fg-dim)]">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-5">
          Key facts
        </h2>
        <dl className="pane rounded-xl overflow-hidden">
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 px-5 py-3 border-b border-white/[0.04] last:border-b-0"
            >
              <dt className="text-[12px] uppercase tracking-[0.15em] text-[var(--color-fg-mute)]">
                {f.label}
              </dt>
              <dd className="text-[14px] text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-5">
          Brand assets
        </h2>
        <p className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)] mb-4 max-w-2xl">
          Use the marks as-is, please. Don&rsquo;t alter the gradient or the
          letterform. If you need an alternate aspect ratio, email us and
          we&rsquo;ll send one over within a business day.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSETS.map((a) => (
            <li key={a.name}>
              <a
                href={a.href}
                className="pane rounded-xl p-4 flex items-center gap-3 hover:border-white/20 transition-colors"
              >
                <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center bg-white/[0.05] text-white">
                  <Download size={16} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[14px] font-medium text-white">
                    {a.name}
                  </div>
                  <div className="text-[12px] text-[var(--color-fg-mute)]">
                    {a.size}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-5">
          Who built this
        </h2>
        <p className="text-[15px] leading-[1.75] text-[var(--color-fg-dim)]">
          Trove is built by Arnav Goel, an independent macOS developer. The
          source code is public on{" "}
          <a
            href="https://github.com/ArnavGoel03/trove"
            target="_blank"
            rel="noopener"
            className="md-link"
          >
            GitHub
          </a>
          , the changelog is{" "}
          <a href="/changelog" className="md-link">
            live-sourced
          </a>
          , and the roadmap is{" "}
          <a href="/roadmap" className="md-link">
            published
          </a>
          . Press inquiries go to{" "}
          <a href="mailto:yashgoel0304@gmail.com" className="md-link">
            yashgoel0304@gmail.com
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}
