/* Offline-first service worker (precache everything important) */
const CACHE_NAME = "dr-ahlam-prices-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./assets/logo.png",
  "./assets/slider/1.jpg",
  "./assets/slider/2.jpg",
  "./assets/slider/3.jpg",
  "./assets/slider/4.jpg",
  "./assets/slider/5.jpg",
  "./assets/slider/6.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // Cache same-origin responses
          const url = new URL(req.url);
          if (url.origin === self.location.origin && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => {
          // fallback to index for navigation (single-page-ish)
          if (req.mode === "navigate") return caches.match("./index.html");
          return cached;
        });
    })
  );
});
