// Lets the labor pages open with no signal. Network first so GitHub updates show up; cache is the fallback.
// Scope is this /labor/ folder only, so it never touches the BNA QA/QC pages.
const CACHE = 'ega-labor-v2';
const SHELL = ['./', 'index.html', 'board.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ega-labor') && k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = e.request.url;
  if (e.request.method !== 'GET' || u.includes('script.google') || u.includes('googleusercontent')) return; // never cache sheet data
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
