import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { STUDIO } from "@/lib/brand";
import { COMPARISONS, COMPARISON_SLUGS } from "@/lib/comparisons";

export async function generateStaticParams() {
  return COMPARISON_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARISONS[slug];
  if (!c) return { title: "Not found" };
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `${STUDIO.domain}/compare/${c.slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${STUDIO.domain}/compare/${c.slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const c = COMPARISONS[slug];
  if (!c) return notFound();

  return (
    <>
      <Nav />
      <main id="top" className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="text-caption text-fg-dim mb-6"
        >
          <Link href="/" className="hover:text-white">
            Trove
          </Link>
          <span className="mx-2">›</span>
          <Link href="/compare" className="hover:text-white">
            Compare
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">Trove vs {c.competitor}</span>
        </nav>

        <h1 className="text-[clamp(34px,5vw,52px)] font-semibold tracking-tight leading-[1.05]">
          Trove vs {c.competitor}
        </h1>
        <p className="mt-4 text-lead text-fg-dim leading-relaxed">
          {c.intro}
        </p>

        <section className="mt-12">
          <h2 className="text-lead font-semibold tracking-tight mb-4">
            Side by side
          </h2>
          <div className="rounded-3xl border border-line-soft overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr] text-caption">
              <div className="px-5 py-3 bg-surface-1 font-semibold border-b border-line-soft">
                Trove
              </div>
              <div className="px-5 py-3 bg-surface-1 font-semibold border-b border-line-soft border-l border-line-soft">
                {c.competitor}
              </div>
              {c.highlights.map((row, i) => (
                <FragmentRow
                  key={i}
                  trove={row.trove}
                  them={row.them}
                  last={i === c.highlights.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {c.callouts.map((co) => (
          <section
            key={co.title}
            className="mt-8 rounded-2xl border border-line-soft bg-surface-1 p-5"
          >
            <h3 className="text-body font-semibold">{co.title}</h3>
            <p className="mt-2 text-caption text-fg-dim leading-relaxed">
              {co.body}
            </p>
          </section>
        ))}

        <section className="mt-12">
          <Link
            href="/download"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold"
          >
            {c.cta} →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FragmentRow({
  trove,
  them,
  last,
}: {
  trove: string;
  them: string;
  last: boolean;
}) {
  const border = last ? "" : "border-b border-line-soft";
  return (
    <>
      <div className={`px-5 py-4 ${border} text-caption leading-relaxed`}>
        {trove}
      </div>
      <div
        className={`px-5 py-4 ${border} border-l border-line-soft text-caption leading-relaxed text-fg-dim`}
      >
        {them}
      </div>
    </>
  );
}
