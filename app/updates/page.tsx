import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { listUpdates } from "@/lib/updates";
import { pageTitle, STUDIO } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Updates"),
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

      <div className="mb-10 flex items-center gap-3 text-caption text-fg-dim">
        <a
          href="/updates/rss.xml"
          className="inline-flex items-center gap-1.5 rounded-full border border-line-soft px-3 py-1 hover:border-line-strong transition-colors"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          RSS feed
        </a>
        <span className="text-fg-mute">
          {posts.length} post{posts.length === 1 ? "" : "s"}
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="pane rounded-xl p-6 text-caption text-fg-dim">
          Nothing here yet. Come back soon.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/updates/${p.slug}`}
              className="block pane rounded-xl p-6 hover:border-line-strong transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-micro uppercase tracking-[0.2em] text-accent">
                  {p.tag}
                </span>
                <span className="text-caption text-fg-mute font-mono tabular-nums">
                  {p.date}
                </span>
              </div>
              <h2 className="text-lead font-semibold text-fg mb-2">
                {p.title}
              </h2>
              <p className="text-caption leading-[1.7] text-fg-dim">
                {p.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
