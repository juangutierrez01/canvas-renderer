const REPOSITORY = "canvas-renderer";
const VERSION = "v3"
const URLS = [
    "/",
    "/favicon.ico",
    "/index.html",
    "/main.js",
    "/modules/camera.js",
    "/modules/model.js",
    "/modules/vector.js",
    "/style.css",
]
.map((url) => `/${REPOSITORY}${url}`)
.map((url) => new Request(url, {cache: "no-cache"}));

const STATIC_CACHE = `${REPOSITORY}_static_${VERSION}`;
const DYNAMIC_CACHE = `${REPOSITORY}_dynamic_${VERSION}`;

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) =>
            cache.addAll(URLS)
        )
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) =>
                key.startsWith(REPOSITORY)
                && key != STATIC_CACHE
                && key != DYNAMIC_CACHE
            ).map((key) =>
                caches.delete(key)
            )  
        ))
    )
});

self.addEventListener("fetch", (event) => {
    event.respondWith((async () => {
        // Case 1: return from static cache
        const staticCache = await caches.open(STATIC_CACHE);
        const staticResponse = await staticCache.match(event.request);

        if (staticResponse) {
            return staticResponse;
        }

        // Case 2: return from network and add to static cache
        const shouldBeInStaticCache = URLS.includes(event.request);

        if (shouldBeInStaticCache) {
            const updatedRequest = new Request(event.request, {cache: "no-cache"});
            const networkResponse = await fetch(updatedRequest).catch((error) =>
                new Response(error, {
                    status: 408,
                    headers: {"Content-Type": "text/plain"}
                })
            );

            if (networkResponse.ok) {
                const responseCopy = networkResponse.clone();
                event.waitUntil(
                    staticCache.put(updatedRequest, responseCopy)
                );
            }

            return networkResponse;
        }

        // Case 3: return from network, backed up by dynamic cache
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        const dynamicResponse = await dynamicCache.match(event.request);

        const networkResponse = await fetch(event.request).catch((error) =>
            dynamicResponse ?? new Response(error, {
                status: 408,
                headers: {"Content-Type": "text/plain"}
            })
        );

        if ((networkResponse.ok || networkResponse.status === 0) && networkResponse !== dynamicResponse) {
            const responseCopy = networkResponse.clone();
            event.waitUntil(
                dynamicCache.put(event.request, responseCopy)
            );
        }

        return networkResponse;
    })());
});