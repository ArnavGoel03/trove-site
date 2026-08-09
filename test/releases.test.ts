import assert from "node:assert/strict";
import { test } from "node:test";

import {
  APP_MAC_ASSET,
  APP_TAG_PREFIX,
  releaseIn,
  resolveTags,
  type GitHubRelease,
} from "../lib/releases.ts";

function release(over: Partial<GitHubRelease> & { tag_name: string }): GitHubRelease {
  return {
    name: over.tag_name,
    draft: false,
    prerelease: false,
    published_at: "2026-08-01T00:00:00Z",
    html_url: `https://github.com/x/y/releases/tag/${over.tag_name}`,
    assets: [],
    ...over,
  };
}

function asset(name: string) {
  return {
    name,
    size: 1234,
    browser_download_url: `https://github.com/x/y/releases/download/t/${name}`,
  };
}

test("an app with no published asset is pending, never a guessed link", () => {
  const list = [release({ tag_name: "v1.12.8", assets: [asset(APP_MAC_ASSET.trove)] })];
  assert.equal(releaseIn(list, "relay").state, "pending");
  assert.equal(releaseIn(list, "tend").state, "pending");
  assert.equal(releaseIn(list, "trove").state, "ready");
});

test("a release with no matching asset is pending, not a dead download", () => {
  // A tag can exist with notes and nothing to download. Offering it would be
  // the exact failure this module was written to stop.
  const list = [release({ tag_name: "v1.12.9", assets: [] })];
  assert.equal(releaseIn(list, "trove").state, "pending");
});

test("version strips the app prefix and the leading v", () => {
  const list = [
    release({
      tag_name: `${APP_TAG_PREFIX.tend}v0.11.0`,
      assets: [asset(APP_MAC_ASSET.tend)],
    }),
  ];
  const found = releaseIn(list, "tend");
  assert.equal(found.state, "ready");
  assert.equal(found.state === "ready" && found.version, "0.11.0");
});

test("a Relay release is never handed to Trove", () => {
  // The repo-wide "latest" problem. Relay ships first and stable, Trove's
  // newest is older. Without the prefix guard the Trove updater is offered
  // Relay, which is a different app.
  const list = [
    release({ tag_name: `${APP_TAG_PREFIX.relay}v0.1.0`, assets: [asset(APP_MAC_ASSET.relay)] }),
    release({ tag_name: "v1.12.8", assets: [asset(APP_MAC_ASSET.trove)] }),
  ];

  const trove = releaseIn(list, "trove");
  assert.equal(trove.state === "ready" && trove.version, "1.12.8");
  assert.equal(resolveTags(list).mac, "v1.12.8");

  const relay = releaseIn(list, "relay");
  assert.equal(relay.state === "ready" && relay.version, "0.1.0");
});

test("Trove never picks up a Windows tag", () => {
  const list = [
    release({ tag_name: "v0.4.0-win", prerelease: true, assets: [asset(APP_MAC_ASSET.trove)] }),
    release({ tag_name: "v1.12.8", assets: [asset(APP_MAC_ASSET.trove)] }),
  ];
  const trove = releaseIn(list, "trove");
  assert.equal(trove.state === "ready" && trove.version, "1.12.8");
});

test("drafts are invisible", () => {
  const list = [
    release({ tag_name: "v2.0.0", draft: true, assets: [asset(APP_MAC_ASSET.trove)] }),
    release({ tag_name: "v1.12.8", assets: [asset(APP_MAC_ASSET.trove)] }),
  ];
  const trove = releaseIn(list, "trove");
  assert.equal(trove.state === "ready" && trove.version, "1.12.8");
});

test("newest wins, because GitHub returns the list newest first", () => {
  const list = [
    release({ tag_name: "v1.13.0", assets: [asset(APP_MAC_ASSET.trove)] }),
    release({ tag_name: "v1.12.8", assets: [asset(APP_MAC_ASSET.trove)] }),
  ];
  const trove = releaseIn(list, "trove");
  assert.equal(trove.state === "ready" && trove.version, "1.13.0");
});

test("every app has a distinct asset name and tag prefix", () => {
  const assets = Object.values(APP_MAC_ASSET);
  assert.equal(new Set(assets).size, assets.length);
  const prefixes = Object.values(APP_TAG_PREFIX);
  assert.equal(new Set(prefixes).size, prefixes.length);
});
