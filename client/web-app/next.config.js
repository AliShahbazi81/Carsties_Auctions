/** @type {import('next').NextConfig} */
const nextConfig = {
    // In order to show images from strange source, we have to configure next.js
    // to allow it.
    images: {
        domains: ['cdn.pixabay.com'],
    },
}

module.exports = nextConfig
