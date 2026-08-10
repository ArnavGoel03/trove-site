import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { articleLd, breadcrumbLd } from "@/components/JsonLd";
import { fetchChangelog, renderMarkdown } from "@/lib/changelog";
import { slugifyVersion } from "@/lib/slug";
import { pageTitle, STUDIO } from "@/lib/brand";
import { TOOL_COUNT } from "@/lib/panes";
import { releasePageURL } from "@/lib/releases";

export const metadata: Metadata = {
  title: pageTitle("Changelog"),
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
            href={releasePageURL()}
            target="_blank"
            rel="noopener"
          >
            the published release notes
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
            `Live-sourced release notes for Trove, the ${TOOL_COUNT}-tool native macOS utility.`,
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
        <div className="pane rounded-xl p-6 text-caption text-fg-dim">
          Couldn&rsquo;t reach the source changelog right now.{" "}
          <a
            className="md-link"
            href={releasePageURL()}
            target="_blank"
            rel="noopener"
          >
            Read the release notes on GitHub →
          </a>
        </div>
      ) : (
        <>
          <nav
            aria-label="Version index"
            className="pane rounded-xl p-5 mb-12 sticky top-[88px] z-10 max-h-[40vh] overflow-y-auto"
          >
            <div className="text-micro uppercase tracking-[0.2em] text-fg-mute mb-3">
              Jump to version
            </div>
            <ul className="flex flex-wrap gap-2">
              {entries.map((e) => (
                <li key={e.version}>
                  <Link
                    href={`#${slugifyVersion(e.version)}`}
                    className={`inline-flex items-center gap-2 rounded-full border border-line-soft px-3 py-1 text-caption hover:border-line-strong transition-colors ${
                      e.isStable
                        ? "bg-accent/10 text-fg"
                        : "text-fg-dim"
                    }`}
                  >
                    <span>{e.version}</span>
                    {e.isStable ? (
                      <span className="text-micro uppercase text-accent">
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
                <header className="flex flex-wrap items-baseline gap-3 mb-6 pb-4 border-b border-line-soft">
                  <h2 className="text-title font-semibold text-fg">
                    {e.version}
                  </h2>
                  <span className="text-caption text-fg-mute">
                    {e.date}
                  </span>
                  {e.isStable ? (
                    <span className="ml-auto inline-flex items-center rounded-full border border-accent/40 px-2.5 py-0.5 text-micro uppercase text-accent">
                      Stable
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center rounded-full border border-line-soft px-2.5 py-0.5 text-micro uppercase text-fg-mute">
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
