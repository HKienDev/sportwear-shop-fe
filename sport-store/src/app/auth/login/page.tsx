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
  const [animateForm, setAnimateForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    // Add entrance animation
    setTimeout(() => {
      setAnimateForm(true);
    }, 100);
    
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
      <div className="min-h-screen relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 skew-x-12 transform origin-top-right"></div>
          <div className="absolute top-0 left-0 w-1/4 h-screen bg-gradient-to-b from-red-500/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-t from-red-500/5 to-transparent"></div>
          
          {/* Animated dots */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "3s" }}></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "5s", animationDelay: "0.5s" }}></div>
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "6s", animationDelay: "1.5s" }}></div>
          </div>
          
          {/* Dynamic lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="black" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="black" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Main Container */}
        <div 
          className={`w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-200 transition-all duration-700 ease-out ${animateForm ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
        >
          {/* Left side - Dynamic Content */}
          <div className="hidden lg:block lg:w-1/2 relative text-white overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black bg-opacity-50">
                <Image 
                  src="/image.png" 
                  alt="Sports Player" 
                  layout="fill" 
                  objectFit="cover" 
                  className="opacity-50 mix-blend-normal"
                  priority 
                />
              </div>
              
              {/* Overlay pattern */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_60%)]"></div>
              
              {/* Accent elements */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-red-600 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative h-full flex flex-col justify-between p-12 z-10">
              <div className="mb-auto">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold tracking-wider">SPORTIFY</span>
                </div>
                
                <h1 className="text-5xl font-bold mb-4 leading-tight text-white">
                  <span className="inline-block">Kết nối.</span>
                  <span className="inline-block ml-1 text-red-500">Thi đấu.</span>
                  <span className="inline-block ml-1">Chiến thắng.</span>
                </h1>
                
                <div className="flex flex-wrap gap-3 mb-10">
                  <div className="py-1 px-4 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300 cursor-pointer">Luyện tập</div>
                  <div className="py-1 px-4 bg-red-600/80 rounded-full text-sm backdrop-blur-sm border border-red-500/20 hover:bg-red-600/90 transition-colors duration-300 cursor-pointer">Giải đấu</div>
                  <div className="py-1 px-4 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300 cursor-pointer">Huấn luyện</div>
                </div>
              </div>
              
              <div className="backdrop-blur-md rounded-2xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-white/90 text-lg mb-4 italic">
                  Nền tảng này đã thay đổi hoàn toàn cách tôi luyện tập và kết nối với cộng đồng thể thao.
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                    <span className="font-bold">CT</span>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Hán Cao Tổ</p>
                    <p className="text-sm text-gray-300">Vận động viên chuyên nghiệp • Hà Nội</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 text-gray-900">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full opacity-90"></div>
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                <p className="text-gray-600">Nhập thông tin đăng nhập của bạn để tiếp tục</p>
                
                {/* Animated line */}
                <div className="flex justify-center mt-4">
                  <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-red-500 to-gray-200 rounded-full"></div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-600">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Placeholder for your LoginForm component */}
                <LoginForm handleLogin={handleLogin} error={error} loading={loading} />
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleLoginButton />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom info */}
        <div className="absolute bottom-4 text-center text-gray-400 text-xs">
          <p>© 2025 Sportify. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
      
    </GoogleOAuthProvider>
  );
};

export default LoginPage;