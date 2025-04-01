"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleLoginButton from "@/components/auth/googleLoginButton/page";
import LoginForm from "@/components/auth/loginForm/page";
import { useAuth } from "@/context/authContext";
import { ERROR_MESSAGES } from "@/config/constants";

const LoginContent = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Add entrance animation
    setTimeout(() => {
      setAnimateForm(true);
    }, 100);
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      const redirectFrom = searchParams.get("from") || "/";
      router.replace(redirectFrom);
    }
  }, [router, searchParams, isAuthenticated]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");
  
    try {
      await login({ email, password });
      
      // Redirect based on role
      const redirectPath = searchParams.get("from") || "/";
      router.replace(redirectPath);
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
        </div>
        <div className={`mt-8 space-y-6 ${animateForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500`}>
          <LoginForm handleLogin={handleLogin} error={error} loading={loading} />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Hoặc</span>
              </div>
            </div>
            <div className="mt-6">
              <GoogleLoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;