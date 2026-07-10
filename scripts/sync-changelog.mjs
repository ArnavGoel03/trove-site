#!/usr/bin/env node
// Copy the canonical macos/CHANGELOG.md into this repo's content/ so the
// /changelog page can read it off disk at build time. The Trove source repo
// is private (binary-only distribution), so the site cannot fetch it from
// GitHub. Run this from the release script whenever CHANGELOG.md changes:
//
//   node scripts/sync-changelog.mjs
//
// It looks for ../macos/CHANGELOG.md relative to the site repo (the layout
// under ~/dev/trove where macos/ and site/ are siblings). Override the source
// with CHANGELOG_SRC=/abs/path/CHANGELOG.md if the checkout differs.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const src =
  process.env.CHANGELOG_SRC ?? resolve(siteRoot, "..", "macos", "CHANGELOG.md");
const dest = join(siteRoot, "content", "CHANGELOG.md");

if (!existsSync(src)) {
  console.error(`sync-changelog: source not found at ${src}`);
  console.error("Set CHANGELOG_SRC=/abs/path/CHANGELOG.md to override.");
  process.exit(1);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`sync-changelog: ${src} -> ${dest}`);
