// Where every object in the scene is, expressed as a function of the scroll.
//
// Nothing in this file touches three.js, the DOM, a ref or a clock. Give it a
// StageAt and it returns numbers; give it the same StageAt tomorrow and it
// returns the same numbers. That is the whole contract, and it is what makes
// the page scrubbable: a reader who flings the scrollbar back to the top must
// land in exactly the pose they started in, and a reader who reverses halfway
// through the collapse must watch it un-collapse rather than watch the windows
// drift somewhere new.
//
// The moment any of this becomes stateful (a spring, an accumulator, a "last
// frame" variable) that guarantee is gone and cannot be recovered by testing,
// because the failure only shows up after a particular sequence of scrolls.
//
// Imported by test/scene.test.ts under node, so imports carry `.ts`.

import { clamp01, easeOutCubic, mix, stageDistance, type StageAt, type StageId } from "../lib/timeline.ts";

/** A window in the scene. Plain numbers, ready to be written onto an Object3D. */
export interface Pose {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rx: number;
  readonly ry: number;
  readonly rz: number;
  readonly scale: number;
  readonly opacity: number;
}

/** Hero window size in world units, 16:10 like the app's own window. */
export const HERO_W = 3.4;
export const HERO_H = 2.125;

/** A rival window is half the hero, which is what makes the hero read as the hero. */
export const RIVAL_W = 1.7;
export const RIVAL_H = 1.0625;

/**
 * The largest the hero ever gets, reached at the collapse.
 *
 * Exported because the camera needs it: on a portrait viewport the frame is
 * narrower than the subject at every distance the wide shot list uses, so
 * scene/rig.ts solves for the distance that makes `HERO_W * this` fit. Left as
 * a literal in two files it would be a cropped window the first time either
 * moved.
 */
export const HERO_PEAK_SCALE = 1.12;

/**
 * How far through a given stage the scroll is, as a number the rest of the file
 * can multiply by.
 *
 * 0 before the stage, its eased local progress during, 1 after. Every transition
 * in the scene is written in terms of this, which is why none of them need to
 * know what order the stages come in or how much weight each one carries.
 */
export function stageAmount(frame: StageAt, id: StageId): number {
  const ahead = stageDistance(frame.index, id);
  if (ahead > 0) return 0;
  if (ahead < 0) return 1;
  return frame.eased;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Where rival window `i` sits when the desktop is at its worst.
 *
 * A golden-angle spiral rather than a grid or a random cloud: a grid looks like
 * a product screenshot and undersells the mess, and random would resettle every
 * time the component remounts. The spiral fills the frame evenly at any count,
 * which matters because the count comes from `RIVALS.length` and the ledger
 * gains and loses entries whenever a price is re-checked.
 *
 * The `sin(i * ...)` terms are deterministic depth jitter, not randomness. Same
 * index, same offset, forever.
 */
export function sprawlPose(i: number, n: number): Pose {
  const count = Math.max(1, n);
  const depth = count === 1 ? 0 : i / (count - 1);
  const angle = i * GOLDEN_ANGLE;
  const radius = 2.05 + 2.35 * Math.sqrt((i + 0.65) / count);

  const x = Math.cos(angle) * radius * 1.32;
  const y = Math.sin(angle) * radius * 0.6;
  const z = -0.4 - depth * 3.1 + Math.sin(i * 1.7) * 0.32;

  return {
    x,
    y,
    z,
    // Each window turns a little toward the middle of the frame, the way a
    // stack of real windows fans when you Expose them.
    rx: y * 0.075,
    ry: -x * 0.085,
    rz: Math.sin(i * 2.3) * 0.045,
    scale: 1,
    opacity: 1,
  };
}

/** Where a rival window sits once it has been swallowed: inside the hero, gone. */
const DOCKED: Pose = {
  x: 0,
  y: 0,
  z: -0.05,
  rx: 0,
  ry: 0,
  rz: 0,
  scale: 0.08,
  opacity: 0,
};

function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return {
    x: mix(a.x, b.x, t),
    y: mix(a.y, b.y, t),
    z: mix(a.z, b.z, t),
    rx: mix(a.rx, b.rx, t),
    ry: mix(a.ry, b.ry, t),
    rz: mix(a.rz, b.rz, t),
    scale: mix(a.scale, b.scale, t),
    opacity: mix(a.opacity, b.opacity, t),
  };
}

