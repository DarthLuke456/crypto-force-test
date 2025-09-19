/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración estable sin romper Next.js
  // Cache buster for Vercel deployment
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://s3.tradingview.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-src 'self' https://s.tradingview.com https://*.tradingview.com https://www.youtube.com https://youtube.com https://player.vimeo.com https://vimeo.com; object-src 'none'; base-uri 'self'; form-action 'self';"
          }
        ]
      }
    ]
  },
  // Optimizaciones de performance
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['@/components', '@/hooks', '@/lib'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configuración de seguridad adicional
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
