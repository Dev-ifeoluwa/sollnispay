// import type { NextConfig } from "next";
// import path from "path";

// const nextConfig: NextConfig = {
//   /* config options here */
//     turbopack: {
//       root: path.resolve(__dirname)
//     },
// };

// export default nextConfig;






import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";
// Your NestJS backend origin
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "https://sollnispay.onrender.com";

const csp = [
  "default-src 'self'",
  // Next.js needs 'unsafe-inline' unless you adopt nonces. 'unsafe-eval' only in dev.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${API_ORIGIN}${isDev ? " ws: http://localhost:*" : ""}`,
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// const securityHeaders = [
//   { key: "Content-Security-Policy", value: csp },
//   { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
//   { key: "X-Content-Type-Options", value: "nosniff" },
//   { key: "X-Frame-Options", value: "DENY" },
//   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//   { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
// ];


const securityHeaders = [
  ...(isDev ? [] : [{ key: "Content-Security-Policy", value: csp }]),
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // ...keep the rest as they are
];



const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve(__dirname),
  },


  

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // service worker must always be re-checked so updates reach users
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;