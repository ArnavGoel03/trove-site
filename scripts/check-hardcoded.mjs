#!/usr/bin/env node
// Fail the build when a value that has a canonical home is written out by hand
// somewhere else.
//
// This exists because the rule alone did not hold. The marketing domain was
// already centralised in suite.config.json -> STUDIO.domain, and 27 files
// hardcoded the string anyway. When the domain turned out to belong to an
// unrelated company, fixing it meant rewriting ~120 literals across the site
// and the Swift app instead of editing one line. Every "Website" and "Privacy
// Policy" link in the shipped app pointed at a stranger's site until then.
//
// Add a rule here whenever a new value earns a canonical home. A literal that
// appears in two files is a bug, and this is what says so out loud.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

/**
 * `pattern` is searched for in every scanned file. `allow` lists the files
 * that are permitted to contain it, which is the canonical definition plus
 * anything genuinely unavoidable.
 */
const RULES = [
  {
    name: "marketing domain",
    pattern: /https?:\/\/trove\.arnavgoel\.dev/,
    allow: ["lib/brand.ts"],
    use: "STUDIO.domain (or STUDIO_HOST for display text)",
  },
  {
    name: "release repo",
    pattern: /ArnavGoel03\/trove-releases/,
    allow: ["lib/releases.ts"],
    use: "RELEASE_REPO from lib/releases.ts",
  },
  {
    // The one that shipped: the source repo is private, so a link naming it
    // 404s for every visitor. Six files did it. /contact sent bug reports to a
    // 404, both changelog links 404d, /press called the source "public" and
    // pointed at Discussions (not enabled on either repo), and the structured
    // data handed Google a downloadUrl nobody could open. The rule against it
    // was written at the top of lib/releases.ts and enforced by nothing.
    name: "private source repo",
    pattern: /ArnavGoel03\/trove(?!-releases|-win|-site)\b/,
    allow: ["lib/releases.ts", "scripts/check-hardcoded.mjs"],
    use: "ISSUES_URL / releasePageURL() from lib/releases.ts, or STUDIO.domain for a site link",
    // Markdown too. A post cannot import a constant, which is exactly why the
    // last two survivors were there: a released update told readers "PRs
    // welcome on the public repo" and linked twice to a 404, and an archived
    // changelog line pointed at a release tag on the private repo. The other
    // rules stay code-only, since prose legitimately names the public repo.
    alsoMarkdown: true,
  },
  {
    name: "release asset name",
    pattern: /Trove-win-x64\.zip|"Trove\.zip"/,
    allow: ["lib/releases.ts"],
    use: "ASSET_NAMES from lib/releases.ts",
  },
];

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "public",
  "content",
  "bin",
]);
const EXTS = [".ts", ".tsx", ".mjs", ".js", ".jsx"];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTS.some((e) => entry.endsWith(e))) out.push(full);
  }
  return out;
}

/** Markdown under content/, which `walk` deliberately skips. */
function walkMarkdown(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkMarkdown(full, out);
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

const failures = [];
function scan(file, rules) {
  const rel = relative(ROOT, file);
  if (rel.startsWith("scripts/check-hardcoded")) return;
  const lines = readFileSync(file, "utf8").split("\n");
  for (const rule of rules) {
    if (rule.allow.includes(rel)) continue;
    lines.forEach((line, i) => {
      if (rule.pattern.test(line)) {
        failures.push({ rel, line: i + 1, rule, text: line.trim() });
      }
    });
  }
}

for (const file of walk(ROOT)) scan(file, RULES);

const MARKDOWN_RULES = RULES.filter((r) => r.alsoMarkdown);
if (MARKDOWN_RULES.length) {
  for (const file of walkMarkdown(join(ROOT, "content"))) {
    scan(file, MARKDOWN_RULES);
  }
}

if (failures.length === 0) {
  console.log("check-hardcoded: clean");
  process.exit(0);
}

console.error(
  `check-hardcoded: ${failures.length} hardcoded value(s) that already have a single source of truth.\n`
);
for (const f of failures) {
  console.error(`  ${f.rel}:${f.line}  [${f.rule.name}]`);
  console.error(`    ${f.text.slice(0, 100)}`);
  console.error(`    use ${f.rule.use}\n`);
}
process.exit(1);
