// The scroll contract.
//
// One number, the reader's position through the track, drives every visual on
// the homepage. Nothing here holds state, reads a clock, or remembers which way
// the reader was going, and that is the entire point: a scrubbed timeline is
// random access. Someone can flick to the bottom, drag back to the middle, or
// land mid-page from a restored session, and each of those has to produce the
// same frame as arriving there slowly from the top.
//
// The moment any part of the scene integrates (a spring, an accumulator, a
// ping-pong buffer), forward and reverse stop agreeing and the desync is
// permanent, because there is no event that resets it. The camera in scene/rig
// is allowed to damp toward its target, because damping is a lag that converges
// on the same pose from either direction. A spring carries velocity and does
// not.
//
// So: every visual is a pure function of (stageAt(progress), clock). The clock
// is only for things with no beginning and no end, like a slow drift, which
// look identical whenever you arrive.

/** Clamp to the unit interval. */
export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Linear interpolation. */
export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Remap `n` from [inMin, inMax] to [0, 1], clamped.
 * Returns 0 rather than dividing by zero on a degenerate range.
 */
export function span(n: number, inMin: number, inMax: number): number {
  const size = inMax - inMin;
  return size === 0 ? 0 : clamp01((n - inMin) / size);
}

/** Hermite ease. Zero slope at both ends, so nothing starts or stops abruptly. */
export function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/** Slower in, faster through the middle, slower out. Camera moves use this. */
export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Fast start, long settle. Good for things arriving. */
export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

export type Easing = (t: number) => number;

const EASINGS = {
  smoothstep,
  easeInOutCubic,
  easeOutCubic,
  linear: clamp01,
} as const;

export type EasingName = keyof typeof EASINGS;

export interface StageSpec {
  readonly id: string;
  /**
   * Relative length. One unit of weight is one viewport height of scrolling,
   * so a stage with more to say gets a bigger number rather than a hand-typed
   * pixel offset. TRACK_VH is derived from the sum, which is why adding a stage
   * cannot desync the track height from the stage boundaries.
   */
  readonly weight: number;
  /**
   * Dead zone at the start and end of the stage, as a fraction of its own
   * length, during which `eased` is pinned at 0 and 1.
   *
   * Without this, a headline is only fully legible at one exact scroll
   * position, and reading it means holding still at a pixel. With it, the beat
   * arrives, sits still long enough to be read, and then leaves.
   */
  readonly hold: readonly [number, number];
  readonly ease: EasingName;
  /** The beat, in a few words. Used by the fallback and by the debug overlay. */
  readonly label: string;
}

/**
 * The nine beats, in order. The three-act shape is: what is wrong (desk,
 * sprawl), what replaces it (collapse), that it is real (clipboard, text,
 * capture, system), what it costs (receipt), and why to trust it (trust).
 *
 * Weights are the edit. Sprawl and receipt are the two beats a visitor has to
 * actually absorb, so they are the longest. Desk is short because it is a
 * held breath, not an argument.
 */
export const STAGES = [
  { id: "desk", weight: 0.8, hold: [0.0, 0.15], ease: "easeOutCubic", label: "A Mac at rest" },
  { id: "sprawl", weight: 1.5, hold: [0.1, 0.2], ease: "easeInOutCubic", label: "Ten apps to do one job" },
  { id: "collapse", weight: 1.3, hold: [0.05, 0.25], ease: "easeInOutCubic", label: "They fold into one" },
  { id: "clipboard", weight: 1.0, hold: [0.15, 0.2], ease: "smoothstep", label: "Everything you copied" },
  { id: "text", weight: 1.0, hold: [0.15, 0.2], ease: "smoothstep", label: "Text, actually worked on" },
  { id: "capture", weight: 1.0, hold: [0.15, 0.2], ease: "smoothstep", label: "Capture and read the screen" },
  { id: "system", weight: 1.0, hold: [0.15, 0.2], ease: "smoothstep", label: "What the machine is doing" },
  { id: "receipt", weight: 1.6, hold: [0.1, 0.25], ease: "easeInOutCubic", label: "What it replaces, and what it costs" },
  { id: "trust", weight: 1.3, hold: [0.1, 0.3], ease: "easeOutCubic", label: "No account, no cloud, no telemetry" },
] as const satisfies readonly StageSpec[];

export type StageId = (typeof STAGES)[number]["id"];

const TOTAL_WEIGHT = STAGES.reduce((sum, s) => sum + s.weight, 0);

/**
 * Track height in viewport units. Derived, never typed: the CSS that sizes the
 * scroll track reads this, so a stage weight change moves the boundaries and
 * the track together and they cannot drift apart.
 */
export const TRACK_VH = Math.round(TOTAL_WEIGHT * 100);

export interface StageBounds {
  readonly id: StageId;
  readonly index: number;
  /** Progress at which this stage begins, in [0, 1]. */
  readonly start: number;
  /** Progress at which this stage ends. Equals the next stage's start. */
  readonly end: number;
}

