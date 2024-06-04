import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Aply to all routes
        source: "/(.*)",
        headers: [
          /* {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; img-src 'self' https: data:; media-src 'self'",
          }, */
          /* {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          }, 
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          }, */
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
