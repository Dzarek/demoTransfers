/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
};

module.exports = nextConfig;

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   trailingSlash: true,
//   compiler: {
//     removeConsole: process.env.NODE_ENV !== "development",
//   },
// };

// const withPWA = require("next-pwa")({
//   dest: "public",
//   // disable: process.env.NODE_ENV === "development",
//   register: true,
//   scope: "/pages/",
// });

// module.exports = withPWA(nextConfig);

// self.addEventListener("push", async (event) => {
//   if (event.data) {
//     const eventData = await event.data.json();
//     showLocalNotification(
//       eventData.title,
//       eventData.body,
//       eventData.tag,
//       self.registration
//     );
//   }
// });

// const showLocalNotification = (title, body, tag, swRegistration) => {
//   swRegistration.showNotification(title, {
//     body,
//     tag,
//     icon: "logo192.png",
//   });
// };

// self.addEventListener("notificationclick", function (event) {
//   event.notification.close(); // Close the notification

//   event.waitUntil(
//     clients.matchAll({ type: "window" }).then(function (clientList) {
//       // Check if there's already an open window
//       for (var i = 0; i < clientList.length; i++) {
//         var client = clientList[i];
//         if ("focus" in client) {
//           return client.focus();
//         }
//       }
//       // If no window is open, open a new one
//       if (clients.openWindow) {
//         return clients.openWindow("https://dzarektest.pl");
//       }
//     })
//   );
// });
