"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/AdminLayout/sidebar";
import Topbar from "@/components/AdminLayout/topbar";
import Footer from "@/components/AdminLayout/footer";
import { fetchWithAuth } from "@/Lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentPath = window.location.pathname; // Lưu trữ URL hiện tại
        console.log("[DEBUG] Current Path:", currentPath);

        const response = await fetchWithAuth("http://localhost:4000/api/auth/check");

        // Kiểm tra nếu response là null hoặc undefined
        if (!response) {
          throw new Error("Không thể kết nối đến server");
        }

        // Kiểm tra nếu response không hợp lệ (status code không phải 2xx)
        if (!response.ok) {
          throw new Error("Phiên đăng nhập hết hạn");
        }

        const data = await response.json();
        console.log("✅ Người dùng đã đăng nhập:", data.user);

        // Kiểm tra vai trò người dùng
        if (data.user.role !== "admin") {
          console.warn("Người dùng không có quyền truy cập trang admin");
          router.push("/"); // Chuyển hướng về trang chủ
          return;
        }

        // Giữ nguyên trang hiện tại nếu người dùng là admin
        if (!currentPath.startsWith("/Admin")) {
          router.push("/Admin");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
        router.push("/user/auth/login"); // Chuyển hướng về trang đăng nhập
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#F6F6F6]">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />
        {/* Nội dung chính */}
        <main className="flex-1 p-6 mt-14 ml-64">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
