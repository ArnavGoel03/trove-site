import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { GLOBAL_CHORDS, PANE_CHORDS } from "@/lib/chords";
import { PANES } from "@/lib/panes";
import { slugifyPane } from "@/lib/slug";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Shortcuts cheatsheet — Trove",
  description:
    "Every Trove keyboard chord, app-wide and per-pane. Printable cheatsheet sourced from the in-app ChordRegistry.",
  alternates: { canonical: "https://gettrove.vercel.app/shortcuts" },
};

function ChordRow({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-[13.5px] border-b border-white/[0.04] last:border-b-0">
      <span className="text-[var(--color-fg-dim)]">{label}</span>
      <kbd className="font-mono text-[12px] bg-white/[0.05] border border-white/[0.08] rounded-md px-2 py-0.5 text-white shrink-0">
        {keys}
      </kbd>
    </div>
  );
}

export default function ShortcutsPage() {
  // Build pane-by-pane entries from the same registry the macOS app reads.
  const panesWithChords = PANES.filter(
    (p) => (PANE_CHORDS[p.name] ?? []).length > 0,
  );

  return (
    <PageShell
      wide
      eyebrow="Reference"
      title="Keyboard shortcuts"
      lede={
        <>
          Every chord Trove ships, mirrored from the in-app{" "}
          <code className="md-inline">ChordRegistry</code>. ⌘? inside the app
          opens the same list, with the current pane&rsquo;s chords floated to
          the top.
        </>
      }
    >
      <JsonLd
        data={webPageLd(
          "Trove Shortcuts",
          "Cheatsheet of every keyboard shortcut Trove ships.",
          "https://gettrove.vercel.app/shortcuts",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "Shortcuts", url: "https://gettrove.vercel.app/shortcuts" },
        ])}
      />

      <div className="flex justify-end mb-8 print:hidden">
        <PrintButton />
      </div>

      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white">
            App-wide
          </h2>
          <span className="text-[12px] text-[var(--color-fg-mute)]">
            Works in every pane
          </span>
        </div>
        <div className="pane rounded-xl overflow-hidden">
          {GLOBAL_CHORDS.map((c, i) => (
            <ChordRow key={i} keys={c.keys} label={c.label} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-6">
          Per pane
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {panesWithChords.map((p) => {
            const chords = PANE_CHORDS[p.name] ?? [];
            const Icon = p.icon;
            return (
              <div
                key={p.name}
                className="pane rounded-xl overflow-hidden break-inside-avoid"
                style={{ borderColor: `${p.accent}30` }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
                  style={{ background: `${p.accent}10` }}
                >
                  <span
                    className="inline-flex w-8 h-8 rounded-lg items-center justify-center"
                    style={{ background: `${p.accent}22`, color: p.accent }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </span>
                  <Link
                    href={`/pane/${slugifyPane(p.name)}`}
                    className="text-[15px] font-medium text-white hover:text-[var(--color-accent)] transition-colors"
                  >
                    {p.name}
                  </Link>
                </div>
                {chords.map((c, i) => (
                  <ChordRow key={i} keys={c.keys} label={c.label} />
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-[12px] text-[var(--color-fg-mute)] mt-10 max-w-2xl">
        Panes without bespoke chords fall through to the app-wide list only.
        Trove&rsquo;s in-app overlay (⌘?) merges both views and floats the
        current pane to the top.
      </p>
    </PageShell>
  );
}
