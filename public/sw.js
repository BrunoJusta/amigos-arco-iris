// Service worker: a app funciona sem internet depois da primeira visita.
const VERSAO = 'amigos-v1';
const BASE = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin') || url.pathname.startsWith('/api/auth')) return;
  if (req.headers.get('range')) return;

  // Páginas e conteúdo: tenta a rede primeiro, usa a cópia guardada se não houver internet.
  if (req.mode === 'navigate' || url.pathname === '/api/conteudo') {
    e.respondWith(fetch(req).then((r) => { const copia = r.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); return r; }).catch(() => caches.match(req).then((r) => r || caches.match('/'))));
    return;
  }
  // Ficheiros estáticos, imagens e media: usa a cópia guardada e atualiza em segundo plano.
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/personagens/') || url.pathname.startsWith('/api/media/') || /\.(png|jpg|jpeg|webp|svg|woff2?)$/.test(url.pathname)) {
    e.respondWith(caches.open(VERSAO).then((c) => c.match(req).then((guardado) => {
      const rede = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => guardado);
      return guardado || rede;
    })));
  }
});
