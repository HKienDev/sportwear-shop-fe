"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { ERROR_MESSAGES } from "@/config/constants";

const GoogleLoginButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleLogin = async (response: any) => {
    try {
      await loginWithGoogle(response.credential);
      router.push("/");
    } catch (error) {
      console.error("Google login error:", error);
      // Xử lý lỗi đăng nhập Google
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        router.push(`${API_URL}/auth/google`);
      }}
      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <Image
        src="/google.svg"
        alt="Google logo"
        width={20}
        height={20}
        className="mr-2"
      />
      Đăng nhập với Google
    </button>
  );
};

export default GoogleLoginButton;