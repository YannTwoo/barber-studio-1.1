const CACHE_NAME = "ad-barber-v2";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/css/style.css",
    "/manifest.json",
    "/icons/icon-192.png"
];


// Installation du service worker

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );

});



// Activation

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))

            );

        })

    );

});



// Gestion du cache

self.addEventListener("fetch", event => {


    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );


});
