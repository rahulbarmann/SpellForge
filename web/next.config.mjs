/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.stackrlabs.xyz",
                pathname: "/**",
            },
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
