const fallbackNotification = {
  body: "New Federal Reserve reverse repo data is available.",
  title: "New Fed Reverse Repo Data",
  url: "/dashboard",
};

self.addEventListener("push", (event) => {
  let notification = fallbackNotification;

  try {
    notification = { ...fallbackNotification, ...event.data?.json() };
  } catch {
    // A visible fallback notification is preferable to losing the alert.
  }

  event.waitUntil(
    self.registration.showNotification(notification.title, {
      badge: "/icon-16.png",
      body: notification.body,
      data: { url: notification.url },
      icon: "/icon-128.png",
      tag: notification.tag,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = new URL(
    event.notification.data?.url ?? "/dashboard",
    self.location.origin,
  ).href;

  event.waitUntil(
    clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then((windows) => {
        const existing = windows.find(
          (windowClient) => windowClient.url === destination,
        );
        return existing ? existing.focus() : clients.openWindow(destination);
      }),
  );
});
