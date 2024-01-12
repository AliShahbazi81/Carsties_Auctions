/** @type {import('next').NextConfig} */
const nextConfig = {
    // In order to show images from strange source, we have to configure next.js
    images: {
        domains: [
            "cdn.pixabay.com"
        ]
    }
}

module.exports = nextConfig
