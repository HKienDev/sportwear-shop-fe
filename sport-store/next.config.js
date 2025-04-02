/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Tạm thời bỏ qua lỗi ESLint trong quá trình build
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['upload.wikimedia.org', 'localhost', 'res.cloudinary.com'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/uploads/**',
            },
        ],
    },
    // Thêm cấu hình để tối ưu hiệu suất
    reactStrictMode: true,
    // Thêm cấu hình để xử lý các file static
    poweredByHeader: false,
    compress: true,
    // Thêm cấu hình để xử lý các route
    async redirects() {
        return [
            {
                source: '/',
                destination: '/user',
                permanent: true,
            },
        ];
    },
}

module.exports = nextConfig 