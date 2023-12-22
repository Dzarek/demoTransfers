self.addEventListener("push", async (event) => {
  if (event.data) {
    const eventData = await event.data.json();
    showLocalNotification(
      eventData.title,
      eventData.body,
      eventData.tag,
      self.registration
    );
  }
});

const showLocalNotification = (title, body, tag, swRegistration) => {
  swRegistration.showNotification(title, {
    body,
    tag,
    icon: "logo192.png",
  });
};
