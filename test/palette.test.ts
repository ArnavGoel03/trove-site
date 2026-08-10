import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { HUE, STATUS } from "../lib/palette.ts";

// Tailwind reads its palette from @theme in the stylesheet; TypeScript reads it
// from lib/palette.ts. Two hand-written copies of one value is exactly the
// drift this repo keeps finding, so the copies are checked against each other
// rather than trusted.
const CSS = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function cssVar(name: string): string | undefined {
  return CSS.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
}

test("every semantic tone has a matching @theme token", () => {
  for (const [tone, hex] of Object.entries(STATUS)) {
    assert.equal(
      cssVar(`color-${tone}`),
      hex,
      `--color-${tone} in app/globals.css must equal STATUS.${tone}`,
    );
  }
});

test("the Storage pink is mirrored too", () => {
  assert.equal(cssVar("color-pink"), HUE.pink);
});

test("no two hues are the same colour", () => {
  const values = Object.values(HUE);
  assert.equal(new Set(values).size, values.length);
});

test("every semantic tone is drawn from the raw palette", () => {
  const hues = new Set<string>(Object.values(HUE));
  for (const [tone, hex] of Object.entries(STATUS)) {
    assert.ok(hues.has(hex), `STATUS.${tone} is not one of the HUE values`);
  }
});
