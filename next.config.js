/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/webp'],
        domains: ['fpb-gallery.s3.amazonaws.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
            },
        ],
    },
}

module.exports = nextConfig
