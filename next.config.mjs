/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/doxwhwvtf/image/upload/**', // Allow all images under this path
          },
        ],
      },
};

export default nextConfig;
