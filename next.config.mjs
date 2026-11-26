/** @type {import('next').NextConfig} */
// Keep production builds from replacing files used by a running dev server.
const nextConfig = { reactStrictMode: true, distDir: process.env.NODE_ENV === 'production' ? '.next-prod' : '.next' };

export default nextConfig;
