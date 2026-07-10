import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import JsonLd, { howToLd, breadcrumbLd } from "@/components/JsonLd";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { PANES } from "@/lib/panes";
import { slugifyPane } from "@/lib/slug";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title}: Trove guide`,
    description: guide.lede,
    alternates: {
      canonical: `https://gettrove.vercel.app/guides/${slug}`,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const panes = guide.panes
    .map((n) => PANES.find((p) => p.name === n))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const url = `https://gettrove.vercel.app/guides/${slug}`;

  return (
    <PageShell
      eyebrow={`Guide · ${guide.eyebrow} · ${guide.estimate}`}
      title={guide.title}
      lede={guide.lede}
    >
      <JsonLd
        data={howToLd({
          name: guide.title,
          description: guide.lede,
          url,
          steps: guide.steps,
          totalTime: `PT${parseInt(guide.estimate, 10) || 3}M`,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "Guides", url: "https://gettrove.vercel.app/guides" },
          { name: guide.eyebrow, url },
        ])}
      />

      <ol className="space-y-4 mb-12">
        {guide.steps.map((s, i) => (
          <li
            key={i}
            className="pane rounded-xl p-5 flex gap-4"
          >
            <span className="shrink-0 inline-flex w-8 h-8 rounded-full items-center justify-center bg-accent/12 text-[var(--color-accent)] font-mono text-[13px]">
              {i + 1}
            </span>
            <div>
              <div className="text-[15px] font-medium text-white">
                {s.name}
              </div>
              <p className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)] mt-1.5">
                {s.text}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {guide.outro ? (
        <div className="pane rounded-xl p-5 mb-12 text-[14px] leading-[1.7] text-[var(--color-fg-dim)]">
          {guide.outro}
        </div>
      ) : null}

      {panes.length > 0 ? (
        <section>
          <h2 className="text-[18px] font-semibold tracking-tight text-white mb-4">
            Panes used in this guide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {panes.map((p) => {
              const Icon = p.icon;
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
                    <Icon size={18} strokeWidth={1.5} />
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
