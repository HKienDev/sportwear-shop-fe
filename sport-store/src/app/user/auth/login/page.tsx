"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "@/components/auth/googleLoginButton/page";
import LoginForm from "@/components/auth/loginForm/page";
import { useAuth } from "@/app/context/authContext";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      console.log("Sending login request to:", `${API_URL}/auth/login`);
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const responseData = await res.json();
      console.log("API Login Response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || "Đăng nhập thất bại");
      }

      const { user, accessToken } = responseData;

      if (!accessToken) {
        throw new Error("Không nhận được accessToken từ API");
      }

      console.log("User data:", user);
      console.log("Access token received:", accessToken);

      // Lưu token và user vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Cập nhật user trong AuthContext
      login(user, accessToken);

      // Lấy URL chuyển hướng từ query params hoặc mặc định
      const redirectFrom = searchParams.get("from") || (user.role === "admin" ? "/admin" : "/");
      console.log("Redirecting to:", redirectFrom);

      // Chuyển hướng
      window.location.href = redirectFrom;

    } catch (err: unknown) {
      console.error("Lỗi đăng nhập:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="w-[calc(100vw-40px)] h-[calc(100vh-40px)] bg-white rounded-[12px] shadow-lg overflow-hidden flex">
          <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/30">
              <Image src="/image.png" alt="Sports Player" layout="fill" objectFit="cover" priority />
            </div>
          </div>

          <div className="w-full bg-white lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h2 className="text-4xl text-black font-bold">Đăng nhập</h2>
              </div>

              <LoginForm handleLogin={handleLogin} error={error} loading={loading} />

              <div className="flex justify-center mt-4">
                <GoogleLoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;