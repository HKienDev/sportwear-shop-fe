"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const GoogleAuthHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Lưu token vào localStorage để sử dụng sau này
        localStorage.setItem("token", token);

        // Chuyển hướng đến trang chính
        router.push("/");
      } catch (error) {
        console.error("❌ Lỗi khi decode token:", error);
      }
    } else {
      console.error("Không nhận được token trong URL");
    }
  }, [searchParams, router]);

  return <div className="text-center mt-10">Đang xử lý đăng nhập...</div>;
};

const GoogleSuccessPage = () => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Đang tải...</div>}>
      <GoogleAuthHandler />
    </Suspense>
  );
};

export default GoogleSuccessPage;