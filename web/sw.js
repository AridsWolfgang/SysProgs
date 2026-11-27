// offline cache — no build step, just static
const CACHE = "sysprogs-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./design.html",
  "./lesson.html",
  "./learning-preview.html",
  "./css/tokens.css",
  "./css/components.css",
  "./css/style.css",
  "./css/lesson.css",
  "./js/app.js",
  "./js/interactive.js",
  "./js/lesson-renderer.js",
  "./data/lessons.json",
  "./data/modules.json",
  "./manifest.json",
  "./assets/diagrams/00-syscall-layers.svg",
  "./assets/diagrams/01-memory-hierarchy-interactive.svg",
  "./assets/diagrams/02-stack-frame-interactive.svg"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=> k!==CACHE).map(k=> caches.delete(k)))).then(()=> self.clients.claim()));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(()=>caches.match("./index.html"))));
});
