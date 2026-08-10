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
  {
    // The site named no price for its whole life, so there was nothing to drift.
    // Now that there is a real number, a second copy of it is a page quoting a
    // price we no longer charge, which is the one mistake a buyer notices.
    //
    // Two or more digits, or a digit with cents. A bare `$1` is a regex
    // backreference in a .replace() call, not money, and matching it would make
    // this rule cry wolf until someone deleted it.
    name: "currency literal",
    pattern: /\$(\d{2,}|\d+\.\d)/,
    allow: [
      "lib/pricing.ts",
      // Vendor prices, each carrying its source URL and the date it was read.
      // These are quoted evidence, not our price, and `asShown` exists
      // precisely to record the number the way its own vendor writes it.
      "lib/rivals.ts",
      // Asserts the exact rendered strings. That is the test.
      "test/pricing.test.ts",
    ],
    use: "formatUSD() over PRICING from lib/pricing.ts, or a cited entry in lib/rivals.ts",
  },
  {
    // Twelve links across /contact, /privacy, /terms, /refund and
    // /acceptable-use invited support requests, privacy requests and security
    // disclosures to a mailbox on `trove.app`, a domain nobody here owns. Same
    // failure as the marketing-domain rule above: mail to a stranger, silently.
    name: "mailbox on a domain we do not own",
    pattern: /@trove\.app\b|gettrove\.vercel\.app/,
    // lib/brand.ts is the canonical home and its doc comment names the dead
    // domain on purpose, so the next reader knows what CONTACT replaced.
    allow: ["lib/brand.ts", "scripts/check-hardcoded.mjs"],
    use: "CONTACT.support / CONTACT.security / CONTACT.address from lib/brand.ts",
    alsoMarkdown: true,
  },
  {
    // Not a single-source rule, a house rule: no em or en dashes anywhere. The
    // codepoints are written as escapes rather than literals so this file does
    // not trip its own check, and so a careless editor cannot "fix" the rule by
    // reformatting it. 91 of these were purged on 2026-08-10; this is what
    // stops the 92nd. A dash that is genuinely data (matching input that
    // contains one) belongs in `allow` with a comment saying why.
    name: "em or en dash",
    pattern: /[\u2013\u2014]/,
    allow: ["scripts/check-hardcoded.mjs"],
    use: "a comma, colon, period, parentheses, or an ASCII hyphen",
    alsoMarkdown: true,
  },
  {
    // Nineteen files said "40+ tools" while lib/panes.ts held 53 of them, so
    // every page undersold the product by a quarter and /features managed to
    // print "53 panes" and "40+ tools" on the same screen. The count is now
    // derived from the list; this stops a hand-typed one coming back. The
    // pattern deliberately requires the word tool or pane after the number:
    // "40+ ops" is the Text Tools pipeline, a different number entirely.
    name: "hardcoded tool count",
    pattern:
      /\b\d+\+[- ](?:tool|pane)s?\b|\b\d+-(?:tool|pane)\b|\b\d+ (?:Shortcuts intents|AppIntents)\b/i,
    allow: ["scripts/check-hardcoded.mjs"],
    use: "TOOL_COUNT from lib/panes.ts, or INTENTS.length from lib/intents.ts",
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
