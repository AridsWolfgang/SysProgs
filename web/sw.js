// offline cache — no build step, just static
const CACHE = "sysprogs-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./design.html",
  "./css/tokens.css",
  "./css/components.css",
  "./css/style.css",
  "./js/app.js",
  "./js/lesson-renderer.js",
  "./css/lesson.css",
  "./lesson.html",
  "./data/lessons.json",
  "./data/modules.json",
  "./manifest.json",
  "./assets/diagrams/00-syscall-layers.svg"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(()=>caches.match("./index.html"))));
});
