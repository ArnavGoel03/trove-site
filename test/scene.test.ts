import assert from "node:assert/strict";
import { test } from "node:test";

import { RIVALS } from "../lib/rivals.ts";
import { progressForStage, stageAt, STAGES, type StageId } from "../lib/timeline.ts";
import {
  HERO_PEAK_SCALE,
  HERO_W,
  heroPose,
  moodAt,
  rivalPose,
  spreadAt,
  sprawlPose,
  stageAmount,
} from "../scene/drive.ts";
import { CAMERA_LAMBDA, damp, poseAt } from "../scene/rig.ts";

const IDS = STAGES.map((s) => s.id);

/** A laptop and a phone, the two frames every shot has to compose for. */
const WIDE = { narrow: false, aspect: 16 / 9 } as const;
const NARROW = { narrow: true, aspect: 393 / 852 } as const;

/**
 * The property the whole page rests on. If any of these numbers depended on how
 * the reader arrived at a scroll position, scrubbing back up would land them
 * somewhere they have never been, and no amount of visual polish would fix it.
 */
test("the scene is a pure function of the scroll position", () => {
  for (let i = 0; i <= 200; i++) {
    const p = i / 200;
    const a = stageAt(p);
    const b = stageAt(p);
    assert.deepEqual(heroPose(a), heroPose(b));
    assert.deepEqual(moodAt(a), moodAt(b));
    assert.deepEqual(poseAt(a, WIDE), poseAt(b, WIDE));
    assert.deepEqual(rivalPose(3, RIVALS.length, spreadAt(a)), rivalPose(3, RIVALS.length, spreadAt(b)));
  }
});

test("stageAmount is 0 before its stage, 1 after, and rises through it", () => {
  const target: StageId = "collapse";
  assert.equal(stageAmount(stageAt(progressForStage("desk")), target), 0);
  assert.equal(stageAmount(stageAt(progressForStage("collapse")), target), 0);
  assert.equal(stageAmount(stageAt(progressForStage("clipboard")), target), 1);
  assert.equal(stageAmount(stageAt(1), target), 1);

  const mid = stageAmount(stageAt((progressForStage("collapse") + progressForStage("clipboard")) / 2), target);
  assert.ok(mid > 0 && mid < 1, `expected a partial amount mid-stage, got ${mid}`);
});

test("every rival is docked before the sprawl and docked again after the collapse", () => {
  const docked: number[] = [
    spreadAt(stageAt(progressForStage("desk"))),
    spreadAt(stageAt(progressForStage("clipboard"))),
  ];
  assert.deepEqual(docked, [0, 0]);

  for (let i = 0; i < RIVALS.length; i++) {
    for (const amount of docked) {
      const pose = rivalPose(i, RIVALS.length, amount);
      assert.equal(pose.opacity, 0, `rival ${i} is visible at spread ${amount}`);
      assert.ok(Math.abs(pose.x) < 0.001 && Math.abs(pose.y) < 0.001, `rival ${i} is not docked`);
    }
  }
});

test("at full sprawl every rival is out, opaque, and inside the frame", () => {
  for (let i = 0; i < RIVALS.length; i++) {
    const pose = rivalPose(i, RIVALS.length, 1);
    assert.equal(pose.opacity, 1, `rival ${i} never reaches full opacity`);
    assert.deepEqual(pose, { ...sprawlPose(i, RIVALS.length), opacity: 1 });
    // Nothing may drift so far out that it is only ever a corner of a window.
    assert.ok(Math.abs(pose.x) < 7, `rival ${i} is off frame at x=${pose.x}`);
    assert.ok(Math.abs(pose.y) < 4, `rival ${i} is off frame at y=${pose.y}`);
  }
});

test("no two rivals share a position", () => {
  const seen = new Set<string>();
  for (let i = 0; i < RIVALS.length; i++) {
    const p = sprawlPose(i, RIVALS.length);
    const key = `${p.x.toFixed(2)}:${p.y.toFixed(2)}:${p.z.toFixed(2)}`;
    assert.ok(!seen.has(key), `rivals overlap at ${key}`);
    seen.add(key);
  }
});

test("the hero is always at least half visible and never inverted", () => {
  for (let i = 0; i <= 200; i++) {
    const pose = heroPose(stageAt(i / 200));
    assert.ok(pose.opacity >= 0.5, `hero faded to ${pose.opacity}`);
    assert.ok(pose.scale > 0.5, `hero collapsed to scale ${pose.scale}`);
  }
});

/**
 * A camera path with a jump in it reads as a cut, and a cut in the middle of a
 * continuous scroll reads as a bug. This checks the seams between stages, which
 * is where a mistyped shot list would show up.
 */
test("the camera path has no jumps across stage boundaries", () => {
  // The bar is set well above the largest step an eased move can take between
  // two adjacent samples and well below the smallest cut a mistyped shot list
  // would produce, which is a whole unit or more.
  const SAMPLES = 8000;
  const LIMIT = 0.5;

  let previous = poseAt(stageAt(0), WIDE);
  for (let i = 1; i <= SAMPLES; i++) {
    const now = poseAt(stageAt(i / SAMPLES), WIDE);
    for (const key of ["x", "y", "z", "tx", "ty", "fov"] as const) {
      const step = Math.abs(now[key] - previous[key]);
      assert.ok(step < LIMIT, `camera ${key} jumped ${step.toFixed(3)} at progress ${i / SAMPLES}`);
    }
    previous = now;
  }
});

