/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Performance optimizations
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize images - PRODUCTION READY FOR 7M USERS
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Optimize in production
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
  },

  // Reduce bundle size - SCALABILITY OPTIMIZATIONS
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-hook-form', '@tanstack/react-query'],
    // Enable SWC plugins for faster compilation
    swcPlugins: [],
  },

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in prod
  poweredByHeader: false, // Remove X-Powered-By header

  // Compression
  compress: true,

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Webpack optimizations - SCALABILITY
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Minimize bundle size
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Split vendor code
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Split common code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'async',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Split React and related libraries
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              chunks: 'all',
              priority: 40,
            },
          },
        },
      };
    }

    // Dev optimizations
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },
};

export default nextConfig;
