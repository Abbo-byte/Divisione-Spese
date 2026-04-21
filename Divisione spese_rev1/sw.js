const CACHE_NAME = "spese-static-v1";
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/icons/ripspe192.png",
  "/icons/ripspe512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;

  // ❗ Non tocchiamo le navigazioni HTML
  if (req.mode === "navigate") {
    return; // lascia che sia il browser a gestire tutto
  }

  // Cache-first solo per asset statici
  event.respondWith(
    caches.match(req).then(cacheRes => cacheRes || fetch(req))
  );
});
