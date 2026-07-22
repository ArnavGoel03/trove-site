// Single source of truth for where Trove's binaries live and which tag is
// current. Nothing else in the site may hardcode a repo slug, an asset name or
// a version tag.
//
// Background, so this does not regress: until 2026-07-23 four files each
// hardcoded `ArnavGoel03/trove` plus a hand-typed fallback tag ("v1.5.2").
// That repo is PRIVATE, so the unauthenticated releases API returned 404 for
// every visitor, the code fell back to the hardcoded tag, and the asset URL it
// built 404'd as well. The download button was dead sitewide for months while
// still rendering a plausible-looking version number.
//
// Two rules come out of that:
//   1. The repo below must stay PUBLIC. It holds binaries only; source lives
//      in the private `ArnavGoel03/trove`.
//   2. A fallback is a *floor*, never a sentinel. `resolveTags` uses `null` to
//      mean "not found yet" and applies the floor once at the end. The old
//      code used the fallback string as both, so `mac === FALLBACK` was true
//      for a real release that happened to match and the loop stopped early.

import { VERSIONS } from "./versions.generated";

/** PUBLIC release-binary repo. Never point this at the private source repo. */
export const RELEASE_REPO = "ArnavGoel03/trove-releases";

export const ASSET_NAMES = {
  mac: "Trove.zip",
  windows: "Trove-win-x64.zip",
} as const;

export type Platform = keyof typeof ASSET_NAMES;
export type Channel = "stable" | "beta";

/**
 * Tag baked in at build time, derived from `macos/VERSION` by
 * `scripts/sync-suite.mjs`. This is the floor: correct at deploy time, so the
 * first paint is never wrong, and no human types a tag by hand.
 */
export const BUILT_IN_MAC_TAG = `v${VERSIONS.trove.version}`;

/**
 * Windows has never had a stable release. `v0.3.0-win` is flagged as a
 * pre-release on GitHub and the port is a stub, so the download page presents
 * it as beta. Windows resolution therefore ignores the channel split below.
 */
export const BUILT_IN_WIN_TAG = "v0.3.0-win";

export function downloadURL(platform: Platform, tag: string): string {
  return `https://github.com/${RELEASE_REPO}/releases/download/${tag}/${ASSET_NAMES[platform]}`;
}

export function releasePageURL(tag?: string): string {
  return tag
    ? `https://github.com/${RELEASE_REPO}/releases/tag/${tag}`
    : `https://github.com/${RELEASE_REPO}/releases`;
}

export type GitHubRelease = {
  tag_name: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string;
  html_url: string;
  assets: { name: string; size: number; browser_download_url: string }[];
};

export type ResolvedTags = {
  /** Newest stable macOS tag. Always present, falls back to the built-in. */
  mac: string;
  /** Newest macOS pre-release, or null when none is newer than stable. */
  macBeta: string | null;
  /** Newest Windows tag, any channel. */
  win: string;
};

function isWindows(tag: string): boolean {
  return tag.includes("-win");
}

/**
 * Classify by GitHub's own `prerelease` flag, matching what the macOS app's
 * updater does (`updater.includePrereleases`), so a tag can never be stable on
 * the website and beta in the app or vice versa.
 *
 * The API returns releases newest-first, so the first match in each bucket
 * wins and there is no version comparison to get wrong.
 */
export function resolveTags(list: GitHubRelease[]): ResolvedTags {
  let mac: string | null = null;
  let macBeta: string | null = null;
  let win: string | null = null;

  for (const r of list) {
    if (r.draft) continue;
    if (isWindows(r.tag_name)) {
      win ??= r.tag_name;
    } else if (r.prerelease) {
      macBeta ??= r.tag_name;
    } else {
      mac ??= r.tag_name;
    }
  }

  return {
    mac: mac ?? BUILT_IN_MAC_TAG,
    macBeta,
    win: win ?? BUILT_IN_WIN_TAG,
  };
}

/** Floor used before any network call resolves, and if every call fails. */
export const FALLBACK_TAGS: ResolvedTags = {
  mac: BUILT_IN_MAC_TAG,
  macBeta: null,
  win: BUILT_IN_WIN_TAG,
};

/**
 * Fetched server-side only (see `app/api/releases/route.ts`) so visitors never
 * spend an unauthenticated GitHub rate-limit slot each, and so one cached
 * response serves everyone.
 */
export async function fetchReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(
    `https://api.github.com/repos/${RELEASE_REPO}/releases?per_page=30`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 900 },
    },
  );
  if (!res.ok) {
    throw new Error(`GitHub releases: HTTP ${res.status}`);
  }
  return (await res.json()) as GitHubRelease[];
}
