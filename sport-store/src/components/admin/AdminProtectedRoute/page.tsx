"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra xem user có tồn tại và có role là admin không
        if (!user) {
          console.log("User chưa đăng nhập, chuyển hướng về trang login");
          router.push("/user/auth/login?from=/admin");
          return;
        }

        if (user.role !== "admin") {
          console.log("User không có quyền admin, chuyển hướng về trang chủ");
          router.push("/");
          return;
        }

        console.log("User có quyền admin, cho phép truy cập");
      } catch (error) {
        console.error("Lỗi kiểm tra quyền admin:", error);
        router.push("/user/auth/login?from=/admin");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, router]);

  // Hiển thị loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Nếu user không tồn tại hoặc không phải admin, không render gì cả
  if (!user || user.role !== "admin") {
    return null;
  }

  // Nếu user là admin, render children
  return <>{children}</>;
};

export default AdminProtectedRoute; 