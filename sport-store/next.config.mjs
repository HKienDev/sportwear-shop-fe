const nextConfig = {
  reactStrictMode: false, // Tắt strict mode để tránh gọi API nhiều lần
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Cho phép tất cả domain (hoặc thay ** bằng "loremflickr.com" nếu chỉ dùng domain đó)
      },
    ],
  },
};

export default nextConfig;
