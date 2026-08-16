"use client";

import { useSyncExternalStore } from "react";
import {
  FEEL_CHANNELS,
  type FeelChannelId,
  type FeelPrefs,
  feelPreview,
  getFeel,
  getFeelServerSnapshot,
  hasVibration,
  setFeel,
  subscribeFeel,
} from "@/lib/feel";

/**
 * The switches for everything in `lib/feel.ts`.
 *
 * Lives on /accessibility rather than in a floating widget: haptics and motion
 * are an accessibility preference, and this is the page a person already goes
 * to when a site is doing something they want stopped.
 *
 * Every row is written from the stored preferences, so this stays correct when
 * a channel is added or removed. There is no second list to update.
 */
export default function FeelControls() {
  const prefs = useSyncExternalStore(
    subscribeFeel,
    getFeel,
    getFeelServerSnapshot,
  );

  // `useSyncExternalStore` hydrates against the server snapshot, so the first
  // client render is the defaults and the real value arrives one frame later.
  // Capability is read the same way to keep the markup identical on both.
  const canVibrate = useSyncExternalStore(
    subscribeFeel,
    hasVibration,
    () => false,
  );

  const update = (patch: Partial<FeelPrefs>) => setFeel({ ...prefs, ...patch });

  const setChannel = (id: FeelChannelId, on: boolean) =>
    update({ channels: { ...prefs.channels, [id]: on } });

  return (
    <div className="rounded-lg border border-line-soft bg-surface-1 p-5">
      <Row
        label="Haptic feedback"
        hint="A short buzz when you press something. Phones and tablets only."
        checked={prefs.haptics}
        onChange={(on) => update({ haptics: on })}
      />

      <div
        className="mt-4 space-y-3 border-l border-line-soft pl-4"
        // Not `hidden`: the rows stay readable so someone can see what they
        // switched off, dimmed and inert so it is obvious they are not live.
        aria-disabled={!prefs.haptics}
      >
        <p className="text-caption font-medium text-fg-dim">Which moments</p>
        {FEEL_CHANNELS.map((channel) => (
          <div key={channel.id} className="flex items-start gap-3">
            <div className={prefs.haptics ? "flex-1" : "flex-1 opacity-45"}>
              <Row
                label={channel.title}
                hint={channel.blurb}
                checked={prefs.channels[channel.id]}
                disabled={!prefs.haptics}
                nested
                onChange={(on) => setChannel(channel.id, on)}
              />
            </div>
            {/* Deliberately previews even when the channel is off: the
                question this answers is "what does it feel like", and on most
                laptops also "does this device do haptics at all". */}
            <button
              type="button"
              onClick={() => feelPreview(channel.id)}
              className="shrink-0 rounded-xs px-1 py-0.5 text-caption text-fg-mute transition-colors duration-[--duration-fast] hover:text-accent"
            >
              Test
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-line-soft pt-4">
        <Row
          label="Press animation"
          hint="Buttons dip slightly while held. Visual rather than physical, so it works with a mouse. Reduce Motion switches it off regardless."
          checked={prefs.press}
          onChange={(on) => update({ press: on })}
        />
      </div>

      <p className="mt-4 text-caption text-fg-mute text-pretty">
        {canVibrate
          ? "This device reports vibration support, so the Test buttons above should be felt."
          : "This device has no vibration hardware the browser can reach, which is every desktop and laptop. The switches are still saved and will apply on your phone. The press animation is unaffected."}
      </p>
    </div>
  );
}

/** One labelled switch. The site has exactly one of these, on purpose. */
function Row({
  label,
  hint,
  checked,
  disabled = false,
  nested = false,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  /** A channel under the master switch. Smaller box, so the hierarchy reads. */
  nested?: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={`mt-0.5 shrink-0 accent-[var(--color-accent)] ${
          nested ? "size-3.5" : "size-4"
        }`}
      />
      <span className="min-w-0">
        <span className="block text-body text-fg">{label}</span>
        <span className="block text-caption text-fg-dim text-pretty">
          {hint}
        </span>
      </span>
    </label>
  );
}
