import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { GLOBAL_CHORDS, PANE_CHORDS } from "@/lib/chords";
import { PANES } from "@/lib/panes";
import { slugifyPane } from "@/lib/slug";
import PrintButton from "@/components/PrintButton";
import { pageTitle, STUDIO } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Shortcuts cheatsheet"),
  description:
    "Every Trove keyboard chord, app-wide and per-pane. Printable cheatsheet sourced from the in-app ChordRegistry.",
  alternates: { canonical: `${STUDIO.domain}/shortcuts` },
};

function ChordRow({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-caption border-b border-line-soft last:border-b-0">
      <span className="text-fg-dim">{label}</span>
      <kbd className="font-mono text-caption bg-surface-2 border border-line-soft rounded-md px-2 py-0.5 text-fg shrink-0">
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
          `${STUDIO.domain}/shortcuts`,
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Shortcuts", url: `${STUDIO.domain}/shortcuts` },
        ])}
      />

      <div className="flex justify-end mb-8 print:hidden">
        <PrintButton />
      </div>

      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lead font-semibold text-fg">
            App-wide
          </h2>
          <span className="text-caption text-fg-mute">
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
        <h2 className="text-lead font-semibold text-fg mb-6">
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
                  className="flex items-center gap-3 px-4 py-3 border-b border-line-soft"
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
                    className="text-body font-medium text-fg hover:text-accent transition-colors"
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

      <p className="text-caption text-fg-mute mt-10 max-w-2xl">
        Panes without bespoke chords fall through to the app-wide list only.
        Trove&rsquo;s in-app overlay (⌘?) merges both views and floats the
        current pane to the top.
      </p>
    </PageShell>
  );
}
