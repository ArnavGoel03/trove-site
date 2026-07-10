// Source the changelog from a committed snapshot of macos/CHANGELOG.md that
// ships inside this repo at content/CHANGELOG.md. The Trove source repo is
// PRIVATE (binary-only distribution: nothing to fork), so the site cannot
// fetch the markdown from GitHub at build time. Instead the release script
// copies CHANGELOG.md into content/ (see scripts/sync-changelog.mjs) and we
// read it straight off disk at build. Zero network, zero auth, and it works
// whether or not the source repo is ever made public.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ChangelogEntry = {
  version: string;
  /** e.g. "2026-05-31" or "Unreleased". */
  date: string;
  /** True if version is `vX.Y.Z` with no pre-release suffix. */
  isStable: boolean;
  /** Heading line (kept verbatim for anchor stability). */
  heading: string;
  /** Raw markdown for the section body (everything until the next `## [`). */
  body: string;
};

// Heading form: `## [1.12.7] - 2026-07-08`. The separator is an ASCII hyphen
// in the authored file; also accept en/e-m dash (via \u escapes, so no dash
// bytes live in this source) in case an editor ever substitutes one.
const HEADING_RE = /^## \[([^\]]+)\]\s*[-\u2013\u2014]\s*(.+)$/;

/** Split the changelog into `## [version] - date` sections. */
export function parseChangelog(markdown: string): ChangelogEntry[] {
  const lines = markdown.split("\n");
  const entries: ChangelogEntry[] = [];
  let current: ChangelogEntry | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (current) {
      current.body = buf.join("\n").trim();
      entries.push(current);
    }
    buf = [];
  };

  for (const line of lines) {
    const m = line.match(HEADING_RE);
    if (m) {
      flush();
      const version = m[1];
      const date = m[2].trim();
      current = {
        version,
        date,
        isStable: /^\d+\.\d+\.\d+$/.test(version),
        heading: line,
        body: "",
      };
      continue;
    }
    if (current) buf.push(line);
  }
  flush();
  return entries;
}

/**
 * Read + parse the committed changelog snapshot at content/CHANGELOG.md.
 * Read at build time (the /changelog page is statically generated), so the
 * file is baked into the deploy with no runtime I/O. A missing or unreadable
 * file falls back to an empty list so the page still renders its chrome
 * instead of crashing.
 */
export async function fetchChangelog(): Promise<ChangelogEntry[]> {
  try {
    const md = readFileSync(
      join(process.cwd(), "content", "CHANGELOG.md"),
      "utf8",
    );
    return parseChangelog(md);
  } catch {
    return [];
  }
}

/** Lightweight markdown → React-safe HTML escaper. Handles the subset of
 *  syntax that actually shows up in the changelog: bullets, bold, code,
 *  inline links, `### Subsection` headings, and code fences. Deliberately
 *  not a full markdown engine, which keeps the bundle tiny and the output
 *  predictable. */
export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inCode = false;

  const inline = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="md-link" rel="noopener" target="_blank">$1</a>',
      );

  let bullets: string[] = [];
  const flushBullets = () => {
    if (bullets.length) {
      out.push(
        '<ul class="md-ul">' +
          bullets.map((b) => `<li>${inline(b)}</li>`).join("") +
          "</ul>",
      );
      bullets = [];
    }
  };

  for (const raw of lines) {
    if (raw.startsWith("```")) {
      flushBullets();
      if (inCode) {
        out.push("</code></pre>");
        inCode = false;
      } else {
        out.push('<pre class="md-pre"><code>');
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      out.push(
        raw
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;"),
      );
      continue;
    }
    if (/^### /.test(raw)) {
      flushBullets();
      out.push(`<h3 class="md-h3">${inline(raw.replace(/^### /, ""))}</h3>`);
      continue;
    }
    if (/^- /.test(raw)) {
      bullets.push(raw.replace(/^- /, ""));
      continue;
    }
    if (/^\s*$/.test(raw)) {
      flushBullets();
      continue;
    }
    if (/^---$/.test(raw)) {
      flushBullets();
      out.push('<hr class="md-hr" />');
      continue;
    }
    flushBullets();
    out.push(`<p class="md-p">${inline(raw)}</p>`);
  }
  flushBullets();
  if (inCode) out.push("</code></pre>");
  return out.join("\n");
}
