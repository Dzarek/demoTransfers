// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   trailingSlash: true,
// };

// module.exports = nextConfig;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/pages/",
});

module.exports = withPWA(nextConfig);

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
