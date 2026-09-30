// Minimal service worker for Commfix.
//
// Strategy: cache-first for same-origin GET requests (so repeat visits and an
// offline reload still render something), with the page falling back to a
// cached copy of "/" if a navigation request fails outright (no connection).
// This is enough to make the app installable and "offline-ish" for a
// prototype -- it is not a full offline data-sync strategy. Once the app
// talks to a real backend, API calls (e.g. /api/*) should bypass this cache
// so residents always see live report data when online.

const CACHE_NAME = "commfix-cache-v1";
const APP_SHELL = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }
  // Never cache API calls once a real backend exists.
  if (new URL(request.url).pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
    )
  );
});
