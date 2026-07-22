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

const failures = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  if (rel.startsWith("scripts/check-hardcoded")) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  for (const rule of RULES) {
    if (rule.allow.includes(rel)) continue;
    lines.forEach((line, i) => {
      if (rule.pattern.test(line)) {
        failures.push({ rel, line: i + 1, rule, text: line.trim() });
      }
    });
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
