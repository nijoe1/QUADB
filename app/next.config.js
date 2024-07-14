/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  // output: "export",
  images: {
    // domains: ["gateway.lighthouse.storage"],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        net: false,
        tls: false,
      },
    };
    return config;
  },
};
