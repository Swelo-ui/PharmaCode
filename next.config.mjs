/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    poweredByHeader: false,
    compress: true,
    images: {
        formats: ["image/avif", "image/webp"],
    },
};

export default nextConfig;