/**
 * How far out the rivals are, from 0 (inside the hero) to 1 (full sprawl).
 *
 * Written as a single expression over stage amounts rather than a switch on the
 * stage id, so a stage inserted between `collapse` and `clipboard` cannot leave
 * the rivals stranded on screen.
 */
export function spreadAt(frame: StageAt): number {
  return clamp01(stageAmount(frame, "sprawl") - stageAmount(frame, "collapse"));
}

/**
 * A rival's pose, with a stagger so the windows do not arrive and leave as one
 * block. The stagger is a reordering of the same 0..1, so the ends still line
 * up exactly: at spread 0 every window is docked, at spread 1 every window is
 * out, and nothing is left half-placed at a stage boundary.
 */
export function rivalPose(i: number, n: number, spread: number): Pose {
  const count = Math.max(1, n);
  const offset = (i / count) * 0.45;
  const local = clamp01((clamp01(spread) - offset) / (1 - 0.45));
  const eased = easeOutCubic(local);
  const pose = lerpPose(DOCKED, sprawlPose(i, count), eased);
  // Fade ahead of the travel, so a window is invisible before it would clip
  // through the hero rather than after.
  return { ...pose, opacity: clamp01(eased * 1.8 - 0.15) };
}

/**
 * The hero window: dark and angled while the reader is being shown the problem,
 * square-on and larger once it has eaten everything.
 */
export function heroPose(frame: StageAt): Pose {
  const collapsed = stageAmount(frame, "collapse");
  const receipted = stageAmount(frame, "receipt");
  const spread = spreadAt(frame);

  return {
    x: 0,
    y: 0,
    // Slides back a touch during the sprawl so the rivals have somewhere to be,
    // then comes forward as they fold in.
    z: mix(0, -0.9, spread) + mix(0, 0.35, collapsed),
    rx: mix(0.085, 0, collapsed),
    ry: mix(0.24, 0, collapsed),
    rz: 0,
    scale: mix(1, HERO_PEAK_SCALE, collapsed) - receipted * 0.06,
    // Never fully dark: the hero is the product, and a product that fades out
    // while the reader reads about it is an odd thing to sell. It does step
    // back during the sprawl, which is the one beat where it is not the point.
    opacity: mix(0.92, 1, collapsed) - spread * 0.22,
  };
}

/**
 * Which sidebar row the hero window highlights.
 *
 * The four proof beats each name a section of the app, so the window shows that
 * section selected while its beat is on screen. Indexes are into the sidebar
 * drawn by `heroTexture`, which is fed from `SECTIONS` in lib/panes.ts.
 */
export const HERO_SECTION: Partial<Record<StageId, number>> = {
  clipboard: 0,
  text: 1,
  capture: 2,
  system: 4,
};

export function heroSectionIndex(frame: StageAt): number {
  return HERO_SECTION[frame.id] ?? 0;
}

/**
 * Atmosphere. One number per effect, all of them stage-derived so the mood
 * reverses with the scroll like everything else.
 */
export interface Mood {
  /** Key light strength. Brightest at the collapse, the page's one big moment. */
  readonly key: number;
  /** Accent rim light on the hero. */
  readonly rim: number;
  /** Fog density: thick during the sprawl so the far windows read as far. */
  readonly fog: number;
  /** Floor grid opacity. */
  readonly grid: number;
}

export function moodAt(frame: StageAt): Mood {
  const spread = spreadAt(frame);
  const collapsed = stageAmount(frame, "collapse");
  const proved = stageAmount(frame, "clipboard");
  const trust = stageAmount(frame, "trust");

  return {
    key: mix(0.62, 1, collapsed) - trust * 0.12,
    // A pulse, not a switch. `collapsed` alone stays at 1 for every stage after
    // the collapse, which left the accent glow burning through all four proof
    // beats and the receipt and washed the whole frame red. Subtracting the
    // next stage's amount makes it rise into the moment and fall out of it.
    rim: mix(0.1, 0.85, clamp01(collapsed - proved * 0.82)),
    fog: mix(0.05, 0.105, spread),
    grid: mix(0.075, 0.03, collapsed),
  };
}
