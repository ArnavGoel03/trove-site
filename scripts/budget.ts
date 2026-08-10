// Does three.js reach the homepage's first paint?
//
// The whole scroll stage is built on a promise: the poster paints, the words
// are readable, and only then, on a machine that can use it, does a ~600KB 3D
// renderer arrive. That promise is one careless import away from being false at
// any moment, and the failure is invisible in review: the page still works, it
// just got three times heavier for every visitor including the ones on a train.
//
// So it is a build gate rather than a convention. This walks the import graph
// from the homepage's server entries, following everything except the one
// boundary that genuinely defers work, `dynamic(..., { ssr: false })`, and
// reports which packages are reachable. test/budget.test.ts fails the build if
// three is among them.
//
// A static walk rather than a bundle-size diff on purpose: a size number tells
// you something got worse, this tells you which import did it.

import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

/** Packages that must never be reachable from the homepage's server graph. */
export const HEAVY = ["three", "@react-three/fiber", "@react-three/drei"] as const;

export interface Graph {
  /** Every source file reachable without crossing an ssr:false boundary. */
  readonly files: ReadonlySet<string>;
  /** Bare package specifiers those files import. */
  readonly packages: ReadonlySet<string>;
  /** Modules held behind `dynamic(..., { ssr: false })`, and not followed. */
  readonly deferred: ReadonlySet<string>;
}

const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"];

/**
 * Static and re-export edges, anchored to the start of a line.
 *
 * The anchor is what keeps a commented-out import from counting: both `//
 * import x from "y"` and the ` * import x from "y"` inside a block comment fail
 * to match, and no string-stripping pass is needed to get there.
 */
const STATIC_IMPORT = /^\s*(?:import|export)\b[^;\n]*?from\s*["']([^"']+)["']/gm;
/** Bare side-effect imports, e.g. `import "./globals.css"`. */
const SIDE_EFFECT = /^\s*import\s*["']([^"']+)["']/gm;
/** `dynamic(() => import("x"), { ssr: false })`, with the options text captured. */
const DYNAMIC = /dynamic\(\s*\(\s*\)\s*=>\s*import\(\s*["']([^"']+)["']\s*\)\s*(,\s*\{[^}]*\})?/g;

function tryResolve(spec: string, from: string, root: string): string | null {
  const base = spec.startsWith("@/")
    ? join(root, spec.slice(2))
    : spec.startsWith(".")
      ? resolve(dirname(from), spec)
      : null;
  if (base === null) return null;

  for (const ext of EXTENSIONS) {
    const candidate = base + ext;
    try {
      readFileSync(candidate, "utf8");
      return candidate;
    } catch {
      // Not this extension. Keep trying; a specifier that resolves to nothing
      // is reported by the caller rather than swallowed here.
    }
  }
  return null;
}

/** "three/examples/x" and "@react-three/fiber" both reduce to their package. */
function packageOf(spec: string): string {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function matches(source: string, pattern: RegExp): string[] {
  const found: string[] = [];
  pattern.lastIndex = 0;
  for (const match of source.matchAll(pattern)) found.push(match[1]);
  return found;
}

/**
 * Walk from `entries`, following every import except deferred ones.
 *
 * Paths in the result are relative to `root`, so a failure message names a file
 * the way a person would.
 */
export function walk(entries: readonly string[], root: string): Graph {
  const files = new Set<string>();
  const packages = new Set<string>();
  const deferred = new Set<string>();
  const queue: string[] = [];

  for (const entry of entries) {
    const path = resolve(root, entry);
    queue.push(path);
  }

  while (queue.length > 0) {
    const path = queue.pop() as string;
    const key = relative(root, path);
    if (files.has(key)) continue;

    let source: string;
    try {
      source = readFileSync(path, "utf8");
    } catch {
      continue;
    }
    files.add(key);

    // Deferred first, so the specifier is known before the static pass sees it.
    // A `dynamic()` call reads as a plain `import()` to the static pattern.
    const deferredHere = new Set<string>();
    DYNAMIC.lastIndex = 0;
    for (const match of source.matchAll(DYNAMIC)) {
      const [, spec, options] = match;
      if (options && /ssr\s*:\s*false/.test(options)) {
        deferred.add(spec);
        deferredHere.add(spec);
      } else {
        const resolved = tryResolve(spec, path, root);
        if (resolved) queue.push(resolved);
        else if (!spec.startsWith(".") && !spec.startsWith("@/")) packages.add(packageOf(spec));
      }
    }

    for (const spec of [...matches(source, STATIC_IMPORT), ...matches(source, SIDE_EFFECT)]) {
      if (deferredHere.has(spec)) continue;
      if (spec.startsWith(".") || spec.startsWith("@/")) {
        const resolved = tryResolve(spec, path, root);
        if (resolved) queue.push(resolved);
        continue;
      }
      if (spec.startsWith("node:")) continue;
      packages.add(packageOf(spec));
    }
  }

  return { files, packages, deferred };
}
