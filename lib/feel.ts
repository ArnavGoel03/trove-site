"use client";

/**
 * How the site responds to being touched. One file, no call sites.
 *
 * The app got this first (`core_feedback.swift`): press feel and haptics live
 * in the button and toggle styles, so 300 controls cannot drift into three
 * different behaviours. The site had the same problem in a smaller form, and
 * the same answer applies, with one adaptation: there are no shared control
 * components to hang behaviour off, because most pages are server-rendered
 * markup. So the behaviour attaches ONCE, as a delegated listener on the
 * document, and every button on every route is covered including ones written
 * later by someone who never reads this file.
 *
 * The channel names are deliberately identical to the app's. Trove is one
 * product; someone who turns off selection feedback in the Mac app and finds
 * the site still buzzing on every tab has been handed two products.
 *
 * What this can and cannot do: `navigator.vibrate` is a phone and tablet API.
 * Desktop Safari does not implement it at all, and desktop Chrome accepts the
 * call and does nothing. There is no Force Touch equivalent on the web, so on a
 * laptop this file's haptic half is honestly inert and the press animation is
 * the whole of the feel. The controls say so rather than letting someone
 * conclude their switch is broken.
 */

/** localStorage key. Versioned: a shape change gets `.v2`, never a silent reinterpretation. */
export const FEEL_STORAGE_KEY = "trove.feel.v1";

/**
 * Attributes stamped on `<html>`, which is what CSS reads.
 *
 * An attribute rather than a class because it is set by an inline script before
 * first paint (see `FEEL_BOOT_SCRIPT`) and read by rules that must not depend on
 * React having hydrated. A button that dips for the first 400ms of a page and
 * then stops because the preference loaded late is worse than either state.
 */
export const FEEL_ATTR = {
  haptics: "data-feel-haptics",
  press: "data-feel-press",
} as const;

/**
 * The channels, and what each one is for.
 *
 * `pattern` is milliseconds for `navigator.vibrate`: a single number is one
 * buzz, an array alternates vibrate and pause. They are short on purpose.
 * Anything a user can consciously time is an interruption, not feedback.
 */
export const FEEL_CHANNELS = [
  {
    id: "tap",
    title: "Button taps",
    blurb: "Every button, card and call to action.",
    pattern: 8,
  },
  {
    id: "toggle",
    title: "Switches and checkboxes",
    blurb: "Anything that flips between two states.",
    pattern: 12,
  },
  {
    id: "selection",
    title: "Selection changes",
    blurb: "Moving between tabs, filters and navigation links.",
    pattern: 5,
  },
  {
    id: "success",
    title: "Completion",
    blurb: "A copy, a download starting, a form accepted.",
    pattern: [10, 40, 16],
  },
  {
    id: "warning",
    title: "Warnings",
    blurb: "Something refused or failed.",
    pattern: [18, 60, 18],
  },
] as const;

export type FeelChannelId = (typeof FEEL_CHANNELS)[number]["id"];

export interface FeelPrefs {
  /** Master switch for the haptic half. */
  haptics: boolean;
  /** The visual half: buttons dip while held. Useful with a mouse, so separate. */
  press: boolean;
  /** Per-channel switches, all gated by `haptics`. */
  channels: Record<FeelChannelId, boolean>;
}

const CHANNEL_IDS = FEEL_CHANNELS.map((c) => c.id) as FeelChannelId[];

/** Everything on. An opt-out only works if it starts from the full experience. */
export const FEEL_DEFAULTS: FeelPrefs = {
  haptics: true,
  press: true,
  channels: Object.fromEntries(CHANNEL_IDS.map((id) => [id, true])) as Record<
    FeelChannelId,
    boolean
  >,
};

/* -------------------------------------------------------------------------
 * Pre-paint boot script
 * ---------------------------------------------------------------------- */

/**
 * Inlined in `<head>`. Stamps the two attributes from storage before the first
 * frame, so a returning visitor who switched press animation off never sees one.
 *
 * Written as a string because it has to run before the bundle does. It is
 * deliberately tiny and total: any parse failure leaves the defaults in place,
 * which is the on state.
 */
