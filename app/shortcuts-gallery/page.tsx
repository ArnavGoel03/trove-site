import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { INTENTS, type IntentCategory } from "@/lib/intents";

export const metadata: Metadata = {
  title: "Shortcuts gallery: Trove",
  description:
    "Every macOS Shortcuts AppIntent Trove ships. Browse the catalog before opening the Shortcuts editor.",
  alternates: { canonical: "https://gettrove.vercel.app/shortcuts-gallery" },
};

const CATEGORIES: { name: IntentCategory; tagline: string; accent: string }[] =
  [
    {
      name: "Stage",
      tagline: "Drive Trove's multi-clipboard surface from a Shortcut.",
      accent: "#ff7a45",
    },
    {
      name: "Compute",
      tagline: "Calculator, QR, hashing, all callable as Shortcut actions.",
      accent: "#4cb8ff",
    },
    {
      name: "Snippets",
      tagline: "Rich pickers: name + body preview right in the editor.",
      accent: "#b27cff",
    },
    {
      name: "Clipboard history",
      tagline:
        "Index-based and picker-based access to persisted clipboard entries.",
      accent: "#5be3a4",
    },
  ];

const KIND_TINT: Record<string, string> = {
  Action: "#ffd166",
  "Entity picker": "#b27cff",
  Query: "#4cb8ff",
};

export default function ShortcutsGalleryPage() {
  return (
    <PageShell
      wide
      eyebrow="macOS Shortcuts"
      title="Shortcuts gallery"
      lede={
        <>
          {INTENTS.length} AppIntents shipped in Trove 1.11.2. Every entity
          intent renders a rich picker in the Shortcuts editor, name + body
          preview on snippets, kind + capture date on clipboard entries. Open
          Shortcuts.app and search for &ldquo;Trove&rdquo; to start chaining.
        </>
      }
    >
      <JsonLd
        data={webPageLd(
          "Trove Shortcuts Gallery",
          "Catalog of every Trove AppIntent for macOS Shortcuts.",
          "https://gettrove.vercel.app/shortcuts-gallery",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          {
            name: "Shortcuts gallery",
            url: "https://gettrove.vercel.app/shortcuts-gallery",
          },
        ])}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[
          { label: "Intents total", value: INTENTS.length },
          {
            label: "Actions",
            value: INTENTS.filter((i) => i.kind === "Action").length,
          },
          {
            label: "Entity pickers",
            value: INTENTS.filter((i) => i.kind === "Entity picker").length,
          },
          {
            label: "Queries",
            value: INTENTS.filter((i) => i.kind === "Query").length,
          },
        ].map((s) => (
          <div key={s.label} className="pane rounded-xl p-4">
            <div className="text-[28px] font-semibold tracking-tight text-white">
              {s.value}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)] mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-14">
        {CATEGORIES.map((cat) => {
          const intents = INTENTS.filter((i) => i.category === cat.name);
          return (
            <section key={cat.name}>
              <header className="mb-5">
                <div
                  className="text-[12px] uppercase tracking-[0.22em] mb-2"
                  style={{ color: cat.accent }}
                >
                  {cat.name}
                </div>
                <p className="text-[15px] text-[var(--color-fg-dim)]">
                  {cat.tagline}
                </p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {intents.map((it) => {
                  const Icon = it.icon;
                  return (
                    <article
                      key={it.name}
                      className="pane rounded-xl p-5"
                      style={{ borderColor: `${cat.accent}25` }}
                    >
                      <header className="flex items-start gap-3 mb-3">
                        <span
                          className="inline-flex w-9 h-9 rounded-lg items-center justify-center shrink-0"
                          style={{
                            background: `${cat.accent}22`,
                            color: cat.accent,
                          }}
                        >
                          <Icon size={18} strokeWidth={1.5} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-[15px] font-medium text-white leading-snug">
                            {it.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]"
                              style={{
                                background: `${KIND_TINT[it.kind]}18`,
                                color: KIND_TINT[it.kind],
                              }}
                            >
                              {it.kind}
                            </span>
                            <code className="font-mono text-[10.5px] text-[var(--color-fg-mute)]">
                              {it.name}
                            </code>
                          </div>
                        </div>
                      </header>
                      <p className="text-[13.5px] leading-[1.65] text-[var(--color-fg-dim)]">
                        {it.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
