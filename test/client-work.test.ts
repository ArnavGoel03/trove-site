import assert from "node:assert/strict";
import { test } from "node:test";
import { createLatestTagsLoader } from "../lib/releases-client.ts";
import { observeProgress } from "../components/stage/observe-progress.ts";
import { FALLBACK_TAGS } from "../lib/releases.ts";

test("concurrent and later consumers share one successful release request", async () => {
  let calls = 0;
  const load = createLatestTagsLoader(async () => {
    calls++;
    return Response.json(FALLBACK_TAGS);
  });
  const first = load();
  assert.equal(load(), first);
  const values = await Promise.all([first, load(), load()]);
  assert.deepEqual(values[0], FALLBACK_TAGS);
  assert.deepEqual(await load(), FALLBACK_TAGS);
  assert.equal(calls, 1);
});

test("HTTP, malformed and thrown failures permit a later release retry", async () => {
  for (const bad of [() => new Response(null, { status: 503 }),
    () => Response.json({ mac: 42 }),
    () => { throw new Error("offline"); }]) {
    let calls = 0;
    const load = createLatestTagsLoader(async () => ++calls === 1 ? bad() : Response.json(FALLBACK_TAGS));
    await assert.rejects(load());
    assert.deepEqual(await load(), FALLBACK_TAGS);
    assert.equal(calls, 2);
  }
});

test("scroll bursts coalesce, idle work stops, resize and restoration update, teardown cancels", () => {
  const target = new EventTarget();
  let next = 0, updates = 0, disconnected = false;
  const frames = new Map<number, FrameRequestCallback>();
  let resized: () => void = () => {};
  const previousObserver = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    constructor(callback: () => void) { resized = callback; }
    observe() {}
    disconnect() { disconnected = true; }
  } as unknown as typeof ResizeObserver;
  const host = Object.assign(target, {
    requestAnimationFrame(callback: FrameRequestCallback) { frames.set(++next, callback); return next; },
    cancelAnimationFrame(id: number) { frames.delete(id); },
  });
  const flush = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  };
  try {
    const stop = observeProgress(host as unknown as Window, {} as Element, () => updates++);
    for (let i = 0; i < 100; i++) target.dispatchEvent(new Event("scroll"));
    assert.equal(frames.size, 1);
    flush();
    assert.equal(updates, 1);
    for (let i = 0; i < 120; i++) flush();
    assert.equal(updates, 1, "idle must perform no more geometry reads");
    for (const kind of ["resize", "pageshow", "scroll"]) {
      target.dispatchEvent(new Event(kind));
      flush();
    }
    resized(); flush();
    assert.equal(updates, 5);
    resized(); stop(); flush();
    target.dispatchEvent(new Event("scroll"));
    resized(); flush();
    assert.equal(updates, 5);
    assert.equal(frames.size, 0);
    assert.ok(disconnected);
  } finally { globalThis.ResizeObserver = previousObserver; }
});
