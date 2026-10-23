/* Sollnis Pay service worker
 * RULES (fintech safe):
 *  - Only the static app shell is cached.
 *  - HTML pages, API calls, and anything with user data are NEVER cached.
 *  - Cross-origin requests (your Render backend, Paystack, etc.) are never touched.
 *  - Bump VERSION on each deploy that changes the offline page or icons.
 */
const VERSION = 'v1'
const STATIC_CACHE = `sollnis-static-${VERSION}`
const PRECACHE = ['/offline', '/icons/favicon.ico', '/icons/favicon.ico']

// self.addEventListener('install', (event) => {
//   event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)))
//   // Do NOT call skipWaiting() here; we let the user choose when to update.
// })

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.allSettled([...new Set(PRECACHE)].map((url) => cache.add(url)))
    )
  )
})


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
  if (event.data === 'CLEAR_CACHES') {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))))
  }
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // 1. Never touch non-GET (POST payments, transfers, etc.) or cross-origin (backend API)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  // 2. Never touch Next.js API routes or anything auth/user related
  if (url.pathname.startsWith('/api')) return

  // 3. Page navigations: network only. If offline, show the offline page. HTML is never stored.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/offline')))
    return
  }

  // 4. Immutable hashed build assets and icons: cache-first (safe, contain no user data)
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone()
              caches.open(STATIC_CACHE).then((c) => c.put(req, copy))
            }
            return res
          })
      )
    )
  }
  // Everything else: default browser behaviour (network).
})