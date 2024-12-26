import { NavigationRoute, registerRoute, Route } from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

// Cache API calls
const fetchTaskRoute = new Route(
  ({ request }) => {
    return request.url === import.meta.env.VITE_BASE_URL;
  },
  new NetworkFirst({
    cacheName: "api/fetch-tasks",
  })
);
registerRoute(fetchTaskRoute);

// Cache Images
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "image";
  },
  new CacheFirst({
    cacheName: "images",
  })
);

registerRoute(imageRoute);

// Cache navigation routes
const navigationRoutes = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigation",
    networkTimeoutSeconds: 3,
  })
);

registerRoute(navigationRoutes);

// Background Sync for

const bgSyncPlugin = new BackgroundSyncPlugin("backgroundSyncQueue", {
  maxRetentionTime: 24 * 60,
});

// Create Task
const taskSubmit = new Route(
  ({ request }) => {
    return request.url === import.meta.env.VITE_BASE_URL;
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);
registerRoute(taskSubmit);

// Update Task
const taskUpdateSubmit = new Route(
  ({ request }) => {
    return request.url.includes(import.meta.env.VITE_BASE_URL);
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PUT"
);
registerRoute(taskUpdateSubmit);

// Update Task status
const taskUpdateStatusSubmit = new Route(
  ({ request }) => {
    return request.url.includes(import.meta.env.VITE_BASE_URL);
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PATCH"
);
registerRoute(taskUpdateStatusSubmit);

// Delete Task
const taskDeleteSubmit = new Route(
  ({ request }) => {
    return request.url.includes(import.meta.env.VITE_BASE_URL);
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "DELETE"
);
registerRoute(taskDeleteSubmit);
