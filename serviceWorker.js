const CACHE_NAME = "static-website-v1";
const urlsToCache = [
  "/index.html",
  "images/logo.png",
  "styles.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css",
  "/manifest.webmanifest",
  "/images/bikeImage.jpg",
  "/images/background18.jpg",
  "/images/background4.jpg",
  "/images/books.jpg",
  "/images/glasswithflower.jpg",
  "/images/naturalmaterials.jpg",
  "/images/woodendishes.jpg",
  "/images/favicon.ico",
  "/images/android-chrome-192x192.png",

];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response; // Return the cached response if available
        }
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              // Clone the response as it can only be consumed once
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
              return networkResponse;
            }
            return networkResponse;
          })
          .catch(() => {
            // Handle offline scenario here
            return caches.match("/index.html"); // Return the cached index.html page
          });
      })
      .catch((error) => {
        console.error("Error matching request in cache:", error);
      })
  );
});

this.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
