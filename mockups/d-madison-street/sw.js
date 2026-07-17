/* Offline shell — stale-while-revalidate for same-origin GETs, so the
   menu, hours and phone number keep working in a Fort Campbell dead
   zone or on I-24. Nothing transactional is cached logic: Square pages
   are cross-origin and always hit the network. */
const CACHE = 'smallcakes-v1'; // bump to invalidate after big releases

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(hit => {
        const net = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => hit);
        return hit || net;      // instant repeat visits; network refreshes behind
      })
    )
  );
});
