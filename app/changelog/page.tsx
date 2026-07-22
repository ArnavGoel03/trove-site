import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { articleLd, breadcrumbLd } from "@/components/JsonLd";
import { fetchChangelog, renderMarkdown } from "@/lib/changelog";
import { slugifyVersion } from "@/lib/slug";
import { STUDIO } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Changelog: Trove",
  description:
    "Every shipped change in Trove, live-sourced from the canonical CHANGELOG.md. Stable releases, beta builds, and pre-release history.",
  alternates: { canonical: `${STUDIO.domain}/changelog` },
};

// Use ISR: the source markdown is fetched + parsed at build time and
// revalidated every 6 hours (see lib/changelog.ts). Page itself is
// static HTML between revalidations so visitors get the CDN-cached
// version, not a cold function invocation.
export const revalidate = 21600;

export default async function ChangelogPage() {
  const entries = await fetchChangelog();
  const stableCount = entries.filter((e) => e.isStable).length;
  const betaCount = entries.length - stableCount;

  return (
    <PageShell
      eyebrow="Release notes"
      title="Changelog"
      lede={
        <>
          Every shipped change in Trove, live-sourced from{" "}
          <a
            className="md-link"
            href="https://github.com/ArnavGoel03/trove/blob/main/macos/CHANGELOG.md"
            target="_blank"
            rel="noopener"
          >
            macos/CHANGELOG.md
          </a>{" "}
          on the canonical repo. {stableCount} stable
          {stableCount === 1 ? " release" : " releases"} and {betaCount} beta
          builds since 1.0.0.
        </>
      }
    >
      <JsonLd
        data={articleLd({
          headline: "Trove Changelog",
          description:
            "Live-sourced release notes for Trove, the 40+ tool native macOS utility.",
          url: `${STUDIO.domain}/changelog`,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Changelog", url: `${STUDIO.domain}/changelog` },
        ])}
      />

      {entries.length === 0 ? (
        <div className="pane rounded-xl p-6 text-[14px] text-[var(--color-fg-dim)]">
          Couldn&rsquo;t reach the source changelog right now.{" "}
          <a
            className="md-link"
            href="https://github.com/ArnavGoel03/trove/blob/main/macos/CHANGELOG.md"
            target="_blank"
            rel="noopener"
          >
            Read it on GitHub →
          </a>
        </div>
      ) : (
        <>
          <nav
            aria-label="Version index"
            className="pane rounded-xl p-5 mb-12 sticky top-[88px] z-10 max-h-[40vh] overflow-y-auto"
          >
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-3">
              Jump to version
            </div>
            <ul className="flex flex-wrap gap-2">
              {entries.map((e) => (
                <li key={e.version}>
                  <Link
                    href={`#${slugifyVersion(e.version)}`}
                    className={`inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1 text-[12px] hover:border-white/20 transition-colors ${
                      e.isStable
                        ? "bg-accent/10 text-white"
                        : "text-[var(--color-fg-dim)]"
                    }`}
                  >
                    <span>{e.version}</span>
                    {e.isStable ? (
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                        stable
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {entries.map((e) => (
              <section
                key={e.version}
                id={slugifyVersion(e.version)}
                className="scroll-mt-32"
              >
                <header className="flex flex-wrap items-baseline gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                  <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-white">
                    {e.version}
                  </h2>
                  <span className="text-[13px] text-[var(--color-fg-mute)]">
                    {e.date}
                  </span>
                  {e.isStable ? (
                    <span className="ml-auto inline-flex items-center rounded-full border border-[var(--color-accent)]/40 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                      Stable
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
                      Beta
                    </span>
                  )}
                </header>
                <div
                  className="md-body"
                  // renderMarkdown is a tightly-scoped escaper that only emits
                  // the subset of HTML we hand-write above (no user input).
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(e.body) }}
                />
              </section>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
