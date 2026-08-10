import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { Button, Card, Section, TextLink } from "@/components/ui";
import { PANES, TOOL_COUNT } from "@/lib/panes";
import { chordsForPane } from "@/lib/chords";
import { slugifyPane } from "@/lib/slug";
import { paneDetail } from "@/lib/pane-detail";
import { STUDIO, TROVE } from "@/lib/brand";
import { PRICE_LABEL, TRIAL_LABEL } from "@/lib/pricing";

type Params = { slug: string };

/**
 * Pre-render every pane page at build time so /pane/<slug> is just a CDN hit.
 * The list is small enough that the build cost is trivial.
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
  const title = `${pane.name}: Trove pane`;
  const description = pane.blurb;
  return {
    title,
    description,
    alternates: {
      canonical: `${STUDIO.domain}/pane/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${STUDIO.domain}/pane/${slug}`,
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

  const url = `${STUDIO.domain}/pane/${slug}`;

  return (
    <PageShell
      wide
      eyebrow={`${pane.section} · pane`}
      title={pane.name}
      lede={pane.blurb}
    >
      <JsonLd data={webPageLd(`${pane.name}: Trove pane`, pane.blurb, url)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Features", url: `${STUDIO.domain}/features` },
          { name: pane.name, url },
        ])}
      />

      {/* The accent is per-pane data, mirrored from the app's own sidebar
          colour, so it is the one thing on this page that is legitimately an
          inline style rather than a token. */}
      <div
        className="pane rounded-lg p-6 sm:p-7 flex items-center gap-5"
        style={{
          background: `linear-gradient(180deg, ${pane.accent}14 0%, rgba(255,255,255,0.015) 100%)`,
          borderColor: `${pane.accent}33`,
        }}
      >
        <span
          className="inline-flex size-14 shrink-0 rounded-lg items-center justify-center"
          style={{ background: `${pane.accent}22`, color: pane.accent }}
        >
          <Icon size={28} strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <div className="text-micro uppercase text-fg-mute">
            SF Symbol · {pane.sfSymbol}
          </div>
          <div className="mt-1 text-caption text-fg-dim text-pretty">
            Open it from the sidebar, the ⌘K Quick Switcher, or{" "}
            <code className="md-inline">trove://pane/open?pane={pane.name}</code>
          </div>
        </div>
      </div>

      <Section title="What it does">
        <p className="max-w-2xl text-body text-fg-dim text-pretty">
          {detail.overview}
        </p>
      </Section>

      <Section title="Capabilities">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {detail.capabilities.map((c) => (
            <Card key={c} as="li" className="text-caption text-fg-dim text-pretty">
              {c}
            </Card>
          ))}
        </ul>
      </Section>

      {chords.length > 0 ? (
        <Section title="Shortcuts">
          <div className="divide-y divide-line-soft rounded-lg border border-line-soft bg-surface-1">
            {chords.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-5 py-3 text-caption"
              >
                <span className="text-fg-dim">{c.label}</span>
                <kbd className="rounded-md border border-line-soft bg-surface-2 px-2 py-0.5 font-mono text-caption text-fg">
                  {c.keys}
                </kbd>
              </div>
            ))}
          </div>
          <p className="mt-3 text-caption text-fg-mute">
            <TextLink href="/shortcuts">See every shortcut</TextLink>
          </p>
        </Section>
      ) : null}

      {detail.urlScheme && detail.urlScheme.length > 0 ? (
        <Section title="URL scheme">
          <div className="space-y-3 rounded-lg border border-line-soft bg-surface-1 p-5">
            {detail.urlScheme.map((u) => (
              <div key={u.example}>
                <code className="block rounded-md border border-line-soft bg-surface-1 px-3 py-2 font-mono text-caption text-fg">
                  {u.example}
                </code>
                <div className="mt-1 text-caption text-fg-mute">{u.note}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-caption text-fg-mute">
            <TextLink href="/url-scheme">Full URL scheme reference</TextLink>
          </p>
        </Section>
      ) : null}

      {detail.privacy ? (
        <Section title="Privacy">
          <div className="rounded-lg border border-line-soft border-l-2 border-l-accent bg-surface-1 p-5 text-caption text-fg-dim text-pretty">
            {detail.privacy}
          </div>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section title={`Other ${pane.section} panes`}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((p) => {
              const RIcon = p.icon;
              return (
                <Link
                  key={p.name}
                  href={`/pane/${slugifyPane(p.name)}`}
                  className="flex items-center gap-3 rounded-lg border border-line-soft bg-surface-1 p-4 transition-colors duration-[--duration-base] hover:border-line-strong hover:bg-surface-2"
                >
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${p.accent}22`, color: p.accent }}
                  >
                    <RIcon size={18} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-caption font-medium text-fg">
                      {p.name}
                    </div>
                    <div className="truncate text-caption text-fg-mute">
                      {p.blurb}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      ) : null}

      {/*
        Every pane page is a landing page: someone searching for one tool
        arrives here and, before this existed, left without ever being told
        what the app costs or that the pane is one of many. A page that ranks
        and then asks for nothing is a page that does not pay for itself.
      */}
      <Section title={`${pane.name} is one of ${TOOL_COUNT}`}>
        <p className="max-w-2xl text-body text-fg-dim text-pretty">
          {pane.name} is not sold separately. It ships inside {TROVE.name}{" "}
          alongside every other tool in the app, for {PRICE_LABEL}, after a{" "}
          {TRIAL_LABEL}. One download, one licence, no per-feature upsell.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/download">Download {TROVE.name}</Button>
          <Button href="/features" tone="secondary">
            See all {TOOL_COUNT} tools
          </Button>
        </div>
      </Section>
    </PageShell>
  );
}