test("every stage has a shot, and narrow reframes without breaking one", () => {
  for (const id of IDS) {
    const frame = stageAt(progressForStage(id));
    const wide = poseAt(frame, WIDE);
    const narrow = poseAt(frame, NARROW);
    for (const pose of [wide, narrow]) {
      for (const key of ["x", "y", "z", "tx", "ty", "fov"] as const) {
        assert.ok(Number.isFinite(pose[key]), `${id} has a non-finite ${key}`);
      }
      assert.ok(pose.z > 0, `${id} puts the camera behind the subject`);
      assert.ok(pose.fov > 10 && pose.fov < 90, `${id} has an unusable fov of ${pose.fov}`);
    }
    assert.ok(narrow.z > wide.z, `${id} does not pull back on a narrow viewport`);
  }
});

/**
 * Damping is the one lag in the scene, so it has to converge from both
 * directions and it has to converge at the same rate whatever the frame time.
 * A spring would fail both of these.
 */
test("damping converges on the target from either side", () => {
  for (const start of [-5, 0, 3, 12]) {
    let value = start;
    for (let i = 0; i < 400; i++) value = damp(value, 2, CAMERA_LAMBDA, 1 / 60);
    assert.ok(Math.abs(value - 2) < 1e-6, `from ${start} it settled at ${value}`);
  }
});

test("damping is frame-rate independent", () => {
  let at60 = 0;
  for (let i = 0; i < 60; i++) at60 = damp(at60, 1, CAMERA_LAMBDA, 1 / 60);
  let at120 = 0;
  for (let i = 0; i < 120; i++) at120 = damp(at120, 1, CAMERA_LAMBDA, 1 / 120);
  assert.ok(Math.abs(at60 - at120) < 0.005, `60Hz reached ${at60}, 120Hz reached ${at120}`);
});

test("damp is total", () => {
  assert.equal(damp(1, 5, CAMERA_LAMBDA, 0), 1);
  assert.equal(damp(1, 5, CAMERA_LAMBDA, -1), 1);
  assert.equal(damp(1, 5, CAMERA_LAMBDA, Number.NaN), 1);
  // A tab restored after a minute in the background must not teleport past the
  // target: the step is capped, so a huge dt is just a fast approach.
  const jumped = damp(0, 1, CAMERA_LAMBDA, 60);
  assert.ok(jumped > 0 && jumped <= 1, `a 60s frame produced ${jumped}`);
});

test("mood stays inside a renderable range everywhere on the track", () => {
  for (let i = 0; i <= 200; i++) {
    const mood = moodAt(stageAt(i / 200));
    assert.ok(mood.key > 0.2 && mood.key <= 1, `key light out of range: ${mood.key}`);
    assert.ok(mood.rim >= 0 && mood.rim <= 1, `rim out of range: ${mood.rim}`);
    assert.ok(mood.fog > 0 && mood.fog < 0.3, `fog out of range: ${mood.fog}`);
    assert.ok(mood.grid >= 0 && mood.grid <= 1, `grid out of range: ${mood.grid}`);
  }
});

/**
 * A portrait frame is less than half as wide as it is tall, so every distance
 * in the shot list is too close: the hero hung off both edges of a phone at the
 * collapse, cropped down the middle of its own sidebar. The narrow branch now
 * solves for the distance that fits rather than adding a constant, and this is
 * what stops a future shot from quietly re-cropping it.
 */
test("the subject fits inside a portrait frame at every shot", () => {
  const widest = HERO_W * HERO_PEAK_SCALE;
  for (let i = 0; i <= 200; i++) {
    const pose = poseAt(stageAt(i / 200), NARROW);
    const frame = 2 * pose.z * Math.tan((pose.fov * Math.PI) / 360) * NARROW.aspect;
    assert.ok(
      frame > widest * 1.1,
      `at progress ${i / 200} the frame is ${frame.toFixed(2)} wide and the hero is ${widest.toFixed(2)}`,
    );
  }
});

/**
 * Where the subject lands on screen, which is the thing the reader actually
 * sees and the thing a shot list expressed in world units does not control.
 *
 * The camera pushes from z 9.4 to z 4.3 across the track and the fov swings
 * 37 to 56, so a fixed aim offset moves the subject a different distance in
 * every shot: it cleared the copy in the wide ones and sat under it in the
 * tight ones. Holding the offset as a fraction of what the camera can see puts
 * the subject in the same third of the frame in all nine, which is what lets
 * the scrim in globals.css be a single fixed gradient.
 */
test("the subject holds its place in frame through every shot", () => {
  const halfExtent = (z: number, fov: number) => z * Math.tan((fov * Math.PI) / 360);

  const wide: number[] = [];
  const tall: number[] = [];
  for (let i = 0; i <= 400; i++) {
    const frame = stageAt(i / 400);

    const w = poseAt(frame, WIDE);
    // The subject is at the origin; the aim point is what moves.
    wide.push(0.5 - w.tx / (2 * halfExtent(w.z, w.fov) * WIDE.aspect));

    const n = poseAt(frame, NARROW);
    tall.push(0.5 - n.ty / (2 * halfExtent(n.z, n.fov)));
  }

  // A band rather than a point: four of the nine shots carry a small aim offset
  // of their own, which is deliberate, and this is what keeps those offsets
  // reading as composition instead of drift.
  for (const [label, fractions] of [
    ["wide", wide],
    ["narrow", tall],
  ] as const) {
    const lo = Math.min(...fractions);
    const hi = Math.max(...fractions);
    assert.ok(
      lo > 0.6 && hi < 0.74,
      `${label}: the subject ranges over ${lo.toFixed(3)} to ${hi.toFixed(3)} of the frame, ` +
        `which puts it under the copy at one end or off the edge at the other`,
    );
  }
});
