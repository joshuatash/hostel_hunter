// Basic Service Worker for PWA Installation Support
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Allows basic online network fetching
  event.respondWith(fetch(event.request));
});