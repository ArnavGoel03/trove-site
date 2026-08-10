/**
 * The one number, and how everything else hears about it.
 *
 * Track measures scroll once per frame and writes it here. The camera, the
 * copy, the receipt and the demos all read from here. Deliberately NOT React
 * state: a value that changes sixty times a second would re-render the whole
 * homepage sixty times a second, and the frame budget is spent on the scene.
 *
 * Subscribers are called in insertion order with the already-computed stage, so
 * `stageAt` runs once per frame rather than once per listener.
 */

import { stageAt, type StageAt } from "@/lib/timeline";

export type Frame = StageAt;
export type Listener = (frame: Frame) => void;

export interface ProgressStore {
  /** Latest frame. Safe to read at any time, including during render. */
  get(): Frame;
  /** Push a new scroll position. Returns the frame it produced. */
  set(progress: number): Frame;
  /** Listen for frames. The listener fires immediately with the current one. */
  subscribe(fn: Listener): () => void;
}

export function createProgressStore(initial = 0): ProgressStore {
  let frame = stageAt(initial);
  const listeners = new Set<Listener>();

  return {
    get: () => frame,
    set(progress: number) {
      frame = stageAt(progress);
      for (const fn of listeners) fn(frame);
      return frame;
    },
    subscribe(fn: Listener) {
      listeners.add(fn);
      fn(frame);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}
