"use client";

import { useMemo, useState } from "react";
import Shell from "./Shell";

/**
 * Everything is converted through one base unit per family, which is why there
 * is no table of pairs here and why adding a unit is one line rather than
 * fourteen. Temperature is the exception every converter has to special-case:
 * Celsius to Fahrenheit is affine, not a scale, so a factor cannot express it.
 */
interface Unit {
  readonly id: string;
  readonly label: string;
  /** Multiplier to the family's base unit. Unused by temperature. */
  readonly factor: number;
}

interface Family {
  readonly id: string;
  readonly label: string;
  readonly units: readonly Unit[];
  readonly affine?: boolean;
}

const FAMILIES: readonly Family[] = [
  {
    id: "data",
    label: "Data",
    units: [
      { id: "B", label: "bytes", factor: 1 },
      { id: "KiB", label: "KiB", factor: 1024 },
      { id: "MiB", label: "MiB", factor: 1024 ** 2 },
      { id: "GiB", label: "GiB", factor: 1024 ** 3 },
      { id: "GB", label: "GB (decimal)", factor: 1e9 },
      { id: "TB", label: "TB (decimal)", factor: 1e12 },
    ],
  },
  {
    id: "length",
    label: "Length",
    units: [
      { id: "mm", label: "mm", factor: 0.001 },
      { id: "cm", label: "cm", factor: 0.01 },
      { id: "m", label: "m", factor: 1 },
      { id: "km", label: "km", factor: 1000 },
      { id: "in", label: "inches", factor: 0.0254 },
      { id: "ft", label: "feet", factor: 0.3048 },
      { id: "mi", label: "miles", factor: 1609.344 },
    ],
  },
  {
    id: "temp",
    label: "Temperature",
    affine: true,
    units: [
      { id: "C", label: "Celsius", factor: 1 },
      { id: "F", label: "Fahrenheit", factor: 1 },
      { id: "K", label: "Kelvin", factor: 1 },
    ],
  },
];

function toCelsius(value: number, from: string): number {
  if (from === "F") return (value - 32) * (5 / 9);
  if (from === "K") return value - 273.15;
  return value;
}

function fromCelsius(celsius: number, to: string): number {
  if (to === "F") return celsius * (9 / 5) + 32;
  if (to === "K") return celsius + 273.15;
  return celsius;
}

/** Six significant figures, then trailing zeros trimmed. */
function tidy(n: number): string {
  if (!Number.isFinite(n)) return "not a number";
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e12)) return n.toExponential(4);
  return String(Number(n.toPrecision(8)));
}

export default function Units() {
  const [familyId, setFamilyId] = useState(FAMILIES[0].id);
  const [raw, setRaw] = useState("1");
  const [fromId, setFromId] = useState("GiB");
  const [toId, setToId] = useState("GB");

  const family = FAMILIES.find((f) => f.id === familyId) ?? FAMILIES[0];

  const result = useMemo(() => {
    const value = Number(raw);
    if (raw.trim() === "" || Number.isNaN(value)) return null;
    const from = family.units.find((u) => u.id === fromId) ?? family.units[0];
    const to = family.units.find((u) => u.id === toId) ?? family.units[1] ?? family.units[0];
    if (family.affine) return fromCelsius(toCelsius(value, from.id), to.id);
    return (value * from.factor) / to.factor;
  }, [raw, family, fromId, toId]);

  function switchFamily(id: string) {
    const next = FAMILIES.find((f) => f.id === id) ?? FAMILIES[0];
    setFamilyId(id);
    setFromId(next.units[0].id);
    setToId(next.units[1]?.id ?? next.units[0].id);
  }

  return (
    <Shell
      title="Units"
      href="/pane/units"
      hint="A gibibyte is not a gigabyte, which is why your 1 TB drive shows up as 931 GB."
    >
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="demo-units-family">
          Family
        </label>
        <select
          id="demo-units-family"
          value={familyId}
          onChange={(e) => switchFamily(e.target.value)}
          className="demo-input w-auto"
        >
          {FAMILIES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="demo-units-value">
          Value
        </label>
        <input
          id="demo-units-value"
          value={raw}
          inputMode="decimal"
          onChange={(e) => setRaw(e.target.value)}
          className="demo-input w-24 font-mono"
        />

        <label className="sr-only" htmlFor="demo-units-from">
          From
        </label>
        <select
          id="demo-units-from"
          value={fromId}
          onChange={(e) => setFromId(e.target.value)}
          className="demo-input w-auto"
        >
          {family.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="demo-units-to">
          To
        </label>
        <select
          id="demo-units-to"
          value={toId}
          onChange={(e) => setToId(e.target.value)}
          className="demo-input w-auto"
        >
          {family.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <output className="demo-output block font-mono" aria-live="polite">
        {result === null ? "Type a number." : tidy(result)}
      </output>
    </Shell>
  );
}
