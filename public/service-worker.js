addEventListener('install', e => {
  skipWaiting()
})

// self.addEventListener('fetch', e => {
//   e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)))
// })
