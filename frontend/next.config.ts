import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Disable strict mode to reduce double renders
  
  // Completely disable the error overlay that causes stack frames issue
  // This will only affect development mode
  webpack: (config, { isServer, dev }) => {
    // Only apply this in development mode
    if (dev && !isServer) {
      // Disable the error overlay
      config.module.rules.push({
        test: /node_modules\/next\/dist\/client\/components\/react-dev-overlay\/internal\/container/,
        loader: 'null-loader',
      });
    }
    return config;
  },
  
  // Allow API calls
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://projectshelf-93gi.onrender.com/api/:path*',
      },
      {
        source: '/portfolios/:path*',
        destination: 'https://projectshelf-93gi.onrender.com/portfolios/:path*',
      },
    ];
  },
  
  env: {
    NEXT_PUBLIC_API_URL: 'https://projectshelf-93gi.onrender.com',
  },
};

export default nextConfig;
