// Blog index for the /updates section. Posts live as .md files under
// content/updates/*.md with a YAML-ish frontmatter block. We parse at
// build time — no dependencies, no MDX runtime. The renderer reuses the
// same `renderMarkdown` escaper as lib/changelog.ts so styling falls out
// of the existing .md-body block in globals.css.

import { promises as fs } from "node:fs";
import path from "node:path";
import { renderMarkdown } from "@/lib/changelog";

export type UpdatePost = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  excerpt: string;
  tag: string;
  body: string; // raw markdown body
};

const CONTENT_DIR = path.join(process.cwd(), "content", "updates");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  // Tiny frontmatter parser — supports `key: value` lines between two `---`
  // fences at the top of the file. Quotes are stripped if present.
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return { meta, body: m[2] };
}

export async function listUpdates(): Promise<UpdatePost[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const posts: UpdatePost[] = [];
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const slug = file.replace(/\.md$/, "");
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    posts.push({
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? "1970-01-01",
      author: meta.author ?? "Arnav Goel",
      excerpt: meta.excerpt ?? "",
      tag: meta.tag ?? "Update",
      body,
    });
  }
  // Newest first.
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getUpdate(slug: string): Promise<UpdatePost | null> {
  const all = await listUpdates();
  return all.find((p) => p.slug === slug) ?? null;
}

export { renderMarkdown };
