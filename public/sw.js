const CACHE_VERSION  = "sp-v1"
const STATIC_CACHE   = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE  = `${CACHE_VERSION}-dynamic`

// Resources to precache on install
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/scholarships",
  "/manifest.json",
]

// ── Install: precache shell ───────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

// ── Activate: clean old caches ────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith("sp-") && k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ── Fetch: routing strategies ─────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== location.origin) return

  // API routes — Network Only (never cache auth/data)
  if (url.pathname.startsWith("/api/")) return

  // Supabase — Network Only
  if (url.hostname.includes("supabase.co")) return

  // Static assets — Cache First
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.match(/\.(png|jpg|svg|ico|woff2|css)$/)
  ) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached ?? fetch(request).then(res => {
          const clone = res.clone()
          caches.open(STATIC_CACHE).then(c => c.put(request, clone))
          return res
        })
      )
    )
    return
  }

  // Scholarship list — Stale While Revalidate
  if (url.pathname === "/scholarships") {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(async cache => {
        const cached  = await cache.match(request)
        const fetchPromise = fetch(request).then(res => {
          cache.put(request, res.clone())
          return res
        }).catch(() => cached ?? caches.match("/offline"))

        return cached ?? fetchPromise
      })
    )
    return
  }

  // All other pages — Network First, offline fallback
  event.respondWith(
    fetch(request)
      .then(res => {
        const clone = res.clone()
        caches.open(DYNAMIC_CACHE).then(c => c.put(request, clone))
        return res
      })
      .catch(async () => {
        const cached = await caches.match(request)
        return cached ?? caches.match("/offline")
      })
  )
})

