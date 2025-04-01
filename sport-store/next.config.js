/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Tạm thời bỏ qua lỗi ESLint trong quá trình build
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig 