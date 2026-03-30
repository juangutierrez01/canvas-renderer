self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("canvas-renderer_v1").then((cache) =>
            cache.addAll([
                "/canvas-renderer/",
                "/canvas-renderer/favicon.ico",
                "/canvas-renderer/index.html",
                "/canvas-renderer/main.js",
                "/canvas-renderer/modules/camera.js",
                "/canvas-renderer/modules/model.js",
                "/canvas-renderer/modules/vector.js",
                "/canvas-renderer/style.css",
            ])
        )
    );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) =>
      response ?? fetch(event.request)
    )
  );
});