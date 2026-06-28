import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Press kit: Trove",
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
  { label: "Panes shipped (v1.11.2)", value: "53" },
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
    body: "Trove is a single ~14 MB native Mac app that bundles 53 panes (clipboard, capture, system, files, storage) and replaces around a dozen menu-bar utilities. Scriptable from Shortcuts. Local-only. No telemetry.",
  },
  {
    angle: "For the privacy-first reader",
    body: "One outbound endpoint: api.github.com, polled every six hours for new releases. OCR runs on-device via Apple Vision. Recordings and screenshots stay on disk. No analytics, no crash reporter, no cloud sync.",
  },
  {
    angle: "For the power-user reader",
    body: "Eleven macOS Shortcuts intents with rich entity pickers for snippets and clipboard history, a full `trove://` URL scheme, a ChordRegistry that keeps the ⌘? cheatsheet in sync with the code, and Saved Recipes in Text Tools. The Recorder pane shipped 17 pro features in one pass: click ripple, keystroke overlay, voice-activity auto-pause, separate audio tracks in the MOV.",
  },
  {
    angle: "For the bundle-fatigue reader",
    body: "If you pay for Raycast Pro plus iStat Menus plus CleanMyMac plus Bartender plus TextSniper plus Stats, Trove covers enough of that stack to pay for itself by week six. $10 per year, not per month.",
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
      lede="Pitch lines, key facts, brand assets. Everything a writer or reviewer needs to file a story without playing email tag. Missing something? Email and it gets added the same day."
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
          Community + discussions
        </h2>
        <p className="text-[15px] leading-[1.75] text-[var(--color-fg-dim)]">
          Open conversations: feature ideas, pre-release feedback, pane
          requests, weird bugs, happen on{" "}
          <a
            href="https://github.com/ArnavGoel03/trove/discussions"
            target="_blank"
            rel="noopener"
            className="md-link"
          >
            GitHub Discussions
          </a>
          . That&rsquo;s the public square. Reviewers are welcome to lurk for
          quotes; please credit the original poster if you cite a thread.
        </p>
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
