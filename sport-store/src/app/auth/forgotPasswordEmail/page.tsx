'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { API_URL } from "@/utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending request to API:', `${API_URL}/auth/forgot-password`);
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      console.log('API Response:', response.data);

      if (response.data?.success) {
        localStorage.setItem('forgotPasswordEmail', email);
        setTimeout(() => {
          router.push('/auth/forgotPasswordOtp');
        }, 100);
      } else {
        setError(response.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('API Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error Response:', error.response?.status, error.response?.data);
        if (error.response?.data?.errors) {
          // Xử lý lỗi từ mảng errors
          const errorMessage = error.response.data.errors[0]?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
          setError(errorMessage);
        } else {
          // Xử lý lỗi từ message
          setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
          </p>
          {/* Animated line */}
          <div className="flex justify-center mt-4">
            <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-red-500 to-gray-200 rounded-full"></div>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-600 focus:border-red-600 focus:z-10 sm:text-sm"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận email'}
          </button>
        </form>

        <div className="mt-8 text-center">
          {/* Use onClick for debugging */}
          <Link 
            href="/auth/login" 
            className="font-medium text-red-600 hover:text-red-500 flex items-center justify-center gap-2"
            onClick={() => console.log('Quay lại trang đăng nhập')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}