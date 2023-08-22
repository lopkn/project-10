

let cacheName = [
        './',
        './index.html',
        './sketch.js',
        './tone.js',
        './game.js',
        './manifest.json'
      ]
const version = Date.now()
self.addEventListener('install', function(event) {
  console.log("INSTALL")
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      // Delete all existing caches
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(()=>{

      caches.open('my-cache').then(function(cache) {
      return cache.addAll(cacheName);
    }).then(() => {
      self.skipWaiting(); 
    })


    })
    
  );
});
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       if (response) {
//         return response;
//       }

//       return fetch(event.request).then(function(networkResponse) {
//         if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
//           return networkResponse;
//         }

//         var responseToCache = networkResponse.clone();

//         caches.open('my-cache').then(function(cache) {
//           cache.put(event.request, responseToCache);
//         });

//         return networkResponse;
//       }).catch(function(error) {
//         console.error('Fetch error:', error);
//         throw error;
//       });
//     })
//   );
// });



self.addEventListener('fetch', event => {
  console.log("ver:"+version)
  // console.log(event.request)
  let re = Math.random()
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If the response is valid, clone it and update the cache
        if (response.status === 200) {
          const clonedResponse = response.clone();

          // caches.open('my-cache').then(cache => cache.put(event.request, clonedResponse));


          // let matchFound = false;

          //   for (let i = 0; i < cacheName.length; i++) {
          //     if (event.request.url.includes(cacheName[i])) {
          //       console.log(cacheName[i])
          //       matchFound = true;
          //       break;
          //     }
          //   }


          caches.match(event.request.url).then((mf)=>{if (mf!== undefined) {
                console.log(event.request.url)
                caches.open('my-cache').then(cache => {cache.put(event.request, clonedResponse)});
            } else {
               // console.log("nosave: "+event.request.url)
            }
          })

          // caches.open('my-cache').then(cache => {
          //   if (cacheName.includes(event.request.url)) {
          //     cache.put(event.request, clonedResponse);
          //   }
          // })

          // .then(caches.open('my-cache').then(function(cachee) {
          // cachee.match('./sketch.js').then(function(response2) {
          //   if (response2) {
          //   response2.text().then(function(html4) {
          //   console.log(html4);})}})}))

          // if (event.request.url.includes('sketch.js')) {
          //   response.text().then(html => {
          //     console.log(html);
          //   });
          // }

          self.console.log('Loading new stuff: '+response);

          return response;
        } else {
          self.console.log('Serving from cache'+re);
          // debugger;
          return caches.open('my-cache').then(caches => {return(caches.match(event.request))})
          // return caches.match(event.request);
        }
      })
      .catch(() => {
          self.console.log('Serving from cache'+re);
        // Fetch failed, try to retrieve from cache
          // debugger;
          return caches.open('my-cache').then(caches => {return(caches.match(event.request))})
        // return caches.match(event.request);
      })
      .then(response => {
        if (response) {
          // self.console.log('Serving from cache'+re);
          // self.console.log(response,event.request);
          return response;
        }
          console.log('??'+re);

        // If not found in cache, return a fallback response
        // return new Response('Offline Page');
          throw(new Error("dog"+event.request.url))
      })
  );
});


// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.map(function(cacheName) {
//           if (cacheName !== 'my-cache') {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

self.addEventListener('activate', event => {
  self.console.log("REPLACEMENT?")
  // debugger;
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
      return caches.open('my-cache');
    })
    .then(cache => {
      return cache.addAll(cacheName);
    })
  );
});

console.log("hello?")

// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           // Delete old caches if necessary
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });










