import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { PANES } from "@/lib/panes";
import { chordsForPane } from "@/lib/chords";
import { slugifyPane } from "@/lib/slug";
import { paneDetail } from "@/lib/pane-detail";

type Params = { slug: string };

/**
 * Pre-render every pane page at build time so /pane/<slug> is just a CDN
 * hit. The 33-entry list is small enough that the build cost is trivial.
 */
export function generateStaticParams(): Params[] {
  return PANES.map((p) => ({ slug: slugifyPane(p.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pane = PANES.find((p) => slugifyPane(p.name) === slug);
  if (!pane) return {};
  const title = `${pane.name} — Trove pane`;
  const description = pane.blurb;
  return {
    title,
    description,
    alternates: {
      canonical: `https://gettrove.vercel.app/pane/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://gettrove.vercel.app/pane/${slug}`,
    },
  };
}

export default async function PanePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pane = PANES.find((p) => slugifyPane(p.name) === slug);
  if (!pane) notFound();

  const Icon = pane.icon;
  const chords = chordsForPane(pane.name);
  const detail = paneDetail(pane.name);
  const related = PANES.filter(
    (p) => p.section === pane.section && p.name !== pane.name,
  ).slice(0, 4);

  const url = `https://gettrove.vercel.app/pane/${slug}`;

  return (
    <PageShell
      wide
      eyebrow={`${pane.section} · pane`}
      title={pane.name}
      lede={pane.blurb}
    >
      <JsonLd
        data={webPageLd(`${pane.name} — Trove pane`, pane.blurb, url)}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "Features", url: "https://gettrove.vercel.app/features" },
          { name: pane.name, url },
        ])}
      />

      <div
        className="pane rounded-2xl p-7 sm:p-9 mb-12 flex items-center gap-5"
        style={{
          background: `linear-gradient(180deg, ${pane.accent}14 0%, rgba(255,255,255,0.015) 100%)`,
          borderColor: `${pane.accent}40`,
        }}
      >
        <span
          className="inline-flex w-14 h-14 rounded-2xl items-center justify-center"
          style={{ background: `${pane.accent}22`, color: pane.accent }}
        >
          <Icon size={28} strokeWidth={1.5} />
        </span>
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-mute)]">
            SF Symbol · {pane.sfSymbol}
          </div>
          <div className="text-[14px] text-[var(--color-fg-dim)] mt-1">
            Open from the sidebar, the ⌘K Quick Switcher, or{" "}
            <code className="md-inline">trove://pane/open?pane={pane.name}</code>
          </div>
        </div>
      </div>

      <section className="mb-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-4">
          What it does
        </h2>
        <p className="text-[15px] leading-[1.75] text-[var(--color-fg-dim)]">
          {detail.overview}
        </p>
      </section>

      <section className="mb-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-4">
          Capabilities
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {detail.capabilities.map((c) => (
            <li
              key={c}
              className="pane rounded-xl p-4 text-[14px] leading-relaxed text-[var(--color-fg-dim)]"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      {chords.length > 0 ? (
        <section className="mb-14">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-4">
            Shortcuts
          </h2>
          <div className="pane rounded-xl divide-y divide-white/[0.06]">
            {chords.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-5 py-3 text-[14px]"
              >
                <span className="text-[var(--color-fg-dim)]">{c.label}</span>
                <kbd className="font-mono text-[12px] bg-white/[0.05] border border-white/[0.08] rounded-md px-2 py-0.5 text-white">
                  {c.keys}
                </kbd>
              </div>
            ))}
          </div>
          <Link
            href="/shortcuts"
            className="inline-block mt-3 text-[12px] text-[var(--color-fg-mute)] hover:text-white transition-colors"
          >
            See all shortcuts →
          </Link>
        </section>
      ) : null}

      {detail.urlScheme && detail.urlScheme.length > 0 ? (
        <section className="mb-14">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-4">
            URL scheme
          </h2>
          <div className="pane rounded-xl p-5 space-y-3">
            {detail.urlScheme.map((u) => (
              <div key={u.example}>
                <code className="block font-mono text-[13px] text-white bg-white/[0.04] border border-white/[0.06] rounded-md px-3 py-2">
                  {u.example}
                </code>
                <div className="text-[13px] text-[var(--color-fg-mute)] mt-1">
                  {u.note}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/url-scheme"
            className="inline-block mt-3 text-[12px] text-[var(--color-fg-mute)] hover:text-white transition-colors"
          >
            Full URL scheme reference →
          </Link>
        </section>
      ) : null}

      {detail.privacy ? (
        <section className="mb-14">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-4">
            Privacy
          </h2>
          <div
            className="pane rounded-xl p-5 text-[14px] leading-[1.7] text-[var(--color-fg-dim)]"
            style={{ borderColor: "rgba(91, 227, 164, 0.25)" }}
          >
            {detail.privacy}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-4">
            Other {pane.section} panes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((p) => {
              const RIcon = p.icon;
              return (
                <Link
                  key={p.name}
                  href={`/pane/${slugifyPane(p.name)}`}
                  className="pane rounded-xl p-4 flex items-center gap-3 hover:border-white/20 transition-colors"
                >
                  <span
                    className="inline-flex w-9 h-9 rounded-lg items-center justify-center shrink-0"
                    style={{ background: `${p.accent}22`, color: p.accent }}
                  >
                    <RIcon size={18} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-white">
                      {p.name}
                    </div>
                    <div className="text-[12px] text-[var(--color-fg-mute)] truncate">
                      {p.blurb}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
