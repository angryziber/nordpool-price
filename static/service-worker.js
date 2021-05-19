self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('nordpool').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/css/global.css',
      '/css/common.js',
      '/countries.js',
    ])),
  )
})

self.addEventListener('fetch', e => {
  console.log(e.request.url)
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)))
})
