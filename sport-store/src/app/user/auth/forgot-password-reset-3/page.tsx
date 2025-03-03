'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordReset() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem('resetPasswordToken');
      if (storedToken) {
        setResetToken(storedToken);
        console.log("Token lấy từ localStorage:", storedToken);
      } else {
        setError('Token không hợp lệ hoặc đã hết hạn');
      }
    }
  }, []);

  const validatePassword = (password: string) => password.length >= 8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!validatePassword(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (!resetToken || resetToken.trim() === '') {
      setError('Token không hợp lệ hoặc đã hết hạn');
      console.error("Lỗi: Token không tồn tại hoặc bị trống");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword: password }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error("Lỗi khi parse JSON:", jsonError);
        throw new Error("Lỗi không xác định từ server.");
      }

      if (!response.ok) {
        console.error("Lỗi từ server:", responseData);
        throw new Error(responseData.message || `Server error (${response.status})`);
      }

      console.log('Password reset successful');

      // Xóa resetToken khỏi localStorage sau khi đặt lại mật khẩu thành công
      localStorage.removeItem('resetPasswordToken');

      router.push('/user/auth/login');
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi gửi yêu cầu:", error.message);
        setError(error.message);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Đặt mật khẩu mới</h2>
          <p className="mt-2 text-sm text-gray-600">Phải có ít nhất 8 ký tự</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật Khẩu Mới</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mật khẩu mới"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác Nhận Mật Khẩu</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !formData.password || !formData.confirmPassword}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Cài lại mật khẩu'}
          </button>
        </form>

        <div className="text-center">
          <Link href="/user/auth/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2">
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