"use client";

import { useEffect, useState } from "react";
import Shell from "./Shell";

const ALGOS = ["SHA-256", "SHA-1", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * A real digest, computed by the browser's own crypto implementation.
 *
 * `crypto.subtle` is only exposed on a secure origin, so this quietly reports
 * that rather than rendering an empty box on http://localhost-that-is-not-
 * localhost. It also means the honest claim on this page is true by
 * construction: there is no endpoint to send the input to, the digest is
 * computed by the same machine that typed it.
 */
export default function Hash() {
  const [text, setText] = useState("the quick brown fox");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [digest, setDigest] = useState("");

  useEffect(() => {
    if (typeof crypto === "undefined" || !crypto.subtle) {
      setDigest("crypto.subtle needs a secure origin, so this box is empty here.");
      return;
    }
    let cancelled = false;
    void crypto.subtle
      .digest(algo, new TextEncoder().encode(text))
      .then((buf) => {
        if (!cancelled) setDigest(hex(buf));
      })
      .catch(() => {
        if (!cancelled) setDigest("This browser declined that algorithm.");
      });
    return () => {
      cancelled = true;
    };
  }, [text, algo]);

  return (
    <Shell
      title="Hashes"
      href="/pane/hashes"
      hint={`${digest.length === 0 ? 0 : digest.length * 4} bits, computed by this browser. Nothing was uploaded.`}
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="demo-hash-in">
          Text to hash
        </label>
        <input
          id="demo-hash-in"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="demo-input flex-1"
        />
        <label className="sr-only" htmlFor="demo-hash-algo">
          Algorithm
        </label>
        <select
          id="demo-hash-algo"
          value={algo}
          onChange={(e) => setAlgo(e.target.value as Algo)}
          className="demo-input w-[7.5rem] font-mono"
        >
          {ALGOS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <output className="demo-output block font-mono break-all" aria-live="polite">
        {digest}
      </output>
    </Shell>
  );
}
