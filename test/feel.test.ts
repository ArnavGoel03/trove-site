import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  FEEL_ATTR,
  FEEL_BOOT_SCRIPT,
  FEEL_CHANNELS,
  FEEL_DEFAULTS,
  FEEL_STORAGE_KEY,
} from "../lib/feel.ts";

// The feel contract. One central file only stays central if these hold: a
// channel that can default to off, a boot script that reads a key nothing
// writes, or a CSS rule keyed off an attribute TypeScript renamed all produce
// switches that lie about what they do. Each is a string-to-string pairing
// across a language boundary, which is the exact class of drift this repo
// keeps rediscovering, so they are checked rather than trusted.

const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("every channel defaults to on", () => {
  for (const channel of FEEL_CHANNELS) {
    assert.equal(
      FEEL_DEFAULTS.channels[channel.id],
      true,
      `${channel.id} must default on`,
    );
  }
  assert.equal(FEEL_DEFAULTS.haptics, true);
  assert.equal(FEEL_DEFAULTS.press, true);
});

test("defaults cover exactly the declared channels, no orphans", () => {
  assert.deepEqual(
    Object.keys(FEEL_DEFAULTS.channels).sort(),
    FEEL_CHANNELS.map((c) => c.id).sort(),
  );
});

test("every channel is describable in the UI", () => {
  for (const channel of FEEL_CHANNELS) {
    assert.ok(channel.title.length > 0, `${channel.id} needs a title`);
    assert.ok(channel.blurb.length > 0, `${channel.id} needs a blurb`);
  }
});

test("patterns read as feedback, not as an event", () => {
  for (const channel of FEEL_CHANNELS) {
    const total =
      typeof channel.pattern === "number"
        ? channel.pattern
        : channel.pattern.reduce((a, b) => a + b, 0);
    assert.ok(total > 0, `${channel.id} pattern must do something`);
    assert.ok(total <= 120, `${channel.id} pattern is long enough to annoy`);
  }
});

test("the boot script reads the same storage key the store writes", () => {
  assert.ok(FEEL_BOOT_SCRIPT.includes(JSON.stringify(FEEL_STORAGE_KEY)));
});

test("the boot script treats absent preferences as on", () => {
  assert.ok(FEEL_BOOT_SCRIPT.includes('"off":"on"'));
});

test("the boot script stamps the attributes the stylesheet reads", () => {
  for (const attr of Object.values(FEEL_ATTR)) {
    assert.ok(
      FEEL_BOOT_SCRIPT.includes(JSON.stringify(attr)),
      `boot script must stamp ${attr}`,
    );
  }
});

test("the press opt-out exists in CSS and is keyed off the declared attribute", () => {
  assert.match(CSS, new RegExp(`\\[${FEEL_ATTR.press}="off"\\]`));
});

test("nothing under the scroll track gets a press transition", () => {
  // The homepage track writes inline transforms from a rAF loop; a CSS
  // transition there chases the scroll position instead of tracking it.
  assert.match(CSS, /\.stage-track :where\([^)]*\)\s*\{\s*transition: none;/);
});
