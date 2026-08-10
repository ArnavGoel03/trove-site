// The camera: nine poses, one continuous path between them, and a lag.
//
// `poseAt` is pure, like everything in drive.ts. `damp` is the single exception
// in the whole scene, and it is deliberately a lag rather than a spring.
//
// The difference matters more than it sounds. A spring carries velocity, so
// where it ends up depends on how fast you got there; scrub the same scroll
// position from above and from below and you get two different camera poses,
// and the page quietly stops being reproducible. Exponential damping carries no
// state beyond the current value: it always converges on the pure target, from
// either direction, and it converges at the same rate regardless of frame time.
// Stop scrolling and it settles exactly where `poseAt` says it should be.
//
// Imported by test/scene.test.ts under node, so imports carry `.ts`.

import { BOUNDS, mix, type StageAt, type StageId } from "../lib/timeline.ts";
import { HERO_PEAK_SCALE, HERO_W } from "./drive.ts";

export interface CameraPose {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  /** Where the camera aims. Offsetting this is how the subject moves in frame. */
  readonly tx: number;
  readonly ty: number;
  readonly fov: number;
}

/**
 * One pose per stage, in the order lib/timeline declares them.
 *
 * Read this as a shot list. Wide and low for the desk, pulled back and loose
 * for the sprawl, a hard push in for the collapse, four close working shots for
 * the proof, back out for the receipt, and a calm square-on hold for the close.
 */
const SHOTS: Record<StageId, CameraPose> = {
  desk: { x: 1.05, y: 0.55, z: 6.9, tx: 0, ty: 0, fov: 38 },
  sprawl: { x: 0.1, y: 0.25, z: 9.4, tx: 0, ty: 0, fov: 56 },
  collapse: { x: 0, y: 0, z: 6.2, tx: 0, ty: 0, fov: 45 },
  clipboard: { x: -0.55, y: 0.2, z: 4.7, tx: -0.18, ty: 0.05, fov: 39 },
  text: { x: 0.55, y: -0.15, z: 4.5, tx: 0.18, ty: -0.05, fov: 39 },
  capture: { x: 0.05, y: 0.4, z: 4.3, tx: 0, ty: 0.12, fov: 37 },
  system: { x: -0.4, y: -0.35, z: 4.6, tx: -0.12, ty: -0.1, fov: 39 },
  receipt: { x: 0, y: 0.05, z: 8.4, tx: 0, ty: 0, fov: 43 },
  trust: { x: 0, y: 0, z: 7.0, tx: 0, ty: 0, fov: 40 },
};

/**
 * The pose the canvas is created with, so the very first frame is already the
 * opening shot. Exported rather than retyped in Scene.tsx: a `<Canvas camera>`
 * prop that disagreed with the shot list would put one wrong frame on screen
 * at exactly the moment the poster hands over, which is the one frame a reader
 * is guaranteed to be looking at.
 */
export const OPENING: CameraPose = SHOTS.desk;

/** Stage order, taken from the timeline rather than retyped here. */
const ORDER: readonly StageId[] = BOUNDS.map((b) => b.id);

/**
 * How the frame is shared with the words.
 *
 * On a wide viewport the copy sits in the left third, so the camera aims left
 * of the subject and the subject renders right. On a narrow one the copy is
 * pinned to the bottom, so the camera aims below the subject and the subject
 * renders high. Both are just an offset on the aim point, which keeps the shot
 * list above readable as a shot list.
 *
 * The offset is a FRACTION OF WHAT THE CAMERA CAN SEE, not a fixed distance,
 * and that is the whole trick. A fixed 1.15 world units moves the subject a
 * ninth of the way across the frame in the widest shot and a fifth of the way
 * in the tightest one, so the composition slides around as the camera pushes
 * in and the copy is clear of the subject in some beats and buried in others.
 * Scaling by the visible extent at the subject plane holds the subject at the
 * same place on screen through all nine shots.
 */
const SUBJECT_RIGHT = 0.16;
const SUBJECT_UP = 0.17;
const NARROW_PULLBACK = 1.7;
const NARROW_FOV = 8;

/** What the camera can see at the subject plane, in world units. */
function visibleHeight(z: number, fov: number): number {
  return 2 * Math.abs(z) * Math.tan((fov * Math.PI) / 360);
}

/**
 * The widest the subject ever is, plus a margin so it reads as framed rather
 * than as a window someone cropped.
 */
const SUBJECT_FIT = HERO_W * HERO_PEAK_SCALE * 1.18;

/**
 * How far back the camera has to sit for `SUBJECT_FIT` to fit across the frame.
 *
 * The inverse of `visibleHeight` times aspect. A phone is roughly 0.46 wide for
 * every 1 tall, so the frame is less than half as wide as it is tall and a
 * pullback tuned on a laptop leaves the hero hanging off both edges.
 */
function fitDistance(fov: number, aspect: number): number {
  return SUBJECT_FIT / (2 * Math.max(0.2, aspect) * Math.tan((fov * Math.PI) / 360));
}

/** The frame the shot is composed for: how wide it is, and which way. */
export interface Viewport {
  /** True when the copy is stacked under the subject rather than beside it. */
  readonly narrow: boolean;
  /** Render aspect, width over height. */
  readonly aspect: number;
}

/**
 * The pose the camera is trying to reach, for a given scroll position.
 *
 * Interpolates between this stage's shot and the next one by the stage's eased
 * local progress, so the path is continuous across every boundary: at local 1
 * of stage n the value equals stage n+1's shot exactly, which is also what
 * stage n+1 returns at local 0.
 */
export function poseAt(frame: StageAt, view: Viewport): CameraPose {
  const here = SHOTS[frame.id];
  const nextId = ORDER[frame.index + 1];
  const next = nextId ? SHOTS[nextId] : here;
  const t = frame.eased;

  const base: CameraPose = {
    x: mix(here.x, next.x, t),
    y: mix(here.y, next.y, t),
    z: mix(here.z, next.z, t),
    tx: mix(here.tx, next.tx, t),
    ty: mix(here.ty, next.ty, t),
    fov: mix(here.fov, next.fov, t),
  };

  if (view.narrow) {
    const fov = base.fov + NARROW_FOV;
    // Whichever pullback is further: the fixed one, which keeps the shot list's
    // intent, or the one that makes the subject fit. Both are continuous in the
    // scroll, so their max is too and the path still has no cut in it.
    const z = Math.max(base.z + NARROW_PULLBACK, fitDistance(fov, view.aspect));
    return { ...base, z, fov, ty: base.ty - SUBJECT_UP * visibleHeight(z, fov) };
  }

  const width = visibleHeight(base.z, base.fov) * Math.max(0.5, view.aspect);
  return { ...base, tx: base.tx - SUBJECT_RIGHT * width };
}

/**
 * Frame-rate independent exponential damping.
 *
 * `1 - exp(-lambda * dt)` rather than a fixed per-frame fraction, because a
 * fixed fraction makes the camera move twice as fast on a 120Hz display as on a
 * 60Hz one. The half-life here is roughly `ln(2) / lambda` seconds and does not
 * depend on how often this is called.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  if (!Number.isFinite(dt) || dt <= 0) return current;
  return mix(current, target, 1 - Math.exp(-lambda * Math.min(dt, 0.1)));
}

/** How hard the camera chases. Fast enough to feel attached to the scroll. */
export const CAMERA_LAMBDA = 6.5;
