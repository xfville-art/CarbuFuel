const CACHE_NAME = 'carbufuel-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  // Liste des logos locaux à mettre en cache
  './assets/logos/total.png',
  './assets/logos/leclerc.png',
  './assets/logos/carrefour.png',
  './assets/logos/intermarche.png',
  './assets/logos/systemeu.png',
  './assets/logos/auchan.png',
  './assets/logos/esso.png',
  './assets/logos/bp.png',
  './assets/logos/shell.png',
  './assets/logos/casino.png',
  './assets/logos/netto.png',
  './assets/logos/avia.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Nettoyage de l'ancien cache lors de la mise à jour
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});
