/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dsgw7pbcfhqe1.cloudfront.net',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
