import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  firstYearMinor,
  oldestCheck,
  oneTimeMinor,
  recurringPerYearMinor,
  RIVALS,
} from "../lib/rivals.ts";

/**
 * Pane names are read out of the source text rather than imported.
 *
 * lib/panes.ts imports lucide-react for its icons, which drags React into a
 * plain node --test run for no benefit. The only thing this test needs is the
 * set of names, and reading them as text keeps the check dependency-free and
 * fast. The tradeoff is that it would miss a rename that changed the quoting
 * style, which is why the regex is anchored to the exact literal form the file
 * uses everywhere.
 */
function paneNames(): Set<string> {
  const source = readFileSync(new URL("../lib/panes.ts", import.meta.url), "utf8");
  const names = source.matchAll(/^\s{4}name: "([^"]+)",$/gm);
  return new Set([...names].map((m) => m[1]));
}

test("every rival names at least one real pane it overlaps with", () => {
  const panes = paneNames();
  assert.ok(panes.size > 40, `expected the pane list to parse, got ${panes.size}`);

  for (const rival of RIVALS) {
    assert.ok(rival.replaces.length > 0, `${rival.name} replaces nothing`);
    for (const pane of rival.replaces) {
      assert.ok(
        panes.has(pane),
        `${rival.name} claims to replace "${pane}", which is not a pane in lib/panes.ts`,
      );
    }
  }
});

test("every price is attributable", () => {
  for (const rival of RIVALS) {
    assert.match(
      rival.source,
      /^https:\/\/(www\.)?([a-z0-9-]+\.)+[a-z]{2,}\//,
      `${rival.name} has no usable source URL`,
    );
    // Review sites and deal aggregators go stale and get the number wrong.
    // Vendor pages and the App Store only.
    assert.doesNotMatch(
      rival.source,
      /(macworld|techradar|capterra|getapp|stacksocial|setapp|g2\.com|saasworthy)/i,
      `${rival.name} is sourced from an aggregator, not the vendor`,
    );
    assert.ok(rival.priceMinor > 0, `${rival.name} has no price`);
    assert.match(rival.checked, /^\d{4}-\d{2}-\d{2}$/, `${rival.name} checked date malformed`);
    assert.ok(
      rival.asShown.includes("$"),
      `${rival.name} must record the price as the vendor displays it`,
    );
  }
});

test("prices are not stale", () => {
  const oldest = new Date(`${oldestCheck()}T00:00:00Z`).getTime();
  const days = (Date.now() - oldest) / 86_400_000;
  assert.ok(
    days < 180,
    `rival prices were last checked ${Math.round(days)} days ago, re-verify them`,
  );
});

test("totals split recurring from one-time and never double count", () => {
  const recurring = recurringPerYearMinor();
  const once = oneTimeMinor();

  assert.equal(firstYearMinor(), recurring + once);
  assert.equal(
    recurring,
    RIVALS.filter((r) => r.cadence === "year").reduce((s, r) => s + r.priceMinor, 0),
  );
  assert.equal(
    once,
    RIVALS.filter((r) => r.cadence === "once").reduce((s, r) => s + r.priceMinor, 0),
  );
  // Both buckets must be non-empty, otherwise the receipt's two-column layout
  // renders an empty side and reads as a bug.
  assert.ok(recurring > 0 && once > 0);
});

test("no rival is listed twice", () => {
  const names = RIVALS.map((r) => r.name);
  assert.equal(new Set(names).size, names.length);
});
