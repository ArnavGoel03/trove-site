import { releaseIn, type AppKey, type GitHubRelease } from "../lib/releases.ts";
import { APP_CONTRACT } from "../lib/suite.generated.ts";

export type SuiteVersions = Record<AppKey, { version: string; releaseDate: string }>;

/** Public downloadable releases are the authority for displayed versions. */
export function publishedVersions(list: GitHubRelease[]): SuiteVersions {
  return Object.fromEntries(
    (Object.keys(APP_CONTRACT) as AppKey[]).map((app) => {
      // Relay and Tend deliberately carry GitHub's prerelease flag so they
      // cannot displace Trove in its shipped /releases/latest updater.
      const eligible = app === "trove" ? list.filter((release) => !release.prerelease) : list;
      const release = releaseIn(eligible, app);
      if (release.state !== "ready") {
        throw new Error(`sync-suite: no published downloadable release for ${app}`);
      }
      if (!/^\d{4}-\d{2}-\d{2}T/.test(release.publishedAt) || !Number.isFinite(Date.parse(release.publishedAt))) {
        throw new Error(`sync-suite: invalid publication date for ${app}`);
      }
      return [app, { version: release.version, releaseDate: release.publishedAt.slice(0, 10) }];
    }),
  ) as SuiteVersions;
}

/** A newer unreleased heading must not supply an older VERSION's date. */
export function changelogDate(text: string, version: string): string | null {
  for (const match of text.matchAll(/^## \[([^\]]+)\]\s*-\s*(\d{4}-\d{2}-\d{2})/gm)) {
    if (match[1] === version) return match[2];
  }
  return null;
}
