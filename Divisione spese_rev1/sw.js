const CACHE_NAME = "spese-v3";
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/icons/ripspe192.png",
  "/icons/ripspe512.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  const req = event.request;

  // HTML → network-first con gestione redirect
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req, { redirect: "follow" })
        .then(res => res)
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Static → cache-first
  event.respondWith(
    caches.match(req).then(cacheRes => cacheRes || fetch(req))
  );
});
