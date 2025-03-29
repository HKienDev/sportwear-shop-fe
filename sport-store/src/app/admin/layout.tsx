"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/adminLayout/sidebar";
import Topbar from "@/components/admin/adminLayout/topbar";
import Footer from "@/components/admin/adminLayout/footer";
import { fetchWithAuth } from "@/lib/api";
import "@/styles/admin.css";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute/page";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchWithAuth("/auth/check");
        if (!response) {
          throw new Error("Không thể kết nối đến server");
        }

        if (!response.ok) {
          throw new Error("Phiên đăng nhập hết hạn");
        }

        const data = await response.json();
        console.log("✅ Response data:", data);

        // Kiểm tra nếu user là admin
        if (data?.user?.role === "admin") {
          console.log("✅ Admin được phép truy cập");
        } else {
          console.warn("❌ Không phải admin, chuyển hướng về trang chủ");
          router.replace("/");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền truy cập:", error);
        router.replace("/user/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
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
    </AdminProtectedRoute>
  );
}
