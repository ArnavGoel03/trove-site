import { troveOg } from "@/lib/og";
import { PANES } from "@/lib/panes";
import { slugifyPane } from "@/lib/slug";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trove — Pane";

type Params = { slug: string };

// Rendered on demand at the edge per slug. Vercel's edge cache pins each
// generated PNG after first hit; the slug set is immutable, so each card
// is effectively static after first request. The HTML page itself is SSG.
export default async function Image({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pane = PANES.find((p) => slugifyPane(p.name) === slug);
  return troveOg({
    eyebrow: pane?.section ?? "Pane",
    title: pane?.name ?? "Trove pane",
    tagline: pane?.blurb,
  });
}
