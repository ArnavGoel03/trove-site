// Live-source the macos/CHANGELOG.md from the canonical Trove repo and
// parse it into a structured shape the /changelog page can render. The
// raw markdown lives in a separate repo (`ArnavGoel03/trove`) from this
// website (`ArnavGoel03/trove-site`), so we can't read it off disk —
// instead we fetch it from GitHub's raw.githubusercontent.com endpoint
// at build time and revalidate every 6 hours so the page tracks shipped
// changelog edits within one CDN cycle of a push.

export const CHANGELOG_SOURCE_URL =
  "https://raw.githubusercontent.com/ArnavGoel03/trove/main/macos/CHANGELOG.md";

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

const HEADING_RE = /^## \[([^\]]+)\]\s*—\s*(.+)$/;

/** Split the changelog into `## [version] — date` sections. */
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
 * Fetch + parse the changelog from GitHub's raw endpoint. Revalidates
 * every 6h, so pushing a CHANGELOG edit on `main` rolls out to the
 * marketing site within that window. Errors fall back to an empty list
 * so the page still renders chrome instead of crashing.
 */
export async function fetchChangelog(): Promise<ChangelogEntry[]> {
  try {
    const res = await fetch(CHANGELOG_SOURCE_URL, {
      // Vercel-native ISR. 6h ≈ marketing freshness without crushing
      // raw.githubusercontent.com on every visitor.
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseChangelog(text);
  } catch {
    return [];
  }
}

/** Lightweight markdown → React-safe HTML escaper. Handles the subset of
 *  syntax that actually shows up in the changelog: bullets, bold, code,
 *  inline links, `### Subsection` headings, and code fences. Deliberately
 *  not a full markdown engine — keeps the bundle tiny and the output
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
