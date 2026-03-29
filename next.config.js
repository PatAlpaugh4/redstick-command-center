/**
 * Next.js Configuration
 * =====================
 * Optimized configuration for production performance including:
 * - Image optimization (WebP/AVIF formats)
 * - Package import optimization for heavy libraries
 * - Console removal in production
 * - Bundle analyzer integration
 * - Compression and caching headers
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // =============================================================================
  // Image Optimization
  // =============================================================================
  images: {
    // Modern formats for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
      // Add your own image domains here
    ],
    
    // Minimum cache TTL (1 day)
    minimumCacheTTL: 86400,
    
    // Enable sharp optimization
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // =============================================================================
  // Experimental Features
  // =============================================================================
  experimental: {
    // Optimize imports for heavy libraries - reduces initial bundle size
    // by only importing used components
    optimizePackageImports: [
      'lucide-react',      // Icon library - only imports used icons
      'recharts',          // Charting library - heavy, tree-shake
      '@dnd-kit/core',     // Drag and drop - browser-only
      '@dnd-kit/sortable', // Drag and drop sortable
      '@dnd-kit/utilities',// Drag and drop utilities
      'framer-motion',     // Animation library
      'date-fns',          // Date utilities
      'lodash',            // Utility library (if used)
    ],
    
    // Turbopack optimizations (when using --turbo)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    
    // Server Actions (stable in Next.js 14+)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // =============================================================================
  // Compiler Options
  // =============================================================================
  compiler: {
    // Remove console.log in production builds
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
    
    // Styled Components support (if using)
    styledComponents: false,
  },

  // =============================================================================
  // Webpack Configuration
  // =============================================================================
  webpack: (config, { dev, isServer, nextRuntime }) => {
    // Bundle analyzer in analyze mode
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
    }

    // Optimize SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Tree-shaking for lodash (if used)
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash-es': 'lodash',
    };

    return config;
  },

  // =============================================================================
  // HTTP Headers & Caching
  // =============================================================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },

  // =============================================================================
  // Redirects & Rewrites
  // =============================================================================
  async redirects() {
    return [
      // Redirect www to non-www (or vice versa)
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'www.example.com' }],
      //   destination: 'https://example.com/:path*',
      //   permanent: true,
      // },
    ];
  },

  // =============================================================================
  // Build Configuration
  // =============================================================================
  // Output directory for static export (if needed)
  // distDir: 'dist',
  
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Powered by header (disable for security)
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Production source maps (disable for smaller builds)
  productionBrowserSourceMaps: false,
  
  // Trailing slashes
  trailingSlash: false,
  
  // i18n configuration (if needed)
  // i18n: {
  //   locales: ['en', 'es', 'fr'],
  //   defaultLocale: 'en',
  // },
};

module.exports = nextConfig;
