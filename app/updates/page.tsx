import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { listUpdates } from "@/lib/updates";
import { STUDIO } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Updates — Trove",
  description:
    "Release deep-dives, devlogs, and behind-the-scenes notes from the Trove project.",
  alternates: { canonical: `${STUDIO.domain}/updates` },
};

export const revalidate = 21600;

export default async function UpdatesPage() {
  const posts = await listUpdates();
  return (
    <PageShell
      eyebrow="Blog"
      title="Updates"
      lede="Release deep-dives, devlogs, and the occasional rabbit hole. Everything is also syndicated as an RSS feed."
    >
      <JsonLd
        data={webPageLd(
          "Trove Updates",
          "Release deep-dives and devlogs for Trove.",
          `${STUDIO.domain}/updates`,
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Updates", url: `${STUDIO.domain}/updates` },
        ])}
      />

      <div className="mb-10 flex items-center gap-3 text-[12.5px] text-[var(--color-fg-dim)]">
        <a
          href="/updates/rss.xml"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1 hover:border-white/20 transition-colors"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          RSS feed
        </a>
        <span className="text-[var(--color-fg-mute)]">
          {posts.length} post{posts.length === 1 ? "" : "s"}
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="pane rounded-xl p-6 text-[14px] text-[var(--color-fg-dim)]">
          Nothing here yet. Come back soon.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/updates/${p.slug}`}
              className="block pane rounded-xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {p.tag}
                </span>
                <span className="text-[12px] text-[var(--color-fg-mute)] font-mono tabular-nums">
                  {p.date}
                </span>
              </div>
              <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-white mb-2">
                {p.title}
              </h2>
              <p className="text-[14.5px] leading-[1.7] text-[var(--color-fg-dim)]">
                {p.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
