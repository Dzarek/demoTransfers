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
});

module.exports = withPWA(nextConfig);
