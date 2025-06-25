"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GoogleLoginButton from "@/components/auth/googleLoginButton/page";
import RegisterForm from "@/components/auth/registerForm/page";

const RegisterTemplate = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    // Add entrance animation
    setTimeout(() => {
      setAnimateForm(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen relative bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 skew-x-12 transform origin-top-right"></div>
        <div className="absolute top-0 left-0 w-1/4 h-screen bg-gradient-to-b from-red-500/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-t from-red-500/5 to-transparent"></div>
        {/* Animated dots */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-600 rounded-full animate-ping"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-600 rounded-full animate-ping"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-600 rounded-full animate-ping"
            style={{ animationDuration: "5s", animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-2 h-2 bg-red-600 rounded-full animate-ping"
            style={{ animationDuration: "6s", animationDelay: "1.5s" }}
          ></div>
        </div>
        {/* Dynamic lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="black" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="black" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-200 transition-all duration-700 ease-out mb-16 ${
          animateForm ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
        }`}
      >
        {/* Left side - Dynamic Content */}
        <div className="hidden lg:block lg:w-1/2 relative text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-50">
              <Image
                src="/messi.png"
                alt="Sports Player"
                fill
                className="opacity-80 mix-blend-normal object-cover"
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
          <div className="relative h-full flex flex-col justify-between p-6 lg:p-8 z-10">
            <div className="mb-auto">
              <div className="flex items-center space-x-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-wider">SPORTIFY</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 leading-tight text-white">
                <span className="inline-block">Kết nối.</span>
                <span className="inline-block ml-1 text-red-500">Thi đấu.</span>
                <span className="inline-block ml-1">Chiến thắng.</span>
              </h1>
              <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                <div className="py-1 px-3 lg:px-4 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                  Luyện tập
                </div>
                <div className="py-1 px-3 lg:px-4 bg-red-600/80 rounded-full text-sm backdrop-blur-sm border border-red-500/20 hover:bg-red-600/90 transition-colors duration-300 cursor-pointer">
                  Giải đấu
                </div>
                <div className="py-1 px-3 lg:px-4 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                  Huấn luyện
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-5 md:p-6 lg:p-8 text-gray-900">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-4 lg:mb-6">
              <div className="flex justify-center mb-3 lg:mb-4">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full opacity-90"></div>
                  <div className="absolute inset-1 bg-white rounded-full"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 lg:h-8 lg:w-8 text-red-600 relative z-10"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Đăng ký</h2>
              <p className="text-gray-600 text-sm">Tạo tài khoản để bắt đầu</p>
              {/* Animated line */}
              <div className="flex justify-center mt-2 lg:mt-3">
                <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-red-500 to-gray-200 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <RegisterForm />
            </div>

            <div className="mt-4 lg:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
                </div>
              </div>
              <div className="mt-3 lg:mt-4">
                <GoogleLoginButton />
              </div>
            </div>

            <div className="text-center text-sm mt-3 lg:mt-4">
              <span className="text-gray-600">Đã có tài khoản? </span>
              <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-500">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterTemplate;