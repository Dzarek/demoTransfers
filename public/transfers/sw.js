self.addEventListener("push", async (event) => {
  if (event.data) {
    const eventData = await event.data.json();
    // if (eventData.isAdmin) {
    showLocalNotification(
      eventData.title,
      eventData.body,
      eventData.tag,
      self.registration
    );
    // }
  }
});

const showLocalNotification = (title, body, tag, swRegistration) => {
  swRegistration.showNotification(title, {
    body,
    tag,
    icon: "./logo192.png",
  });
};

self.addEventListener("notificationclick", function (event) {
  const url = "https://dzarektest.pl/";
  event.notification.close(); // Close the notification

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
