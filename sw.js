/* PopSpell's service worker: keeps the pupil app working with a poor or no connection.
   - Files stamped with ?v= (every script and stylesheet the pages load, see tools/build.mjs) never
     change at that address, so they come from the cache first. When a new stamp is cached, older
     copies of the same file are deleted, so the cache never grows stale or large.
   - Everything else of PopSpell's own (pages, pictures, recordings) comes from the network first,
     with the cached copy kept for when there's no connection.
   - Other sites (Firebase, Google Fonts, Google sign-in) are left to the browser: nothing about
     pupils or teachers is ever stored here. */
const CACHE = "popspell";

// On install, keep the pupil app's page and every file it loads (not the teacher area's scripts,
// which are in a <template> and load only when the teacher area opens), so the first visit already
// works offline afterwards.
self.addEventListener("install", event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch("./", { cache: "no-store" });
    if (!res.ok) return;
    const html = await res.clone().text();
    await cache.put("./", res);
    const pupilHTML = html.replace(/<template[\s\S]*?<\/template>/g, "");
    const files = [...pupilHTML.matchAll(/(?:src|href)="([^"?#:]+\?v=[0-9a-f]+)"/g)].map(m => m[1]);
    await Promise.all(files.map(f => cache.match(f).then(hit => hit || cache.add(f)).catch(() => {})));
  } catch { /* offline while installing: files are cached as they're used instead */ }
  await self.skipWaiting();
})()));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // The update check (./?version=…) must always ask the server
  if (url.searchParams.has("version")) return;
  event.respondWith(url.searchParams.has("v") ? stampedFirst(req, url) : networkFirst(req));
});

async function stampedFirst(req, url) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) {
    // Drop older stamps of the same file, then keep this one
    for (const old of await cache.keys()) {
      const u = new URL(old.url);
      if (u.pathname === url.pathname && u.search !== url.search) await cache.delete(old);
    }
    await cache.put(req, res.clone());
  }
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok && res.type === "basic") await cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: req.mode === "navigate" });
    if (hit) return hit;
    // A page opened offline for the first time: the app's own page, if it's been cached
    if (req.mode === "navigate") { const home = await cache.match("./", { ignoreSearch: true }); if (home) return home; }
    throw err;
  }
}