/** Cumulative boundaries, computed once. */
export const BOUNDS: readonly StageBounds[] = (() => {
  const out: StageBounds[] = [];
  let acc = 0;
  STAGES.forEach((s, index) => {
    const start = acc / TOTAL_WEIGHT;
    acc += s.weight;
    out.push({ id: s.id, index, start, end: acc / TOTAL_WEIGHT });
  });
  // Kill accumulated float drift at the far end so the last stage genuinely
  // reaches 1 and the final beat is fully readable at the bottom of the track.
  out[out.length - 1] = { ...out[out.length - 1], end: 1 };
  return out;
})();

const INDEX_BY_ID = new Map<StageId, number>(BOUNDS.map((b) => [b.id, b.index]));

export interface StageAt {
  readonly index: number;
  readonly id: StageId;
  /** Raw position within the stage, [0, 1]. */
  readonly local: number;
  /** `local` with the hold applied and the stage's easing curve. */
  readonly eased: number;
  /** Overall track progress, clamped. Handy for anything continuous. */
  readonly progress: number;
}

/**
 * Which beat is on screen, and how far through it we are.
 *
 * Pure and total: any finite input returns a valid stage, NaN included, because
 * a NaN scroll position on one frame must not blank the page.
 */
export function stageAt(progress: number): StageAt {
  const p = Number.isFinite(progress) ? clamp01(progress) : 0;

  let index = BOUNDS.length - 1;
  for (const b of BOUNDS) {
    if (p < b.end) {
      index = b.index;
      break;
    }
  }

  const b = BOUNDS[index];
  const spec = STAGES[index];
  const local = span(p, b.start, b.end);
  const [holdIn, holdOut] = spec.hold;
  const active = span(local, holdIn, 1 - holdOut);

  return {
    index,
    id: b.id,
    local,
    eased: EASINGS[spec.ease](active),
    progress: p,
  };
}

/**
 * How long a beat's copy takes to arrive and to leave, as a fraction of its
 * stage. Shorter than the scene's own easing on purpose: words should be
 * legible for most of the beat, and a headline that spends a third of its life
 * at 40% opacity is a headline nobody finishes reading.
 */
export const COPY_IN = 0.12;
export const COPY_OUT = 0.18;

export interface Envelope {
  /** 0 to 1. */
  readonly opacity: number;
  /**
   * Vertical offset as a signed fraction of one nudge: +1 means "still below,
   * on its way in", -1 means "gone up and out". The caller decides how many
   * pixels a nudge is, because that is a layout question, not a timing one.
   */
  readonly shift: number;
}

/**
 * The copy's own fade, derived from raw `local` rather than `eased`.
 *
 * Deliberately not `eased`: the stage easing pins at 0 through the intro hold
 * and at 1 through the outro hold, which is exactly backwards for words. The
 * hold is when the reader is reading, so that is when opacity must be 1.
 *
 * Pure, so a reverse scrub reproduces it exactly, and total, so a NaN frame
 * fades to nothing rather than throwing mid-render.
 *
 * `fadeIn` exists for the beat the reader lands on. Every other beat is
 * arrived at, so it earns its fade; the first one is simply there when the
 * page opens. With the fade applied to it the site's opening frame was a dim
 * app window and no words at all: the headline only appeared once you scrolled,
 * which is the wrong order for the one screen that has to make the argument.
 * The stylesheet already says so for the pre-JS frame
 * (`.stage-beat:first-child { opacity: 1 }`); this is the same rule for the
 * frame after JS takes over.
 */
export function copyEnvelope(local: number, fadeIn = true): Envelope {
  const l = Number.isFinite(local) ? clamp01(local) : 0;
  const arriving = fadeIn ? span(l, 0, COPY_IN) : 1;
  const leaving = span(l, 1 - COPY_OUT, 1);
  return {
    opacity: Math.min(easeOutCubic(arriving), 1 - easeOutCubic(leaving)),
    shift: (1 - arriving) - leaving,
  };
}

/** Track progress at which a stage begins. For scroll-to-beat links. */
export function progressForStage(id: StageId): number {
  const index = INDEX_BY_ID.get(id);
  if (index === undefined) throw new Error(`unknown stage: ${id}`);
  return BOUNDS[index].start;
}

/**
 * Progress at which a beat is fully composed and sitting still.
 *
 * Not the midpoint of the stage: `eased` ramps across the stage body and is
 * pinned at 1 only through the outro hold, so the middle of a stage is a frame
 * mid-transition. Landing a nav link there shows a headline halfway in, which
 * reads as a broken page rather than as an animation. This targets the middle
 * of the settled window, which is why every stage is required to have a
 * non-zero outro hold.
 */
export function progressForBeat(id: StageId): number {
  const index = INDEX_BY_ID.get(id);
  if (index === undefined) throw new Error(`unknown stage: ${id}`);
  const b = BOUNDS[index];
  return mix(b.start, b.end, 1 - STAGES[index].hold[1] / 2);
}

/**
 * How many stages away `id` is from the current position, signed. Demos mount
 * at a distance of 1 and unmount past it, so the browser is never running six
 * live widgets at once.
 */
export function stageDistance(current: number, id: StageId): number {
  const index = INDEX_BY_ID.get(id);
  if (index === undefined) throw new Error(`unknown stage: ${id}`);
  return index - current;
}
