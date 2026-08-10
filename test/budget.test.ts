import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { HEAVY, walk } from "../scripts/budget.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Calibrate the detector before believing its zero.
 *
 * A gate that reports "clean" because its regexes never matched anything is
 * worse than no gate: it is a green light nobody looks behind. So the first
 * test walks a graph three.js is definitely in and insists the walker finds it.
 * Only then does the second test's silence mean something.
 */
test("the walker can see three.js when it is genuinely there", () => {
  const graph = walk(["scene/Scene.tsx"], ROOT);
  assert.ok(graph.files.has("scene/Scene.tsx"), "the entry itself was not walked");
  assert.ok(graph.packages.has("three"), `three not found; saw ${[...graph.packages].join(", ")}`);
  assert.ok(graph.packages.has("@react-three/fiber"), "the renderer was not found either");
  // And it follows local edges, not just the entry file's own imports.
  assert.ok(graph.files.has("scene/drive.ts"), "local imports were not followed");
  assert.ok(graph.files.has("lib/timeline.ts"), "transitive local imports were not followed");
});

test("the homepage's server graph is free of three.js", () => {
  const graph = walk(["app/page.tsx", "app/layout.tsx"], ROOT);

  // Sanity: the walk actually reached the stage, so a pass is not an artefact
  // of the entry files failing to resolve.
  assert.ok(graph.files.has("components/stage/Track.tsx"), "the track was not reached");
  assert.ok(graph.files.has("components/stage/Poster.tsx"), "the poster was not reached");
  assert.ok(graph.files.has("lib/beats.ts"), "the copy was not reached");

  for (const heavy of HEAVY) {
    assert.ok(
      !graph.packages.has(heavy),
      `${heavy} is reachable from the homepage without an ssr:false boundary. ` +
        `Import it through next/dynamic with { ssr: false }, or it ships to every visitor.`,
    );
  }
});

test("the scene is deferred, not merely absent", () => {
  const graph = walk(["app/page.tsx", "app/layout.tsx"], ROOT);
  assert.ok(
    [...graph.deferred].some((spec) => spec.includes("scene/Scene")),
    `no ssr:false boundary around the scene; deferred set is ${[...graph.deferred].join(", ") || "empty"}`,
  );
});

/**
 * The poster is the thing that paints first, so it has to stay something the
 * server can render on its own: no client hooks, no canvas, no image request.
 */
test("the poster is server-renderable and asks for no network", () => {
  const graph = walk(["components/stage/Poster.tsx"], ROOT);
  assert.equal(graph.packages.size, 0, `the poster pulled in ${[...graph.packages].join(", ")}`);
});
