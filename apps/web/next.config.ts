import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.carnival.com" },
      { protocol: "https", hostname: "www.ncl.com" },
      { protocol: "https", hostname: "www.virginvoyages.com" },
      { protocol: "https", hostname: "www.royalcaribbean.com" },
      { protocol: "https", hostname: "www.msccruisesusa.com" },
      { protocol: "https", hostname: "www.princess.com" },
      { protocol: "https", hostname: "www.hollandamerica.com" },
      { protocol: "https", hostname: "www.celebritycruises.com" },
      { protocol: "https", hostname: "disneycruise.disney.go.com" },
      { protocol: "https", hostname: "cdn1.parksmedia.wdprapps.disney.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "hare-media-cdn.tripadvisor.com" },
      { protocol: "https", hostname: "media.tacdn.com" },
    ],
  },
  // Trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
