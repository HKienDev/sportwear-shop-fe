"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "@/components/auth/googleLoginButton/page";
import LoginForm from "@/components/auth/loginForm/page";
import { useAuth } from "@/context/authContext";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
  
    if (accessToken && storedUser) {
      const userData = JSON.parse(storedUser);
      const redirectFrom = searchParams.get("from") || (userData.role === "admin" ? "/admin" : "/");
      console.log("useEffect redirecting to:", redirectFrom);
  
      // Chỉ chuyển hướng nếu không bị middleware can thiệp
      if (!window.location.pathname.startsWith(redirectFrom)) {
        router.replace(redirectFrom);
      }
    }
  }, [router, searchParams]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");
  
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      console.log("Sending login request to:", `${API_URL}/auth/login`);
  
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Không thể kết nối đến server");
      }
  
      const responseData = await response.json();
      console.log("API Login Response:", responseData);
  
      if (!responseData.success) {
        throw new Error(responseData.message || "Đăng nhập thất bại");
      }
  
      const { user, accessToken } = responseData.data;
  
      // Lưu token vào cookie
      document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; secure; samesite=strict`;
  
      // Lưu user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
  
      // Gọi login từ context
      await login(user, accessToken);
  
      // Debugging logs
      console.log("User Role:", user.role);
      console.log("Redirect from query param:", searchParams.get("from"));
  
      // Chuyển hướng dựa trên role
      const redirectPath = user.role === "admin" ? "/admin" : "/";
      console.log("Redirecting to:", redirectPath);
  
      // Sử dụng setTimeout để đảm bảo state đã được cập nhật
      setTimeout(() => {
        router.push(redirectPath);
      }, 100);
  
    } catch (err: unknown) {
      console.error("Lỗi đăng nhập:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
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