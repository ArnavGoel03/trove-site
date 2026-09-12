import assert from "node:assert/strict";
import { test } from "node:test";
import { APP_MAC_ASSET, APP_TAG_PREFIX, releaseIn, type AppKey, type GitHubRelease } from "../lib/releases.ts";
import { changelogDate, publishedVersions } from "../scripts/suite-versions.ts";

function release(app: AppKey, version: string, override: Partial<GitHubRelease> = {}): GitHubRelease {
  return {
    tag_name: `${APP_TAG_PREFIX[app]}v${version}`,
    name: version,
    draft: false,
    prerelease: app !== "trove",
    published_at: "2026-09-12T23:38:11Z",
    html_url: `https://example.com/${app}/${version}`,
    assets: [{ name: APP_MAC_ASSET[app], size: 100, browser_download_url: `https://example.com/${app}/download` }],
    ...override,
  };
}

const current = [release("trove", "1.13.0"), release("relay", "0.3.0"), release("tend", "0.13.1")];

test("sync refreshes all three apps and accepts published Relay and Tend prereleases", () => {
  assert.deepEqual(publishedVersions(current), {
    trove: { version: "1.13.0", releaseDate: "2026-09-12" },
    relay: { version: "0.3.0", releaseDate: "2026-09-12" },
    tend: { version: "0.13.1", releaseDate: "2026-09-12" },
  });
});

test("Trove stays on stable while the other apps follow their downloadable releases", () => {
  const versions = publishedVersions([release("trove", "2.0.0-beta", { prerelease: true }), ...current]);
  assert.equal(versions.trove.version, "1.13.0");
});

test("drafts, Windows builds and releases without the app ZIP cannot advance displayed versions", () => {
  const skipped = (Object.keys(APP_MAC_ASSET) as AppKey[]).flatMap((app) => [
    release(app, "9.0.0", { draft: true }),
    release(app, "8.0.0-win"),
    release(app, "7.0.0", { assets: [] }),
    release(app, "6.0.0", { assets: [{ name: "Other.zip", size: 100, browser_download_url: "https://example.com/wrong" }] }),
  ]);
  assert.deepEqual(publishedVersions([...skipped, ...current]), publishedVersions(current));
});

test("an app cannot take a different app's release even if it includes the expected asset", () => {
  const mixed = release("relay", "9.0.0", { assets: current.flatMap((entry) => entry.assets), prerelease: false });
  const versions = publishedVersions([mixed, ...current]);
  assert.equal(versions.relay.version, "9.0.0");
  assert.equal(versions.trove.version, "1.13.0");
  assert.equal(versions.tend.version, "0.13.1");
});

test("unknown prefixes and malformed version tags cannot masquerade as app releases", () => {
  const malformed = ["other-v9.0.0", "release-v9.0.0", "v9", "vnot-a-version"].map((tag_name) => release("trove", "9.0.0", { tag_name }));
  assert.equal(releaseIn(malformed, "trove").state, "pending");
  assert.deepEqual(publishedVersions([...malformed, ...current]), publishedVersions(current));
  assert.equal(releaseIn([release("relay", "9.0.0", { tag_name: "relay-preview" })], "relay").state, "pending");
});

test("missing downloadable app or invalid publication date fails without a partial version set", () => {
  assert.throws(() => publishedVersions(current.filter((entry) => entry.tag_name !== current[2].tag_name)), /tend/);
  assert.throws(() => publishedVersions([release("relay", "9.0.0", { published_at: "unknown" }), ...current]), /publication date.*relay/);
});

test("sync and runtime share the same downloadable release and publication timestamp", () => {
  const runtime = releaseIn(current, "tend");
  assert.equal(runtime.state, "ready");
  if (runtime.state === "ready") {
    const displayed = publishedVersions(current).tend;
    assert.equal(displayed.version, runtime.version);
    assert.equal(displayed.releaseDate, runtime.publishedAt.slice(0, 10));
  }
});

test("sibling release date comes from the matching VERSION heading", () => {
  const changelog = "# Changes\n\n## [0.14.0] - 2026-09-15\n\n## [0.13.1] - 2026-09-13\n\n## [0.12.0]\n";
  assert.equal(changelogDate(changelog, "0.13.1"), "2026-09-13");
  assert.equal(changelogDate(changelog, "0.12.0"), null);
  assert.equal(changelogDate(changelog, "0.11.0"), null);
});
