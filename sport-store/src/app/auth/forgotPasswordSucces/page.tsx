'use client';

import Link from 'next/link';

export default function ForgotPasswordSuccess() {
  return (
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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 md:p-12 border border-gray-200">
        <div className="text-center mb-8">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-10 w-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Tất cả đã xong!</h2>
          <p className="mt-2 text-sm text-gray-600">Mật khẩu của bạn đã được cài lại</p>
          {/* Animated line */}
          <div className="flex justify-center mt-4">
            <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-red-500 to-gray-200 rounded-full"></div>
          </div>
        </div>

        <div>
          <Link
            href="/auth/login"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Quay lại trang Đăng Nhập
          </Link>
        </div>
      </div>
    </div>
  );
}