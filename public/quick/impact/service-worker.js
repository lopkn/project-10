// const CACHE_NAME = 'impact-pwa-v4'+ Date.now();
// const ASSETS = [
//   './',
//   './index.html',
//   './sketch.js',
//   './tests.js',
//   './manifest.json',
//   './sprites.js',
//   '../../images/impact.png'
// ];

// self.addEventListener('install', (event) => {
//   self.console.log("INSTALL")
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => cache.addAll(ASSETS))
//       .then(() => self.skipWaiting())
//   );
// });

// self.addEventListener('activate', (event) => {
//   self.console.log("REPLACEMENT?")
//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys.filter((key) => key !== CACHE_NAME)
//           .map((key) => caches.delete(key))
//       )
//     ).then(() => self.clients.claim())
//   );
// });


// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);

//   if (event.request.method !== 'GET' ||
//       !(url.protocol === 'http:' || url.protocol === 'https:') ||
//       url.origin !== self.location.origin) {
//     return event.respondWith(fetch(event.request));
//   }

//   event.respondWith(
//     fetch(event.request)
//       .then((response) => {
//         if (!response || response.status !== 200 || response.type !== 'basic') {
//           return response;
//         }
//         const copy = response.clone();
//         caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, copy);
//         });
//         return response;
//       })
//       .catch(() => caches.match(event.request))
//   );
// });



const CACHE_NAME = 'impact-pwa-v4'; // Static name is fine now
const ASSETS = [
  './',
  './index.html',
  './sketch.js',
  './tests.js',
  './manifest.json',
  './sprites.js',
  '../../images/impact.png'
];

// 1. Install and cache the initial assets
self.addEventListener('install', (event) => {
  console.log("INSTALL")
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 2. Clean up old caches
self.addEventListener('activate', (event) => {
  console.log("REPLACEMENT?")
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 3. ALWAYS pull from network, update cache, and fallback to cache ONLY if offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET, non-http, or cross-origin requests
  if (event.request.method !== 'GET' ||
      !(url.protocol === 'http:' || url.protocol === 'https:') ||
      url.origin !== self.location.origin) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If network request fails or is a bad response, just return it
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Network succeeded: clone it, update the cache in the background, and return network copy
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
          console.log("SAVED")
        });
        return response;
      })
      .catch(() => {
        // REGARDLESS OF WHATEVER: If network fails (offline), fallback to cache
        return caches.match(event.request);
      })
  );
});