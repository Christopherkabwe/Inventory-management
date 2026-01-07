/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        turbopack: {
            root: __dirname,
        },
    },
};

module.exports = nextConfig;
