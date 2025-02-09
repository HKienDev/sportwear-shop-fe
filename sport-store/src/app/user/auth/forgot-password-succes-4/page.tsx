// app/forgot-password-success/page.tsx
'use client';

import Link from 'next/link';

export default function ForgotPasswordSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-500"
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

          <h2 className="text-3xl font-bold text-gray-900">
            Tất cả đã xong!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Mật khẩu của bạn đã được cài lại
          </p>
        </div>

        <div>
          <Link
            href="\user\auth\login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Quay lại trang Đăng Nhập
          </Link>
        </div>
      </div>
    </div>
  );
}