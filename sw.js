const CACHE_NAME = "outlook-travel-pwa-v1";
const APP_SHELL = ["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install", event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  const req = event.request; if (req.method !== "GET") return;
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(fetch(req).then(r => { const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return r; }).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html")))); return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(r => { if(r.ok && new URL(req.url).origin===location.origin){const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy));} return r; })));
});
