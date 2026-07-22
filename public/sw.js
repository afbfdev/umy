/* Service Worker UMY — cache maîtrisé pour un site e-commerce dynamique. */
const CACHE = "umy-cache-v1";
const PRECACHE = ["/", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // On ne gère que le GET, même origine.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Jamais de cache pour l'admin, les API, l'authentification : toujours le réseau.
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return;

  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/uploads") ||
    url.pathname.startsWith("/icons") ||
    /\.(?:png|jpe?g|webp|gif|svg|ico|woff2?)$/.test(url.pathname);

  // Assets versionnés/immuables → cache d'abord.
  if (isStatic) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const res = await fetch(request);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          return cached || Response.error();
        }
      }),
    );
    return;
  }

  // Pages (navigations) → réseau d'abord, repli cache puis page hors-ligne.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          const cache = await caches.open(CACHE);
          cache.put(request, res.clone());
          return res;
        } catch {
          const cache = await caches.open(CACHE);
          return (
            (await cache.match(request)) ||
            (await cache.match("/offline")) ||
            Response.error()
          );
        }
      })(),
    );
  }
});
