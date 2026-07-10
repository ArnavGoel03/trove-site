#!/usr/bin/env node
// Repo-wide brand rename, the "prose + domain" half of centralized naming.
// lib/brand.ts is the source of truth for CHROME (nav/footer/meta/structured
// data render from it live). This script sweeps the long tail (FAQ, legal,
// guides, comparison prose, llms.txt) so a rename leaves NO old-name reference.
//
// Usage:
//   node scripts/rename-brand.mjs Trove NewName            (dry run)
//   node scripts/rename-brand.mjs Trove NewName --write     (apply)
// Case-sensitive on the exact display name, so lowercase infra tokens
// (URL slugs, object keys) are left alone. Rename the domain separately.
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const args = process.argv.slice(2);
const write = args.includes("--write");
const [oldName, newName] = args.filter((a) => !a.startsWith("--"));
if (!oldName || !newName) {
  console.error("usage: node scripts/rename-brand.mjs <OldName> <NewName> [--write]");
  process.exit(1);
}
const EXCLUDE = new Set(["node_modules", ".next", ".git", ".vercel", "scripts"]);
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".mdx", ".txt", ".css"]);
const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (EXCLUDE.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.has(extname(p)) || e.endsWith(".txt")) files.push(p);
  }
}
walk(".");
let total = 0, touched = 0;
for (const f of files) {
  const s = readFileSync(f, "utf8");
  const parts = s.split(oldName);
  const n = parts.length - 1;
  if (!n) continue;
  total += n; touched++;
  console.log(`${String(n).padStart(4)}  ${f}`);
  if (write) writeFileSync(f, parts.join(newName));
}
console.log(`\n${write ? "Replaced" : "Would replace"} ${total} "${oldName}" -> "${newName}" across ${touched} files.`);
if (!write) console.log('Dry run. Add "--write" to apply. (Rename the domain separately.)');
