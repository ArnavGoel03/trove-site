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

import { VERSIONS } from "./versions.generated.ts";
import { APP_CONTRACT } from "./suite.generated.ts";

/** PUBLIC release-binary repo. Never point this at the private source repo. */
export const RELEASE_REPO = "ArnavGoel03/trove-releases";

/**
 * The public GitHub surface. Derived, because the source repo is private and
 * every link that named it directly returned 404 to everyone who was not signed
 * in as the author: the support link on /contact, both changelog links, the
 * "public square" on /press, the `downloadUrl` Google reads out of our
 * structured data, and the LLM context file. Issues are enabled on the public
 * release repo; Discussions are not enabled anywhere, so nothing may link to
 * them. Note that the comment at the top of this file already said no other
 * file may hardcode a repo slug, and six of them did it anyway, which is why
 * check-hardcoded.mjs now enforces it instead of asking.
 */
export const ISSUES_URL = `https://github.com/${RELEASE_REPO}/issues`;
export const ISSUES_LABEL = `github.com/${RELEASE_REPO}/issues`;

export const ASSET_NAMES = {
  mac: APP_CONTRACT.trove.macAsset,
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
 * Windows has never had a stable release. Every `-win` tag is flagged as a
 * pre-release on GitHub, so the download page presents it as beta, and Windows
 * resolution ignores the channel split below.
 *
 * The pre-release flag is load-bearing, not cosmetic: one repo holds both
 * platforms, and GitHub's /releases/latest returns the newest non-pre-release
 * repo-wide. A Windows tag published as stable would become "latest" for the
 * Mac app too. See win/bin/mirror-win-release.sh, which enforces this.
 */
export const BUILT_IN_WIN_TAG = "v0.4.0-win";

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

// ---------------------------------------------------------------------------
// Per-app resolution
//
// One repo now serves three apps, so a tag has to say which app it belongs to
// or the wrong binary gets handed to the wrong updater. The failure is exactly
// the one the `-win` comment above describes, and it already happened once:
// GitHub's "latest" is repo-wide, so a Relay release published as stable would
// have become the newest stable tag and `resolveTags` would have returned it as
// `mac`, i.e. the Trove updater would offer Relay as a Trove update.
//
// Trove keeps bare `vX.Y.Z` tags because they are already published and the
// shipped app's updater parses them. The two new apps carry a prefix.
// ---------------------------------------------------------------------------

export type AppKey = "trove" | "relay" | "tend";

/**
 * Tag prefix per app. Trove's is empty for backwards compatibility.
 *
 * Generated, not typed. The same three strings are read by every shipped
 * binary (SuiteConfig.App.tagPrefix) and by bin/mirror-release.sh, and a
 * convention with three readers and three hand-written definitions is a
 * convention waiting to drift. Source: macos/suite.config.json.
 */
export const APP_TAG_PREFIX: Record<AppKey, string> = {
  trove: APP_CONTRACT.trove.tagPrefix,
  relay: APP_CONTRACT.relay.tagPrefix,
  tend: APP_CONTRACT.tend.tagPrefix,
};

/**
 * macOS asset filename per app. These are a contract with the release scripts:
 * whatever publishes a Relay build must name the zip exactly this, or the site
 * shows "Get notified" next to a release that exists.
 */
export const APP_MAC_ASSET: Record<AppKey, string> = {
  trove: APP_CONTRACT.trove.macAsset,
  relay: APP_CONTRACT.relay.macAsset,
  tend: APP_CONTRACT.tend.macAsset,
};

/** Only the app's canonical version tags can identify one of its binaries. */
function belongsToApp(tag: string, app: AppKey): boolean {
  const prefix = APP_TAG_PREFIX[app];
  return tag.startsWith(prefix) && /^v\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(tag.slice(prefix.length));
}

export type ReleaseState =
  | {
      state: "ready";
      /** Direct asset URL. Safe to render as a download link. */
      url: string;
      /** Human version, prefix and leading v stripped. */
      version: string;
      bytes: number;
      /** Release page, for "what changed" links. */
      page: string;
      prerelease: boolean;
      publishedAt: string;
    }
  /**
   * No published asset. Every call site must render something other than a
   * download: "Get notified", pointing at contact. This is why the site can
   * sell three apps today and needs no edit on the day two of them ship.
   */
  | { state: "pending" };

/**
 * Pure: given the release list, what can a visitor actually download.
 *
 * Matches on the asset filename rather than the tag, because the asset is the
 * thing being linked. A tag with no matching asset is a release that exists but
 * has nothing to give, and offering it would be the dead download all over
 * again, just with a fresher-looking version number.
 */
function findRelease(
  list: GitHubRelease[],
  app: AppKey,
  platform: Platform,
  channel?: Channel,
): GitHubRelease | null {
  const wanted = platform === "windows" ? ASSET_NAMES.windows : APP_MAC_ASSET[app];
  return list.find((release) =>
    !release.draft &&
    belongsToApp(release.tag_name, app) &&
    isWindows(release.tag_name) === (platform === "windows") &&
    (channel === undefined || release.prerelease === (channel === "beta")) &&
    release.assets.some((asset) => asset.name === wanted)
  ) ?? null;
}

/** The download page and client buttons select the same platform/channel. */
export function downloadReleaseIn(list: GitHubRelease[], platform: Platform): GitHubRelease | null {
  return findRelease(list, "trove", platform, platform === "mac" ? "stable" : undefined);
}

export function releaseIn(list: GitHubRelease[], app: AppKey): ReleaseState {
  const release = findRelease(list, app, "mac");
  const asset = release?.assets.find((asset) => asset.name === APP_MAC_ASSET[app]);
  if (!release || !asset) return { state: "pending" };
  return {
    state: "ready",
    url: asset.browser_download_url,
    version: release.tag_name.slice(APP_TAG_PREFIX[app].length).replace(/^v/, ""),
    bytes: asset.size,
    page: release.html_url,
    prerelease: release.prerelease,
    publishedAt: release.published_at,
  };
}

/**
 * Never throws. A GitHub outage or a rate limit must degrade to "Get notified",
 * not to a 500 on the download page, and certainly not to a link built from a
 * guessed tag: that is precisely the bug documented at the top of this file.
 */
export async function releaseFor(app: AppKey): Promise<ReleaseState> {
  try {
    return releaseIn(await fetchReleases(), app);
  } catch {
    return { state: "pending" };
  }
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
  return {
    mac: downloadReleaseIn(list, "mac")?.tag_name ?? BUILT_IN_MAC_TAG,
    macBeta: findRelease(list, "trove", "mac", "beta")?.tag_name ?? null,
    win: downloadReleaseIn(list, "windows")?.tag_name ?? BUILT_IN_WIN_TAG,
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
