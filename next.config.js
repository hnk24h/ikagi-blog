/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.ikagi.site',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
    ],
  },
}

module.exports = nextConfig
