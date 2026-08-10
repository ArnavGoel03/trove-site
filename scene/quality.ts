/**
 * What this machine can be asked to draw.
 *
 * Measured from the device, decided once, never re-decided mid-scroll. A scene
 * that quietly halves its pixel ratio on a four year old phone is doing its
 * job; one that insists on the full image at 18fps is not.
 *
 * Two of these are not quality tiers at all, they are contracts:
 *
 *   `webgl: false`   there is no renderer, so the page keeps the poster and the
 *                    stacked copy and never loads three.js.
 *   `reducedMotion`  the reader has told the operating system that movement
 *                    hurts. That is not a hint about their GPU. Nothing scrubs,
 *                    the beats become ordinary sections, and the canvas is
 *                    never mounted.
 *
 * Both land on the same DOM the server already sent, which is the point: the
 * fallback is not a second copy of the page that can drift, it is this page
 * with the scrubbing turned off.
 */

export type Quality = "high" | "medium" | "low";

export interface Capability {
  readonly quality: Quality;
  /** Device pixel ratio to render at, capped. */
  readonly dpr: number;
  /** True when the renderer may mount at all. */
  readonly webgl: boolean;
  readonly reducedMotion: boolean;
  /**
   * Viewport too narrow to hold copy beside the scene.
   *
   * A statement about the WINDOW, not the device: a desktop browser dragged to
   * 600px wide needs the narrow framing just as much as a phone does. Kept at
   * the same 768px Tailwind switches the copy layout at, so the camera and the
   * column can never disagree about which layout is on screen.
   */
  readonly narrow: boolean;
  /** How many rival windows the sprawl draws. Below this it draws cards. */
  readonly windowCount: number;
  /** Whether the floor reflection and the depth-of-field pass run. */
  readonly richMaterials: boolean;
}

/** True when a WebGL2 context can actually be created, not merely declared. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    // WebGL2 only. The scene uses instancing without an extension dance, and a
    // machine old enough to be WebGL1-only is a machine that should be reading
    // the stacked version anyway.
    return canvas.getContext("webgl2") !== null;
  } catch {
    // Some hardened browser profiles throw here rather than returning null.
    return false;
  }
}

/**
 * Measure the client. Safe to call only in the browser.
 *
 * `maxWindows` is the number of rival windows the caller has copy for, so the
 * low tier can thin the crowd without the scene inventing a count of its own.
 */
export function detect(maxWindows: number): Capability {
  const reducedMotion =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cores = navigator.hardwareConcurrency ?? 4;
  const ratio = window.devicePixelRatio || 1;
  const narrow = window.innerWidth < 768;
  // Touch AND narrow. Core count alone lies: a current phone reports eight and
  // is not a desktop, and a touchscreen laptop is not a phone.
  const handheld =
    typeof matchMedia === "function" &&
    matchMedia("(pointer: coarse)").matches &&
    window.innerWidth < 900;

  const quality: Quality = handheld
    ? cores >= 6
      ? "medium"
      : "low"
    : cores >= 8
      ? "high"
      : "medium";

  return {
    quality,
    // Capping at 2 is invisible and saves the fourfold fill rate a 3x screen
    // would otherwise demand of a full-viewport canvas.
    dpr: quality === "low" ? Math.min(ratio, 1.5) : Math.min(ratio, 2),
    webgl: hasWebGL(),
    reducedMotion,
    narrow,
    windowCount:
      quality === "low" ? Math.min(6, maxWindows) : maxWindows,
    richMaterials: quality === "high",
  };
}

/**
 * What the server assumes, and what the client uses for the one frame before
 * `detect()` runs.
 *
 * `webgl: false` deliberately. The safe assumption is the one where nothing
 * heavy loads: a machine that can render gets upgraded a frame later and the
 * reader sees a fade, whereas the other default would flash a canvas onto a
 * machine that cannot draw it.
 */
export const SAFE: Capability = {
  quality: "medium",
  dpr: 1.5,
  webgl: false,
  reducedMotion: false,
  narrow: false,
  windowCount: 8,
  richMaterials: false,
};
