// Slug helpers shared across /pane/[slug], /changelog version anchors,
// /guides, and sitemap generation. Centralized so the URL shape stays
// consistent across pages — change the rules here and every consumer
// picks it up.

/** Turn a pane name like "Text Tools" into "text-tools". */
export function slugifyPane(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Turn a semver like "1.1.0-beta.13" into "v1-1-0-beta-13" (anchor-safe). */
export function slugifyVersion(version: string): string {
  return "v" + version.replace(/[^a-zA-Z0-9]+/g, "-").replace(/-+$/g, "");
}
