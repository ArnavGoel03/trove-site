import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { chromium, expect } from "@playwright/test";
import { BOUNDS } from "../lib/timeline.ts";
import { FALLBACK_TAGS } from "../lib/releases.ts";

assert.equal(process.env.CI, "true", "Use the hosted browser workflow");
assert.equal(process.platform, "linux", "Local browser launches are unavailable");
const output = ".vercel/browser-20260918";
await mkdir(output, { recursive: true });
const require = createRequire(import.meta.url);
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "0"], { stdio: ["ignore", "pipe", "pipe"] });
server.stderr.on("data", chunk => process.stderr.write(chunk));
let browser;
const results = [];
const errors = [];
const fixture = { ...FALLBACK_TAGS, mac: "v99.0.0-browser-fixture" };
const frames = (page, count = 3) => page.evaluate(count => new Promise(resolve => {
  const tick = () => --count <= 0 ? resolve() : requestAnimationFrame(tick);
  requestAnimationFrame(tick);
}), count);
try {
  const origin = await new Promise((resolve, reject) => {
    let text = "";
    const timer = setTimeout(() => reject(new Error("Server readiness deadline")), 20_000);
    server.once("exit", code => { clearTimeout(timer); reject(new Error(`Server exited ${code}`)); });
    server.stdout.on("data", chunk => {
      text += chunk;
      const match = text.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match && text.includes("Ready in")) { clearTimeout(timer); resolve(match[0]); }
    });
  });
  browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  async function session(viewport, { failure, reducedMotion = "no-preference", noWebGL = false } = {}) {
    const context = await browser.newContext({ viewport, reducedMotion, serviceWorkers: "block" });
    let requests = 0;
    let respond;
    const held = new Promise(resolve => { respond = resolve; });
    await context.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.fulfill({ status: 200, body: "{}", contentType: "application/json" });
      if (url.pathname !== "/api/releases") return route.continue();
      requests++;
      await held;
      if (requests === 1 && failure) {
        if (failure === "http") return route.fulfill({ status: 503, body: "" });
        if (failure === "json") return route.fulfill({ status: 200, body: "{", contentType: "application/json" });
        if (failure === "shape") return route.fulfill({ status: 200, json: { mac: 42 } });
        return route.abort("failed");
      }
      return route.fulfill({ json: fixture });
    });
    await context.addInitScript(({ noWebGL }) => {
      const original = Element.prototype.getBoundingClientRect;
      window.__trackReads = 0;
      Element.prototype.getBoundingClientRect = function (...args) {
        if (this.classList.contains("stage-track")) window.__trackReads++;
        return Reflect.apply(original, this, args);
      };
      if (noWebGL) {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type.startsWith("webgl") ? null : Reflect.apply(getContext, this, [type, ...args]);
        };
      }
    }, { noWebGL });
    const page = await context.newPage();
    page.on("pageerror", error => { errors.push(error.message); console.error(error.message); });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await expect.poll(() => requests).toBe(1);
    // Both independent consumers mount while the same response is still held.
    await expect(page.getByRole("link", { name: "Latest release notes on GitHub" })).toHaveCount(1);
    await expect(page.getByRole("button", { name: /Copy Mac download link/ })).toHaveCount(1);
    await frames(page);
    assert.equal(requests, 1, "Concurrent release consumers must share one request");
    respond();
    return { context, page, requests: () => requests };
  }
  async function features(page) {
    await page.locator('a[href="/features"]').last().click();
    await expect(page).toHaveURL(`${origin}/features`);
  }
  async function home(page) {
    await page.locator('header a[href="/"]').click();
    await expect(page).toHaveURL(`${origin}/`);
  }
  async function stage(page, bound) {
    await page.locator(".stage-track").evaluate((track, progress) => {
      const rect = track.getBoundingClientRect();
      scrollTo({ top: rect.top + scrollY + (rect.height - innerHeight) * progress, behavior: "instant" });
    }, (bound.start + bound.end) / 2);
    const beat = page.locator(`[data-stage="${bound.id}"]`);
    await expect(beat).toHaveCSS("visibility", "visible");
    await expect(beat).toHaveCSS("opacity", "1");
    await frames(page);
    const heading = beat.locator("h1,h2");
    const rect = await heading.boundingBox();
    const size = page.viewportSize();
    await page.screenshot({ path: `${output}/stage-${size.width}-${bound.id}.png` });
    assert.ok(rect && rect.x >= 0 && rect.x + rect.width <= size.width + 1 && rect.y >= 0 && rect.y + rect.height <= size.height + 1, `${bound.id} heading outside viewport`);
    return beat;
  }
  for (const viewport of [{ width: 1600, height: 900 }, { width: 393, height: 852 }]) {
    const { context, page, requests } = await session(viewport);
    try {
      await expect(page.locator(".stage-track")).toHaveAttribute("data-live", "1");
      await expect(page.locator(".stage-poster")).toHaveAttribute("data-handed-over", "1", { timeout: 15_000 });
      await expect(page.getByRole("link", { name: "Latest release notes on GitHub" })).toContainText(fixture.mac);
      await expect(page.getByRole("button", { name: /Copy Mac download link/ })).toContainText(fixture.mac);
      await frames(page, 30);
      // Positive control: this detector must see deliberately repeated reads.
      const positive = await page.evaluate(async () => {
        window.__trackReads = 0;
        for (let i = 0; i < 10; i++) {
          await new Promise(requestAnimationFrame);
          document.querySelector(".stage-track").getBoundingClientRect();
        }
        return window.__trackReads;
      });
      assert.ok(positive >= 10, "Geometry detector missed its positive control");
      await page.evaluate(() => { window.__trackReads = 0; });
      await frames(page, 30);
      const idle = await page.evaluate(() => window.__trackReads);
      assert.equal(idle, 0, "Idle track keeps reading layout");
      await page.evaluate(() => {
        window.__trackReads = 0;
        for (let n = 0; n < 100; n++) dispatchEvent(new Event("scroll"));
      });
      await frames(page);
      const burst = await page.evaluate(() => window.__trackReads);
      assert.equal(burst, 1, "Scroll burst did not coalesce into one layout read");
      for (const bound of BOUNDS) {
        await stage(page, bound);
      }
      await stage(page, BOUNDS[2]);
      await page.setViewportSize({ ...viewport, height: viewport.height - 80 });
      await stage(page, BOUNDS[4]);
      await page.setViewportSize(viewport);
      await stage(page, BOUNDS[1]);
      await page.evaluate(() => dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
      await frames(page);
      await expect(page.locator(`[data-stage="${BOUNDS[1].id}"]`)).toHaveCSS("opacity", "1");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Horizontal page overflow");
      await features(page);
      await expect(page.getByRole("button", { name: /Copy Mac download link/ })).toContainText(fixture.mac);
      assert.equal(requests(), 1, "Later route consumer repeated successful release request");
      await page.evaluate(() => { window.__trackReads = 0; dispatchEvent(new Event("scroll")); dispatchEvent(new Event("resize")); });
      await frames(page, 10);
      assert.equal(await page.evaluate(() => window.__trackReads), 0, "Unmounted track kept measuring");
      await home(page);
      await stage(page, BOUNDS[3]);
      assert.equal(requests(), 1, "Remounted consumers repeated successful release request");
      results.push({ viewport, idleFrames: 30, idleReads: idle, positiveReads: positive, burstEvents: 100, burstReads: burst, releaseRequests: requests() });
      console.log(`Browser ${viewport.width}: all stages, reverse scroll, resize, pageshow, cleanup and release sharing pass`);
    } finally { await context.close(); }
  }
  for (const failure of ["http", "json", "shape", "network"]) {
    const { context, page, requests } = await session({ width: 393, height: 852 }, { failure, reducedMotion: "reduce" });
    try {
      await frames(page, 5);
      await expect(page.getByRole("button", { name: /Copy Mac download link/ })).toContainText(FALLBACK_TAGS.mac);
      await expect(page.getByRole("link", { name: "Latest release notes on GitHub" })).toContainText("Releases");
      await features(page);
      await expect(page.getByRole("button", { name: /Copy Mac download link/ })).toContainText(fixture.mac);
      await expect(page.getByRole("link", { name: "Latest release notes on GitHub" })).toContainText(fixture.mac);
      assert.equal(requests(), 2, "Failure must permit one shared retry on later mount");
      results.push({ failure, releaseRequests: requests() });
      console.log(`Release ${failure}: fallback and later retry pass`);
    } finally { await context.close(); }
  }
  for (const fallback of ["reduced-motion", "no-webgl"]) {
    const { context, page } = await session({ width: 393, height: 852 }, { reducedMotion: fallback === "reduced-motion" ? "reduce" : "no-preference", noWebGL: fallback === "no-webgl" });
    try {
      await expect(page.locator(".stage-track")).toHaveAttribute("data-live", "0");
      await expect(page.locator(".stage-scene canvas")).toHaveCount(0);
      for (const bound of BOUNDS) {
        const beat = page.locator(`[data-stage="${bound.id}"]`);
        await beat.scrollIntoViewIfNeeded();
        await expect(beat).toBeVisible();
        await expect(beat).toHaveCSS("opacity", "1");
      }
      await page.screenshot({ path: `${output}/${fallback}-393.png` });
      results.push({ fallback, visibleStages: BOUNDS.length });
      console.log(`${fallback}: all stacked stages remain readable`);
    } finally { await context.close(); }
  }
  assert.deepEqual(errors, [], "Unhandled browser errors");
} finally {
  await writeFile(`${output}/results.json`, JSON.stringify({ results, errors }, null, 2));
  await browser?.close();
  if (server.exitCode === null) {
    const exited = new Promise(resolve => server.once("exit", resolve));
    server.kill("SIGTERM");
    const timer = setTimeout(() => server.kill("SIGKILL"), 3000);
    await exited;
    clearTimeout(timer);
  }
}
