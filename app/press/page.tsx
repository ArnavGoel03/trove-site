import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { Download } from "lucide-react";
import { pageTitle, PLATFORM, STUDIO, TROVE } from "@/lib/brand";
import { TOOL_COUNT } from "@/lib/panes";
import { ISSUES_URL, releasePageURL } from "@/lib/releases";
import { INTENTS } from "@/lib/intents";

export const metadata: Metadata = {
  title: pageTitle("Press kit"),
  description:
    "Pitch lines, key facts, screenshots, and brand assets for press, podcasts, and reviewers covering Trove.",
  alternates: { canonical: `${STUDIO.domain}/press` },
};

const FACTS: { label: string; value: string }[] = [
  { label: "Name", value: "Trove" },
  { label: "Tagline", value: "Your Mac, finally tidy." },
  { label: "Category", value: "macOS productivity utility" },
  { label: "Platform", value: PLATFORM.minMacOS },
  { label: "Architecture", value: PLATFORM.archDetail },
  { label: "Binary size", value: "~14 MB" },
  { label: "Resident memory at rest", value: "< 30 MB" },
  { label: `Panes shipped (v${TROVE.version})`, value: "53" },
  { label: "macOS Shortcuts intents", value: String(INTENTS.length) },
  { label: "Price", value: "on a subscription" },
  { label: "License", value: "Single-user, multi-device" },
  { label: "Distribution", value: "GitHub Releases + Homebrew Cask" },
  { label: "Network use", value: "GitHub Releases poll only (opt-out)" },
  { label: "Telemetry", value: "None" },
  { label: "Source code", value: "Public on GitHub" },
];

const PITCHES = [
  {
    angle: "The one-line",
    body: `Trove is a single ~14 MB native Mac app that bundles ${TOOL_COUNT} tools (clipboard, capture, system, files, storage) and replaces around a dozen menu-bar utilities. Scriptable from Shortcuts. Local-only. No telemetry.`,
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
    body: "If you pay for Raycast Pro plus iStat Menus plus CleanMyMac plus Bartender plus TextSniper plus Stats, Trove covers enough of that stack to pay for itself by week six. on a subscription, not per month.",
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
          `${STUDIO.domain}/press`,
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Press", url: `${STUDIO.domain}/press` },
        ])}
      />

      <section className="mb-14">
        <h2 className="text-lead font-semibold text-fg mb-5">
          Pitch lines
        </h2>
        <div className="space-y-4">
          {PITCHES.map((p) => (
            <article key={p.angle} className="pane rounded-xl p-5">
              <div className="text-micro uppercase tracking-[0.2em] text-accent mb-2">
                {p.angle}
              </div>
              <p className="text-body leading-[1.75] text-fg-dim">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-lead font-semibold text-fg mb-5">
          Key facts
        </h2>
        <dl className="pane rounded-xl overflow-hidden">
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 px-5 py-3 border-b border-line-soft last:border-b-0"
            >
              <dt className="text-micro uppercase text-fg-mute">
                {f.label}
              </dt>
              <dd className="text-caption text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-14">
        <h2 className="text-lead font-semibold text-fg mb-5">
          Brand assets
        </h2>
        <p className="text-caption leading-[1.7] text-fg-dim mb-4 max-w-2xl">
          Use the marks as-is, please. Don&rsquo;t alter the gradient or the
          letterform. If you need an alternate aspect ratio, email us and
          we&rsquo;ll send one over within a business day.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSETS.map((a) => (
            <li key={a.name}>
              <a
                href={a.href}
                className="pane rounded-xl p-4 flex items-center gap-3 hover:border-line-strong transition-colors"
              >
                <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center bg-surface-2 text-fg">
                  <Download size={16} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-caption font-medium text-fg">
                    {a.name}
                  </div>
                  <div className="text-caption text-fg-mute">
                    {a.size}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="text-lead font-semibold text-fg mb-5">
          Community + discussions
        </h2>
        <p className="text-body leading-[1.75] text-fg-dim">
          Feature ideas, pre-release feedback, pane requests and weird bugs all
          go to{" "}
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener"
            className="md-link"
          >
            the public issue tracker
          </a>
          . That&rsquo;s the public square. Reviewers are welcome to lurk for
          quotes; please credit the original poster if you cite a thread.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-lead font-semibold text-fg mb-5">
          Who built this
        </h2>
        <p className="text-body leading-[1.75] text-fg-dim">
          Trove is built by Arnav Goel, an independent macOS developer. Every
          build is published on{" "}
          <a
            href={releasePageURL()}
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