export const FEEL_BOOT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(
  FEEL_STORAGE_KEY,
)})||"{}");var e=document.documentElement;e.setAttribute(${JSON.stringify(
  FEEL_ATTR.haptics,
)},p.haptics===false?"off":"on");e.setAttribute(${JSON.stringify(
  FEEL_ATTR.press,
)},p.press===false?"off":"on");}catch(_){}})();`;

/* -------------------------------------------------------------------------
 * Store
 * ---------------------------------------------------------------------- */

let prefs: FeelPrefs = FEEL_DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

function normalise(raw: unknown): FeelPrefs {
  const src = (raw ?? {}) as Partial<FeelPrefs> & {
    channels?: Partial<Record<string, unknown>>;
  };
  return {
    haptics: src.haptics !== false,
    press: src.press !== false,
    // Read per channel rather than trusting the stored object's shape: a
    // channel added after someone's preferences were written must default to
    // on, not to `undefined` and thence to off.
    channels: Object.fromEntries(
      CHANNEL_IDS.map((id) => [id, src.channels?.[id] !== false]),
    ) as Record<FeelChannelId, boolean>,
  };
}

function load(): FeelPrefs {
  if (loaded || typeof window === "undefined") return prefs;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(FEEL_STORAGE_KEY);
    prefs = normalise(raw ? JSON.parse(raw) : {});
  } catch {
    prefs = FEEL_DEFAULTS;
  }
  return prefs;
}

function stamp() {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.setAttribute(FEEL_ATTR.haptics, prefs.haptics ? "on" : "off");
  el.setAttribute(FEEL_ATTR.press, prefs.press ? "on" : "off");
}

/** Subscribe for `useSyncExternalStore`. */
export function subscribeFeel(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Current preferences. Loads from storage on first client call. */
export function getFeel(): FeelPrefs {
  return load();
}

/** The snapshot React hydrates against: the server cannot know a local choice. */
export function getFeelServerSnapshot(): FeelPrefs {
  return FEEL_DEFAULTS;
}

/** Replace preferences, persist, restamp, notify. The only writer. */
export function setFeel(next: FeelPrefs) {
  prefs = normalise(next);
  loaded = true;
  try {
    window.localStorage.setItem(FEEL_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Private browsing with storage denied. The choice holds for this page
    // rather than throwing; nothing here is worth breaking a render over.
  }
  stamp();
  listeners.forEach((fn) => fn());
}

/* -------------------------------------------------------------------------
 * Firing
 * ---------------------------------------------------------------------- */

/** Whether this device can actually play a haptic. False on every desktop. */
export function hasVibration(): boolean {
  return (
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function"
  );
}

function play(id: FeelChannelId): boolean {
  if (!hasVibration()) return false;
  const channel = FEEL_CHANNELS.find((c) => c.id === id);
  if (!channel) return false;
  try {
    // Spread: the const-asserted tuple is readonly and `vibrate` wants a
    // mutable array.
    return navigator.vibrate(
      typeof channel.pattern === "number"
        ? channel.pattern
        : [...channel.pattern],
    );
  } catch {
    return false;
  }
}

/** Fire `id`, honouring the master switch and that channel's switch. */
export function feel(id: FeelChannelId): void {
  const p = getFeel();
  if (!p.haptics || !p.channels[id]) return;
  play(id);
}

/**
 * Fire `id` ignoring both switches. For the Test buttons in the controls only:
 * a preview that stays silent because the thing being previewed is off teaches
 * the wrong lesson.
 */
export function feelPreview(id: FeelChannelId): void {
  play(id);
}

/* -------------------------------------------------------------------------
 * The delegated listener
 * ---------------------------------------------------------------------- */

/**
 * Which channel an element belongs to, by what it IS rather than by what it was
 * annotated with. Annotation is the override, not the mechanism: a component
 * added next year gets feedback without being told to.
 *
 * `data-feel="off"` on an element or any ancestor suppresses it, which is how a
 * drag surface or a scrubber opts out of buzzing on every pointer down.
 */
export function channelForTarget(target: Element | null): FeelChannelId | null {
  if (!target) return null;

  const tagged = target.closest("[data-feel]");
  if (tagged) {
    const value = tagged.getAttribute("data-feel");
    if (value === "off") return null;
    if (CHANNEL_IDS.includes(value as FeelChannelId)) {
      return value as FeelChannelId;
    }
  }

  if (
    target.closest(
      'input[type="checkbox"], input[type="radio"], [role="switch"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    )
  ) {
    return "toggle";
  }

  if (
    target.closest(
      '[role="tab"], [role="option"], [role="radio"], nav a[href], [data-feel-selection]',
    )
  ) {
    return "selection";
  }

  if (
    target.closest(
      'button, a[href], summary, label, [role="button"], [role="link"], [role="menuitem"]',
    )
  ) {
    return "tap";
  }

  return null;
}

let attached = false;

/**
 * Attach the one listener. Idempotent, so React Strict Mode's double effect and
 * a client-side route change cannot end up with two.
 *
 * `pointerdown` rather than `click`: feedback belongs at the moment of contact.
 * On `click` it lands after the press has already ended, which reads as lag
 * even at 60ms. Capture phase so a component calling `stopPropagation` on its
 * own handler does not silently switch feedback off for its subtree.
 */
export function initFeel(): () => void {
  if (typeof document === "undefined" || attached) return () => {};
  attached = true;
  load();
  stamp();

  const onPointerDown = (event: PointerEvent) => {
    // Primary contact only. A right-click opening a context menu, or the second
    // finger of a pinch, is not a press.
    if (event.button !== 0) return;
    const channel = channelForTarget(event.target as Element | null);
    if (channel) feel(channel);
  };

  document.addEventListener("pointerdown", onPointerDown, {
    capture: true,
    passive: true,
  });

  return () => {
    document.removeEventListener("pointerdown", onPointerDown, {
      capture: true,
    });
    attached = false;
  };
}
