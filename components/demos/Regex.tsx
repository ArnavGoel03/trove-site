"use client";

import { useMemo, useState } from "react";
import Shell from "./Shell";

// Deliberately example.com, not a real support address. Sample data gets read
// as documentation: the previous subject advertised a support mailbox on a
// domain nobody here owns, to everyone who scrolled this demo.
const SAMPLE_SUBJECT = `arnav@example.com, support@example.com
ops+alerts@arnavgoel.dev
not-an-address@, @nope.com`;

const SAMPLE_PATTERN = "[\\w.+-]+@[\\w-]+\\.[\\w.]+";

/**
 * Caps, not a promise.
 *
 * A regex engine that backtracks can take exponential time on an input a
 * reader can type in two seconds, and JavaScript's is one of those. There is no
 * timeout on `String.match` and no way to interrupt it on the main thread, so
 * the only real defences are: keep the subject short enough that even a bad
 * pattern finishes, and refuse the shapes that blow up.
 *
 * The heuristic catches the classic nested quantifier, `(a+)+` and friends,
 * which is what almost every hand-written catastrophic pattern actually is. It
 * is not a proof, which is why the subject cap is there as well and why it is
 * this small. The app itself runs this in a separate process with a real
 * deadline; a marketing page gets to be more conservative than the product.
 */
const MAX_SUBJECT = 2_000;
const MAX_PATTERN = 200;
const NESTED_QUANTIFIER = /\([^)]*[+*][^)]*\)\s*[+*]/;

interface Hit {
  readonly start: number;
  readonly end: number;
  readonly text: string;
}

function run(pattern: string, flags: string, subject: string) {
  if (pattern === "") return { hits: [] as Hit[], error: null };
  if (pattern.length > MAX_PATTERN)
    return { hits: [] as Hit[], error: `Pattern capped at ${MAX_PATTERN} characters here.` };
  if (NESTED_QUANTIFIER.test(pattern))
    return {
      hits: [] as Hit[],
      error: "Nested quantifier, e.g. (a+)+. That shape can hang the tab, so it is refused.",
    };

  try {
    const re = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
    const hits: Hit[] = [];
    for (const m of subject.slice(0, MAX_SUBJECT).matchAll(re)) {
      if (m.index === undefined) continue;
      hits.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
      // A zero-width match would otherwise loop forever on some engines.
      if (m[0] === "" || hits.length >= 500) break;
    }
    return { hits, error: null };
  } catch (error) {
    return {
      hits: [] as Hit[],
      error: error instanceof Error ? error.message : "Not a valid expression.",
    };
  }
}

export default function Regex() {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN);
  const [subject, setSubject] = useState(SAMPLE_SUBJECT);
  const [ignoreCase, setIgnoreCase] = useState(true);

  const { hits, error } = useMemo(
    () => run(pattern, ignoreCase ? "gi" : "g", subject),
    [pattern, subject, ignoreCase],
  );

  // Rebuild the subject with the matches wrapped, in one pass, so overlapping
  // renders are impossible and the highlight can never drift from the count.
  const marked = useMemo(() => {
    const out: React.ReactNode[] = [];
    let cursor = 0;
    hits.forEach((hit, i) => {
      if (hit.start > cursor) out.push(subject.slice(cursor, hit.start));
      out.push(
        <mark key={i} className="rounded-xs bg-accent/25 text-fg">
          {hit.text}
        </mark>,
      );
      cursor = hit.end;
    });
    out.push(subject.slice(cursor));
    return out;
  }, [hits, subject]);

  return (
    <Shell
      title="Regex"
      href="/pane/regex"
      hint={error ?? `${hits.length} ${hits.length === 1 ? "match" : "matches"}, highlighted live.`}
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="demo-regex-pattern">
          Pattern
        </label>
        <input
          id="demo-regex-pattern"
          value={pattern}
          spellCheck={false}
          onChange={(e) => setPattern(e.target.value)}
          className="demo-input flex-1 font-mono"
        />
        <label className="flex shrink-0 items-center gap-2 text-caption text-fg-dim">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="accent-[var(--color-accent)]"
          />
          <span className="font-mono">i</span>
        </label>
      </div>
      <label className="sr-only" htmlFor="demo-regex-subject">
        Text to search
      </label>
      <textarea
        id="demo-regex-subject"
        value={subject}
        spellCheck={false}
        rows={3}
        onChange={(e) => setSubject(e.target.value)}
        className="demo-input mt-2 font-mono"
      />
      <pre className="demo-output font-mono" aria-live="polite">
        {error ? <span className="text-accent">{error}</span> : marked}
      </pre>
    </Shell>
  );
}
