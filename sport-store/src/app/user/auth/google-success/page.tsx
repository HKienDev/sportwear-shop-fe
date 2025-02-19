"use client"; // Vì đang dùng useEffect
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // App Router dùng next/navigation

const GoogleSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Chạy trên server thì dừng

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // ✅ Lưu token vào localStorage
      localStorage.setItem("access_token", token);

      // ✅ Chuyển hướng về trang chủ hoặc dashboard
      router.push("/");
    } else {
      console.error("Không tìm thấy token!");
      router.push("/login"); // Nếu không có token, quay về login
    }
  }, [router]); // ✅ Fix ESLint: Thêm `router` vào dependency array

  return <p>Đang xác thực...</p>;
};

export default GoogleSuccess;