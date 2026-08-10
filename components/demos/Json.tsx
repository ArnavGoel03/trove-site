"use client";

import { useMemo, useState } from "react";
import Shell from "./Shell";

const SAMPLE = `{"licence":{"plan":"suite","seats":1,"apps":["trove","relay","tend"]},"device":{"arch":"arm64","offline":true}}`;

/** Depth and leaf count, so the readout says something the eye cannot. */
function shape(value: unknown, depth = 0): { depth: number; leaves: number } {
  if (value === null || typeof value !== "object") return { depth, leaves: 1 };
  const entries = Object.values(value as Record<string, unknown>);
  if (entries.length === 0) return { depth, leaves: 0 };
  return entries.reduce<{ depth: number; leaves: number }>(
    (acc, child) => {
      const s = shape(child, depth + 1);
      return { depth: Math.max(acc.depth, s.depth), leaves: acc.leaves + s.leaves };
    },
    { depth, leaves: 0 },
  );
}

/**
 * Paste JSON, get JSON back that a person can read.
 *
 * `JSON.parse` in a try, which is the whole implementation, because that is
 * genuinely all this needs to be. The interesting part is the failure path: a
 * formatter that says "invalid JSON" has told you nothing, so this surfaces
 * the parser's own message, which names the character position.
 */
export default function Json() {
  const [raw, setRaw] = useState(SAMPLE);

  const result = useMemo(() => {
    if (raw.trim() === "") return { ok: true as const, text: "", depth: 0, leaves: 0 };
    try {
      const parsed: unknown = JSON.parse(raw);
      const s = shape(parsed);
      return {
        ok: true as const,
        text: JSON.stringify(parsed, null, 2),
        depth: s.depth,
        leaves: s.leaves,
      };
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Could not parse that.",
      };
    }
  }, [raw]);

  return (
    <Shell
      title="JSON / XML"
      href="/pane/json-xml"
      hint={
        result.ok
          ? `${result.leaves} values, ${result.depth} levels deep. Nothing left this tab.`
          : "The parser's own message, including where it gave up."
      }
    >
      <label className="sr-only" htmlFor="demo-json-in">
        JSON to format
      </label>
      <textarea
        id="demo-json-in"
        value={raw}
        spellCheck={false}
        onChange={(e) => setRaw(e.target.value)}
        rows={3}
        className="demo-input font-mono"
      />
      <pre
        className={`demo-output font-mono ${result.ok ? "" : "text-accent"}`}
        aria-live="polite"
      >
        {result.ok ? result.text : result.message}
      </pre>
    </Shell>
  );
}
