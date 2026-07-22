import { listUpdates } from "@/lib/updates";
import { STUDIO } from "@/lib/brand";

// Static RSS 2.0 feed for /updates. Revalidates on the same 6h cycle as
// the rest of the marketing surface so a new post in content/updates/
// rolls out within one CDN cycle of a deploy.
export const revalidate = 21600;

const SITE = STUDIO.domain;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await listUpdates();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE}/updates/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/updates/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Trove — Updates</title>
    <link>${SITE}/updates</link>
    <atom:link href="${SITE}/updates/rss.xml" rel="self" type="application/rss+xml" />
    <description>Release deep-dives, devlogs, and behind-the-scenes notes from the Trove project.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
