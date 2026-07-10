"use client";

import { useEffect } from "react";

// Registers /sw.js (see public/sw.js) so the site works offline and
// return visits paint from cache first. Production-only: a dev-server
// service worker would intercept HMR/RSC requests and serve stale
// bundles, so this is a no-op outside NODE_ENV === "production".
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Progressive enhancement only: never block the app if this fails.
    });
  }, []);

  return null;
}
