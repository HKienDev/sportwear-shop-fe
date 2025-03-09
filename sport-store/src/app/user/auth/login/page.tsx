"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "@/components/GoogleLoginButton/page";
import LoginForm from "@/components/LoginForm/page";
import { useAuth } from "@/app/context/AuthContext";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

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
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      const responseData = await res.json();
      console.log("🚀 API Login Response:", responseData); // Debug API response

      const { user, accessToken, refreshToken } = responseData;

      if (!accessToken) {
        throw new Error("Không nhận được accessToken từ API");
      }

      // Lưu token vào localStorage và đảm bảo đã lưu thành công
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("✅ Đã lưu accessToken:", localStorage.getItem("accessToken")); // Debug token

      // Cập nhật user vào AuthContext
      setUser(user);

      // Điều hướng dựa trên role
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Lỗi đăng nhập:", err.message);
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
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

              {/* Truyền handleLogin, error, loading xuống LoginForm */}
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