const CACHE_NAME = 'impact-pwa-v3'+ Date.now();
const ASSETS = [
  './',
  './index.html',
  './sketch.js',
  './tests.js',
  './manifest.json',
  './sprites.js',
  '../../images/impact.png'
];

self.addEventListener('install', (event) => {
  self.console.log("INSTALL")
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  self.console.log("REPLACEMENT?")
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET' ||
      !(url.protocol === 'http:' || url.protocol === 'https:') ||
      url.origin !== self.location.origin) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
