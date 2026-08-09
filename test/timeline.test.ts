import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BOUNDS,
  clamp01,
  progressForStage,
  progressForBeat,
  span,
  stageAt,
  STAGES,
  stageDistance,
  TRACK_VH,
  type StageId,
} from "../lib/timeline.ts";

const SAMPLES = 2000;
const at = (i: number) => i / (SAMPLES - 1);

test("scrubbing back up lands exactly where scrubbing down did", () => {
  // The whole reason nothing in the scene is allowed to integrate. A reverse
  // sweep must produce byte-identical output, not merely similar output: a
  // spring would pass a "looks about right" check and still drift a little
  // further every time the reader changes direction.
  const forward = [];
  for (let i = 0; i < SAMPLES; i++) forward.push(stageAt(at(i)));

  for (let i = SAMPLES - 1; i >= 0; i--) {
    const back = stageAt(at(i));
    assert.deepEqual(back, forward[i], `desync at progress ${at(i)}`);
  }
});

test("stageAt is total: junk in, a valid frame out", () => {
  // A NaN scroll position on one frame must not blank the page.
  for (const bad of [NaN, Infinity, -Infinity, -5, 5]) {
    const s = stageAt(bad);
    assert.ok(STAGES.some((spec) => spec.id === s.id));
    assert.ok(s.local >= 0 && s.local <= 1);
    assert.ok(s.eased >= 0 && s.eased <= 1);
  }
  assert.equal(stageAt(NaN).id, STAGES[0].id);
  assert.equal(stageAt(-5).id, STAGES[0].id);
  assert.equal(stageAt(5).id, STAGES[STAGES.length - 1].id);
});

test("stage indices only ever move forward as progress grows", () => {
  let last = -1;
  for (let i = 0; i < SAMPLES; i++) {
    const { index } = stageAt(at(i));
    assert.ok(index >= last, `index went backwards at ${at(i)}`);
    assert.ok(index - last <= 1, `skipped a stage at ${at(i)}`);
    last = index;
  }
  assert.equal(last, STAGES.length - 1, "the last stage is never reached");
});

test("every stage is visited, and every one gets a fully readable moment", () => {
  const seen = new Map<StageId, { min: number; max: number }>();
  for (let i = 0; i < SAMPLES; i++) {
    const s = stageAt(at(i));
    const e = seen.get(s.id) ?? { min: 1, max: 0 };
    seen.set(s.id, { min: Math.min(e.min, s.eased), max: Math.max(e.max, s.eased) });
  }

  assert.equal(seen.size, STAGES.length);
  for (const spec of STAGES) {
    const e = seen.get(spec.id);
    assert.ok(e, `${spec.id} never appears`);
    // The hold is what makes a beat legible without holding the scroll wheel
    // still at one pixel. If either end never lands, the copy is unreadable.
    assert.equal(e.min, 0, `${spec.id} never fully arrives`);
    assert.equal(e.max, 1, `${spec.id} never fully settles`);
  }
});

test("eased never goes backwards inside a stage", () => {
  let lastId = stageAt(0).id;
  let lastEased = 0;
  for (let i = 0; i < SAMPLES; i++) {
    const s = stageAt(at(i));
    if (s.id !== lastId) {
      lastId = s.id;
      lastEased = 0;
    }
    assert.ok(s.eased >= lastEased - 1e-12, `${s.id} eased went backwards`);
    lastEased = s.eased;
  }
});

test("boundaries tile the track with no gap and no overlap", () => {
  assert.equal(BOUNDS[0].start, 0);
  assert.equal(BOUNDS[BOUNDS.length - 1].end, 1);
  for (let i = 1; i < BOUNDS.length; i++) {
    assert.equal(BOUNDS[i].start, BOUNDS[i - 1].end);
    assert.ok(BOUNDS[i].end > BOUNDS[i].start);
  }
});

test("the track height is derived from the weights, not typed", () => {
  const total = STAGES.reduce((s, x) => s + x.weight, 0);
  assert.equal(TRACK_VH, Math.round(total * 100));
  // A track shorter than a few screens means the whole argument flies past.
  assert.ok(TRACK_VH > 600);
});

test("stage ids are unique", () => {
  const ids = STAGES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("holds are sane", () => {
  for (const s of STAGES) {
    const [a, b] = s.hold;
    assert.ok(a >= 0 && b >= 0, `${s.id} has a negative hold`);
    // Leave at least half the stage for the beat to actually animate in.
    assert.ok(a + b <= 0.5, `${s.id} holds for too much of its own length`);
    // progressForBeat targets the middle of the settled window. A zero outro
    // hold makes that window a single point, i.e. the stage boundary, and the
    // jump lands on the next beat instead.
    assert.ok(b > 0, `${s.id} has no settled window to land on`);
  }
});

test("jumping to a stage lands on a composed frame, not mid-transition", () => {
  for (const s of STAGES) {
    assert.equal(stageAt(progressForStage(s.id)).id, s.id);
    const beat = stageAt(progressForBeat(s.id));
    assert.equal(beat.id, s.id, `${s.id} beat lands in the wrong stage`);
    // Landing a nav link on a half-composed headline reads as a broken page,
    // not as an animation.
    assert.equal(beat.eased, 1, `${s.id} beat lands mid-transition`);
  }
});

test("stage distance is signed and zero at home", () => {
  const receipt = stageAt(progressForBeat("receipt"));
  assert.equal(stageDistance(receipt.index, "receipt"), 0);
  assert.ok(stageDistance(receipt.index, "desk") < 0);
  assert.ok(stageDistance(receipt.index, "trust") > 0);
});

test("span and clamp01 hold at the edges", () => {
  assert.equal(span(5, 0, 10), 0.5);
  assert.equal(span(-1, 0, 10), 0);
  assert.equal(span(11, 0, 10), 1);
  // A zero-width range is a division by zero waiting to render NaN geometry.
  assert.equal(span(3, 2, 2), 0);
  assert.equal(clamp01(-1), 0);
  assert.equal(clamp01(2), 1);
});
