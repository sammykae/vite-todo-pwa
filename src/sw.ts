import {
  NavigationRoute,
  registerRoute,
  Route,
  setDefaultHandler,
} from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { BroadcastUpdatePlugin } from "workbox-broadcast-update";
import { offlineFallback } from "workbox-recipes";
import { ExpirationPlugin } from "workbox-expiration";
import { HTTPMethod } from "workbox-routing/utils/constants";

declare let self: ServiceWorkerGlobalScope;

// Cleanup outdated caches
cleanupOutdatedCaches();

// Precache files
precacheAndRoute([
  ...self.__WB_MANIFEST,
  { url: "/offline.html", revision: "1" }, // Explicitly precache offline fallback
]);

// Skip waiting to activate new service worker immediately
self.skipWaiting();

// Helper function to check if a URL matches the base API URL
const isApiUrl = (url: string) => url.includes(import.meta.env.VITE_BASE_URL);

// Background Sync Plugin for critical requests
const bgSyncPlugin = new BackgroundSyncPlugin("backgroundSyncQueue", {
  maxRetentionTime: 24 * 60, // Retry for 24 hours
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request.clone());
        console.log("Sync successful:", entry.request.url);
      } catch (error) {
        console.error("Sync failed, adding back to queue:", entry.request.url);
        await queue.unshiftRequest(entry); // Put the request back in the queue
        throw error; // Stop processing if one request fails
      }
    }
  },
});

// Cache API GET requests
registerRoute(
  new Route(
    ({ request }) => request.method === "GET" && isApiUrl(request.url),
    new NetworkFirst({
      cacheName: "api/fetch-tasks",
      plugins: [
        new BroadcastUpdatePlugin(),
        new ExpirationPlugin({
          maxEntries: 1000, // Cache up to 1000 API responses
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for one week
        }),
      ],
    })
  )
);

// Cache Images
registerRoute(
  new Route(
    ({ request }) => request.destination === "image",
    new CacheFirst({
      cacheName: "images",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100, // Cache up to 100 images
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for one week
        }),
      ],
    })
  )
);

// Cache Audios
registerRoute(
  new Route(
    ({ request }) => request.destination === "audio",
    new CacheFirst({
      cacheName: "audios",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100, // Limit to 100 audio files
          maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for one week
        }),
      ],
    })
  )
);

// Cache navigation requests
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: "navigation",
      networkTimeoutSeconds: 3,
    })
  )
);

// Background Sync for POST, PUT, PATCH, DELETE requests
["POST", "PUT", "PATCH", "DELETE"].forEach((method) => {
  registerRoute(
    new Route(
      ({ request }) => isApiUrl(request.url),
      new NetworkOnly({
        plugins: [bgSyncPlugin],
      }),
      method as HTTPMethod
    )
  );
});

// Broadcast updates for all API requests
registerRoute(
  new Route(
    ({ request }) => isApiUrl(request.url),
    new NetworkFirst({
      cacheName: "api-cache",
      plugins: [new BroadcastUpdatePlugin()],
    })
  )
);

setDefaultHandler(new NetworkOnly());

// Offline fallback
offlineFallback({
  pageFallback: "/offline.html",
});

// Debugging: Log fetch requests during development
self.addEventListener("fetch", (event) => {
  console.log(`Fetching: ${event.request.url}`);
});
