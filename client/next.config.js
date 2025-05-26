/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, content-type, Authorization",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://*.safe.global https://*.gnosis-safe.io",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/manifest.json",
        destination: "/manifest.json",
      },
      {
        source: "/safe-app.json",
        destination: "/safe-app.json",
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
};

module.exports = nextConfig;
