import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import JsonLd, { articleLd, breadcrumbLd } from "@/components/JsonLd";
import { listUpdates, getUpdate, renderMarkdown } from "@/lib/updates";
import { STUDIO } from "@/lib/brand";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all = await listUpdates();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getUpdate(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Trove`,
    description: post.excerpt,
    alternates: { canonical: `${STUDIO.domain}/updates/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${STUDIO.domain}/updates/${slug}`,
    },
  };
}

export default async function UpdatePostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getUpdate(slug);
  if (!post) notFound();

  return (
    <PageShell eyebrow={post.tag} title={post.title}>
      <JsonLd
        data={articleLd({
          headline: post.title,
          description: post.excerpt,
          url: `${STUDIO.domain}/updates/${slug}`,
          datePublished: post.date,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Updates", url: `${STUDIO.domain}/updates` },
          {
            name: post.title,
            url: `${STUDIO.domain}/updates/${slug}`,
          },
        ])}
      />

      <div className="mb-10 flex items-center gap-3 text-[12.5px] text-[var(--color-fg-dim)]">
        <span className="font-mono tabular-nums text-[var(--color-fg-mute)]">
          {post.date}
        </span>
        <span className="text-[var(--color-fg-mute)]">·</span>
        <span>{post.author}</span>
      </div>

      <article
        className="md-body"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
      />

      <div className="mt-16 pt-8 border-t border-white/[0.06]">
        <Link
          href="/updates"
          className="text-[13.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors"
        >
          ← All updates
        </Link>
      </div>
    </PageShell>
  );
}
