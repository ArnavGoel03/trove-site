// Trove suite site service worker.
//
// Dependency-free (no serwist/workbox): a small, auditable fetch handler.
// Strategy:
//   - Navigations (HTML documents): network-first, so a returning visitor
//     never sees stale content when online. Falls back to the cache, then
//     to /offline.html, when the network is unavailable.
//   - Immutable static assets (/_next/static/, /icons/, images): cache-first
//     with stale-while-revalidate, serve instantly from cache and refresh
//     the cache in the background.
//   - Everything else (cross-origin, non-GET, /api/*) is left alone: the
//     browser handles it normally.
//
// Bump CACHE_NAME on any change to the strategy below so old caches are
// dropped on activate.
const CACHE_NAME = "quiver-v1";
const APP_SHELL = ["/", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isImmutableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:png|jpg|jpeg|svg|webp|avif|gif|ico)$/.test(url.pathname)
  );
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await cache.match("/offline.html");
    if (offline) return offline;
    throw new Error("network-first: no cache and no offline fallback");
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only ever handle same-origin GET requests. Never intercept mutations,
  // cross-origin calls (e.g. api.github.com), or /api routes.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isImmutableAsset(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
