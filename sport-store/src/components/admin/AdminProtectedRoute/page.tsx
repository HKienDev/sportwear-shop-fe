"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Kiểm tra từ localStorage trước
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/user/auth/login?from=/admin");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [router]);

  // Nếu chưa có user hoặc không phải admin thì không render children
  if (!user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute; 