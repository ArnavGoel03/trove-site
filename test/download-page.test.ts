import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import * as releases from "../lib/releases.ts";
import * as brand from "../lib/brand.ts";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(
  readFileSync(new URL("../app/download/page.tsx", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } },
).outputText;

type Element = { type: unknown; props: { children?: unknown; platform?: string; release?: releases.GitHubRelease | null; fallbackTag?: string } };
async function render(list: releases.GitHubRelease[] | Error) {
  const Card = () => null;
  let calls = 0;
  const context = {
    exports: {} as { default: () => Promise<Element> },
    fetch: async () => { calls++; if (list instanceof Error) throw list; return Response.json(list); },
    require(name: string) {
      if (name === "react/jsx-runtime") return require(name);
      if (name === "@/lib/brand") return brand;
      if (name === "@/lib/releases") return {
        ...releases,
        fetchReleases: async () => { calls++; if (list instanceof Error) throw list; return list; },
      };
      if (name === "./DownloadCard") return { __esModule: true, default: Card };
      if (name === "@/components/Nav" || name === "@/components/Footer") return { __esModule: true, default: () => null };
      throw new Error(`Unexpected page dependency: ${name}`);
    },
  };
  vm.runInNewContext(source, context);
  const cards: Element[] = [];
  function walk(value: unknown) {
    if (Array.isArray(value)) return value.forEach(walk);
    if (!value || typeof value !== "object" || !("props" in value)) return;
    const element = value as Element;
    if (element.type === Card) cards.push(element);
    walk(element.props.children);
  }
  walk(await context.exports.default());
  assert.equal(calls, 1, "Both cards must use one canonical release fetch");
  assert.equal(cards.length, 2);
  return cards;
}

function release(app: releases.AppKey, tag: string): releases.GitHubRelease {
  return {
    tag_name: `${releases.APP_TAG_PREFIX[app]}${tag}`, name: tag, draft: false, prerelease: false,
    published_at: "2026-09-18T00:00:00Z", html_url: "https://example.test/release",
    assets: [{ name: releases.APP_MAC_ASSET[app], size: 1024, browser_download_url: "https://example.test/asset" }],
  };
}

test("actual download page passes Trove data to its Mac card when newer suite releases lead", async () => {
  const trove = release("trove", "v1.20.0");
  const cards = await render([release("relay", "v9.0.0"), release("tend", "v9.0.0"), trove]);
  assert.equal(cards[0].props.platform, "mac");
  assert.equal(cards[0].props.release, trove);
  assert.equal(cards[1].props.release, null);
  assert.equal(cards[1].props.fallbackTag, releases.BUILT_IN_WIN_TAG);
});

test("actual download page preserves built-in floors for outages and other-app-only responses", async () => {
  for (const response of [new Error("offline"), [release("relay", "v9.0.0"), release("tend", "v9.0.0")]]) {
    const cards = await render(response);
    assert.equal(cards[0].props.release, null);
    assert.equal(cards[0].props.fallbackTag, releases.BUILT_IN_MAC_TAG);
    assert.equal(cards[1].props.release, null);
    assert.equal(cards[1].props.fallbackTag, releases.BUILT_IN_WIN_TAG);
  }
});
