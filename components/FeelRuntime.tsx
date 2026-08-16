"use client";

import { useEffect } from "react";
import { initFeel } from "@/lib/feel";

/**
 * Mounts the site's one interaction listener. Rendered once, in the root
 * layout, so every route has feedback without importing anything.
 *
 * Nothing is rendered. The visual half of the feel is pure CSS driven by the
 * `data-feel-*` attributes on `<html>`, which the inline boot script already
 * stamped before this component existed.
 */
export default function FeelRuntime() {
  useEffect(() => initFeel(), []);
  return null;
}
