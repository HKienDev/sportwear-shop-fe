'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // ✅ Kiểm tra nếu đang ở Client
  const router = useRouter(); 

  useEffect(() => {
    setIsClient(true); // ✅ Xác nhận component đã mount
  }, []);

  if (!isClient) return null; // ✅ Tránh lỗi hydration mismatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Gọi API để lấy danh sách user
      const response = await axios.get('https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/user');
      const users = response.data;
  
      // Kiểm tra email có tồn tại không
      const user = users.find((u: { email: string }) => u.email === email);
      if (!user) {
        toast.error('Email không tồn tại trong hệ thống.', { position: 'bottom-right' });
      } else {
        // ✅ Hiển thị toast trong 4 giây
        toast.success('Một email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư đến của bạn.', { 
          position: 'bottom-right', 
          duration: 4000 
        });
  
        // ✅ Chuyển trang sau 4 giây (cùng thời gian với toast)
        setTimeout(() => {
          router.push('/user/auth/forgot-password-otp-2');
        }, 4000);
      }
    } catch (err) {
      console.error('Lỗi khi kiểm tra email:', err);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.', { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận email'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/user/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}